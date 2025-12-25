from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import io
import os
import json
from datetime import datetime
import google.generativeai as genai
from dotenv import load_dotenv
import cv2
import numpy as np
from PIL import Image
from tensorflow.keras.applications.mobilenet_v2 import (
    MobileNetV2,
    preprocess_input,
    decode_predictions,
)
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Google AI
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize Supabase Client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = None

if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Supabase initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize Supabase: {str(e)}")
else:
    print("⚠️ Supabase credentials missing. Local file storage will be used as fallback.")

# Load Image Classification Model
image_model = MobileNetV2(weights="imagenet")


# Initialize Chat Model with Google Search Grounding
# Using Gemini's built-in search - no external APIs needed!
chat_model_with_search = genai.GenerativeModel(
    model_name='gemini-2.5-flash',
    tools='google_search_retrieval'  # Built-in Google Search
)

# Fallback model without search for non-search queries
chat_model_basic = genai.GenerativeModel(
    model_name='gemini-2.5-flash'
)

print("✅ Gemini models initialized with Google Search grounding")


# Helper Functions for Analytics
def log_usage(tool_name):
    """Log tool usage to Supabase or console"""
    try:
        entry = {
            'timestamp': datetime.now().isoformat(),
            'tool_name': tool_name,
            'ip_address': request.remote_addr
        }
        
        if supabase:
            supabase.table('usage_logs').insert(entry).execute()
            print(f"📊 Activity logged: {tool_name}")
        else:
            print(f"📊 Activity (Local): {tool_name}")
    except Exception as e:
        print(f"⚠️ Failed to log usage: {str(e)}")


# Helper Functions for Resume Review
def extract_text_from_pdf(pdf_file):
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")


# Helper Functions for Image Classification
def preprocess_image_for_classification(image):
    """Preprocess image for MobileNetV2"""
    img = np.array(image)
    img = cv2.resize(img, (224, 224))
    img = preprocess_input(img)
    img = np.expand_dims(img, axis=0)
    return img


# API Endpoints

