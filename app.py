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
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_agent
from langchain_core.messages import HumanMessage, SystemMessage
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

# Initialize Chat Model
chat_model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash", 
    temperature=0.7,
    system_instruction="You are S.P.A.R.K. — your Smart Personal Assistant for Real-time Knowledge. Your identity is S.P.A.R.K. (Smart Personal Assistant for Real-time Knowledge). Always be helpful, friendly, and professional. If anyone asks 'Who are you?', your reply MUST start with: 'I am S.P.A.R.K. — your Smart Personal Assistant for Real-time Knowledge.' followed by a brief mention that you are a large language model trained by Google."
)
tools = []
chat_agent = create_agent(chat_model, tools)


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
        prompt = f"""You are an expert resume reviewer with years of experience in HR and recruitment.

Please analyze this resume and provide constructive feedback. 
Focus on the following aspects:
1. Content clarity and impact
2. Skills presentation
3. Experience descriptions
4. Specific improvements for {job_role if job_role else 'general job applications'}

Resume content:
{file_content}

Please provide your analysis in a clear, structured format with specific recommendations."""
        
        # Get AI response
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        
        return jsonify({
            'success': True,
            'analysis': response.text
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
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400
        
        user_message = data['message']
        
        if not user_message.strip():
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        # Get AI response
        system_msg = SystemMessage(content="You are S.P.A.R.K. — your Smart Personal Assistant for Real-time Knowledge. Your identity is S.P.A.R.K. (Smart Personal Assistant for Real-time Knowledge). Always be helpful, friendly, and professional. If anyone asks 'Who are you?', your reply MUST start with: 'I am S.P.A.R.K. — your Smart Personal Assistant for Real-time Knowledge.' followed by a brief mention that you are a large language model trained by Google.")
        response = chat_agent.invoke({"messages": [system_msg, HumanMessage(content=user_message)]})
        
        # Extract response content
        reply = ""
        if "messages" in response:
            # The AI response is typically the last message in the sequence
            # Search from the end to find the bot's reply
            for msg in reversed(response["messages"]):
                if hasattr(msg, "content") and msg.content:
                    # Filter out any lingering internal objects if necessary, but content is what we want
                    reply = msg.content
                    break
        
        if not reply:
            reply = str(response)
        
        return jsonify({
            'success': True,
            'response': reply
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


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
            
        # Create message object
        new_message = {
            'timestamp': datetime.now().isoformat(),
            'name': name,
            'email': email,
            'message': message
        }
        
        # Ensure data directory exists
        os.makedirs('data', exist_ok=True)
        file_path = 'data/messages.json'
        
        # Load existing messages or start new list
        messages = []
        if os.path.exists(file_path):
            with open(file_path, 'r') as f:
                try:
                    messages = json.load(f)
                except json.JSONDecodeError:
                    messages = []
        
        # Append new message
        messages.append(new_message)
        
        # Save to Supabase if available
        if supabase:
            try:
                supabase.table('messages').insert(new_message).execute()
                print(f"✅ Message from {name} saved to Supabase")
            except Exception as e:
                print(f"❌ Failed to save to Supabase: {str(e)}")
        
        # Save back to local file (as backup)
        with open(file_path, 'w') as f:
            json.dump(messages, f, indent=4)
            
        # Log to console
        print(f"\n📬 NEW MESSAGE RECEIVED from {name} ({email})")
        print(f"Message: {message[:100]}{'...' if len(message) > 100 else ''}")
        print("-" * 30)
        
        return jsonify({
            'success': True,
            'message': 'Thank you! Your message has been saved.'
        })
        
    except Exception as e:
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
