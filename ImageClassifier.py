import cv2
import numpy as np
import streamlit as st
from PIL import Image
from tensorflow.keras.applications.mobilenet_v2 import (
    MobileNetV2,
    preprocess_input,
    decode_predictions,
)


# Load the pre-trained MobileNetV2 model
def load_model():
    model = MobileNetV2(weights="imagenet")
    return model


# Preprocess the image for model input
def preprocess_image(image):
    img = np.array(image)  # Convert PIL image to numpy array
    img = cv2.resize(img, (224, 224))  # Resize to 224x224 pixels
    img = preprocess_input(img)  # Preprocess as per MobileNetV2 requirements
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    return img


# Make predictions using the model
def classify_image(model, image):
    try:
        processed_image = preprocess_image(image)
        predictions = model.predict(processed_image)  # ✅ Fixed: use processed_image
        decoded_preds = decode_predictions(predictions, top=3)[
            0
        ]  # ✅ Fixed: renamed variable
        return decoded_preds

    except Exception as e:
        st.error(f"An error occurred during classification: {str(e)}")
        return None


# Streamlit app
def main():
    st.set_page_config(
        page_title="AI Image Classification", page_icon="🖼️", layout="centered"
    )

    st.title("Image Classification")
    st.write("Upload an image, and the AI model tell its categories.")

    @st.cache_resource
    def load_cached_model():
        return load_model()

    model = load_cached_model()

    uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png"])

    if uploaded_file is not None:
        image = Image.open(uploaded_file)
        st.image(image, caption="Uploaded Image", use_container_width=True)

        if st.button("Classify Image"):
            with st.spinner("Classifying image..."):
                predictions = classify_image(model, image)

                if predictions:
                    st.subheader("Classification Results:")
                    for _, label, score in predictions:
                        st.write(
                            f"**{label}**: {score*100:.2f}%"
                        )  # ✅ Fixed: proper percentage


if __name__ == "__main__":
    main()