@app.route('/api/resume-review', methods=['POST'])
def resume_review():
    """Endpoint for resume review"""
    log_usage('resume_review')
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        job_role = request.form.get('jobRole', '')
        job_description = request.form.get('jobDescription', '')
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Extract text based on file type
        if file.filename.endswith('.pdf'):
            file_content = extract_text_from_pdf(io.BytesIO(file.read()))
        elif file.filename.endswith('.txt'):
            file_content = file.read().decode('utf-8')
        else:
            return jsonify({'error': 'Invalid file type. Only PDF and TXT are supported'}), 400
        
        if not file_content.strip():
            return jsonify({'error': 'File does not have any content'}), 400
        
        # Create prompt for AI analysis
        prompt = f"""You are a brutally honest, zero-fluff recruitment critic and expert resume reviewer. 
Your goal is to tear apart this resume and give the candidate the harsh truth they need to hear to actually get hired. NO SUGAR-COATING.

Analyze the resume for the role of: {job_role if job_role else 'General Role'}
{"Compare it strictly against this Job Description:" if job_description else ""}
{job_description if job_description else ""}

Focus on:
1. Hard Truths: What is objectively wrong or weak?
2. Red Flags: Why would a recruiter toss this in the trash in 5 seconds?
3. Keyword Gaps: What essential skills are missing?
4. Formatting Nightmares: Is it readable for an ATS?

IMPORTANT: You must also provide a numerical ATS compatibility score between 0 and 100. Be strict. If it's bad, give it a low score.

Format your response as follows:
ATS Score: [Score]
Analysis:
[Your brutal, honest, and direct feedback here in markdown format. Use bolding and headers for emphasis.]

Actionable Suggestions:
[A numbered list of specific steps the candidate must take to fix the issues identified.]

Resume content:
{file_content}"""
        
        # Get AI response
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        text = response.text
        
        # Parse ATS score and analysis
        ats_score = 0
        analysis_text = text
        
        if "ATS Score:" in text:
            try:
                score_part = text.split("ATS Score:")[1].split("\n")[0].strip()
                # Remove any non-numeric characters like '%'
                score_str = "".join(filter(str.isdigit, score_part))
                if score_str:
                    ats_score = int(score_str)
                
                if "Analysis:" in text:
                    analysis_text = text.split("Analysis:")[1].strip()
                else:
                    analysis_text = text.split(score_part)[1].strip()
            except:
                pass

        return jsonify({
            'success': True,
            'analysis': analysis_text,
            'ats_score': ats_score
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/image-classify', methods=['POST'])
def image_classify():
    """Endpoint for image classification"""
    log_usage('image_classify')
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check file type
        if not file.filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            return jsonify({'error': 'Invalid file type. Only JPG, JPEG, and PNG are supported'}), 400
        
        # Open and process image
        image = Image.open(io.BytesIO(file.read()))
        processed_image = preprocess_image_for_classification(image)
        
        # Make predictions
        predictions = image_model.predict(processed_image)
        decoded_preds = decode_predictions(predictions, top=3)[0]
        
        # Format results
        results = [
            {
                'label': label,
                'confidence': float(score * 100)
            }
            for _, label, score in decoded_preds
        ]
        
        return jsonify({
            'success': True,
            'predictions': results
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/chat', methods=['POST'])
def chat():
    """Endpoint for chat functionality"""
    log_usage('chatbot')
    try:
        data = request.json
        history = data.get('messages', [])
        
        # Get the latest message
        latest_message = history[-1].get('content', '') if history else data.get('message', '')
        
        # Prepend system instructions
        today = datetime.now().strftime("%B %d, %Y")
        system_prompt = f"""You are S.P.A.R.K. — your Smart Personal Assistant for Real-time Knowledge. 
Today's date is {today}. 
Your identity is S.P.A.R.K. (Smart Personal Assistant for Real-time Knowledge). 
You have access to Google Search for real-time information.
Use search for: current weather, news, sports scores, stock prices, or any time-sensitive data.
Always be helpful, friendly, and professional.
If anyone asks 'Who are you?', reply: 'I am S.P.A.R.K. — your Smart Personal Assistant for Real-time Knowledge. I'm powered by Google's Gemini AI.'"""
        
        # Build chat history for Gemini
        gemini_history = []
        for msg in history[:-1]:  # All except the last message
            role = 'user' if msg.get('role') == 'user' else 'model'
            gemini_history.append({
                'role': role,
                'parts': [msg.get('content', '')]
            })
        
        reply = None
        
        # Try with Search Grounding Model first
        try:
            print(f"DEBUG: Attempting chat with Search Model for message: {latest_message[:50]}...")
            chat_session = chat_model_with_search.start_chat(history=gemini_history)
            full_prompt = f"{system_prompt}\n\nUser: {latest_message}"
            response = chat_session.send_message(full_prompt)
            reply = response.text
            print("✅ Successfully got response from Search Model")
        except Exception as search_error:
            print(f"⚠️ Search grounding model failed: {str(search_error)}")
            # Fallback to Basic Model
            try:
                print("DEBUG: Falling back to Basic Model...")
                chat_session = chat_model_basic.start_chat(history=gemini_history)
                full_prompt = f"{system_prompt}\n\nUser: {latest_message}"
                response = chat_session.send_message(full_prompt)
                reply = response.text
                print("✅ Successfully got response from Basic Model")
            except Exception as basic_error:
                print(f"❌ Basic model also failed: {str(basic_error)}")
                raise basic_error

        if not reply:
            reply = "I'm sorry, I couldn't process that response."
        
        return jsonify({
            'success': True,
            'response': reply
        })
    
    except Exception as e:
        print(f"❌ CRITICAL Chat Endpoint Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500



@app.route('/', methods=['GET'])
def index():
    """Root endpoint for Hugging Face Spaces"""
    return jsonify({
        'status': 'active',
        'message': 'Welcome to S.P.A.R.K. AI Tools API',
        'docs_url': 'See README.md for API documentation',
        'endpoints': {
            'resume_review': '/api/resume-review',
            'image_classify': '/api/image-classify',
            'chat': '/api/chat'
        }
    })


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'SPARK AI Tools API is running',
        'database': 'connected' if supabase else 'local_only'
    })


@app.route('/api/messages', methods=['GET'])
def get_messages():
    """Endpoint for admin to view messages"""
    secret_key = request.args.get('key')
    admin_secret = os.getenv("ADMIN_SECRET_KEY", "spark_admin_2025")
    
    if not secret_key or secret_key != admin_secret:
        return jsonify({'error': 'Unauthorized'}), 401
        
    try:
        if supabase:
            # Fetch from Supabase
            result = supabase.table('messages').select("*").order('timestamp', desc=True).execute()
            messages = result.data
        else:
            # Fallback to local file
            file_path = 'data/messages.json'
            if os.path.exists(file_path):
                with open(file_path, 'r') as f:
                    messages = json.load(f)
            else:
                messages = []
                
        return jsonify({
            'success': True,
            'count': len(messages),
            'messages': messages
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Endpoint for admin to view usage statistics"""
    secret_key = request.args.get('key')
    admin_secret = os.getenv("ADMIN_SECRET_KEY", "spark_admin_2025")
    
    if not secret_key or secret_key != admin_secret:
        return jsonify({'error': 'Unauthorized'}), 401
        
    try:
        if supabase:
            # Fetch usage logs from Supabase
            result = supabase.table('usage_logs').select("tool_name").execute()
            logs = result.data
            
            # Count occurrences
            stats = {}
            for log in logs:
                tool = log['tool_name']
                stats[tool] = stats.get(tool, 0) + 1
                
            return jsonify({
                'success': True,
                'total_uses': len(logs),
                'breakdown': stats
            })
        else:
            return jsonify({'error': 'Statistics require Supabase connection'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/contact', methods=['POST'])
def contact():
    """Endpoint for contact form submission"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        message = data.get('message', '').strip()
        
        if not name or not email or not message:
            return jsonify({'error': 'All fields are required'}), 400
            
        new_message = {
            'timestamp': datetime.now().isoformat(),
            'name': name,
            'email': email,
            'message': message
        }
        
        # 1. Try Supabase (Primary)
        if supabase:
            try:
                supabase.table('messages').insert(new_message).execute()
                print(f"✅ Message from {name} saved to Supabase")
                return jsonify({'success': True, 'message': 'Sent via Supabase'})
            except Exception as e:
                print(f"❌ Supabase save failed: {str(e)}")

        # 2. Try Local Fallback (Secondary)
        try:
            # Use /tmp on Spaces to avoid Permission Denied
            data_dir = '/tmp/spark_data' if os.name != 'nt' else 'data'
            os.makedirs(data_dir, exist_ok=True)
            file_path = os.path.join(data_dir, 'messages.json')
            
            messages = []
            if os.path.exists(file_path):
                with open(file_path, 'r') as f:
                    try:
                        messages = json.load(f)
                    except:
                        messages = []
            
            messages.append(new_message)
            with open(file_path, 'w') as f:
                json.dump(messages, f, indent=4)
            
            print(f"⚠️ Message from {name} saved to LOCAL storage")
            return jsonify({'success': True, 'message': 'Sent via Local Storage'})
        except Exception as local_err:
            print(f"❌ Local storage also failed: {str(local_err)}")
            return jsonify({'error': 'Could not save message anywhere'}), 500

    except Exception as e:
        print(f"❌ Contact endpoint CRITICAL error: {str(e)}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 SPARK AI Tools Backend Server")
    print("="*60)
    print("Server running on: http://localhost:5000")
    print("Health check: http://localhost:5000/api/health")
    print("\nAvailable endpoints:")
    print("  POST /api/resume-review - Resume analysis")
    print("  POST /api/image-classify - Image classification")
    print("  POST /api/chat - Chat with AI")
    print("="*60 + "\n")
    
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
