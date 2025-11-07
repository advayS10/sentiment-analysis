import xgboost as xgb
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import re
import pandas as pd
import nltk
import google.generativeai as genai
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
from dotenv import load_dotenv
import os
import torch

# Path to models
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')

# Load hate speech tokenizer and model
try:
    hate_speech_model = pickle.load(open('models/Offensive_model.pkl', 'rb'))
    hate_speech_tokenizer = pickle.load(open('models/Offensive_tokenizer.pkl', 'rb'))
except Exception as e:
    print(f"Error loading hate speech detection model/tokenizer: {e}")


# === Setup and Downloads ===
nltk.download('stopwords')
STOPWORDS = set(stopwords.words('english'))
stemmer = PorterStemmer()

# Load tokenizer and model
try:
    model_roberta = pickle.load(open('models/roberta_model.pkl', 'rb'))
    tokenizer_roberta = pickle.load(open('models/roberta_tokenizer.pkl', 'rb'))
except Exception as e:
    print(f"Error loading RoBERTa model or tokenizer: {e}")

# === Load Models ===
try:
    # Load decision tree and other models using pickle
    model_dt = pickle.load(open('models/model_dtc.pkl', 'rb'))
    cv = pickle.load(open('models/countVectorizer.pkl', 'rb'))
    scaler = pickle.load(open('models/scaler.pkl', 'rb'))
    
    # For XGBoost, we'll try both approaches
    try:
        # First try loading as native XGBoost model
        model_xgb = xgb.Booster()
        model_xgb.load_model('models/model_xgb.pkl')  # Try direct loading
    except Exception as e:
        print(f"Could not load XGBoost model directly, trying pickle: {e}")
        # Fall back to pickle if that fails
        model_xgb = pickle.load(open('models/model_xgb.pkl', 'rb'))
        
except Exception as e:
    print(f"Error loading models: {e}")


# === Google Gemini API ===
load_dotenv() 
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# === Flask Setup ===
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})  # React app port

# === Preprocessing ===
def preprocess_text(text):
    if not isinstance(text, str):
        text = str(text) if text is not None else ""
    review = re.sub(r'[^a-zA-Z]', ' ', text)
    review = review.lower().split()
    review = [stemmer.stem(word) for word in review if word not in STOPWORDS]
    return ' '.join(review)

# === Sentiment Prediction ===
def predict_feedback(text, model):
    processed = preprocess_text(text)
    vector = cv.transform([processed]).toarray()
    scaled = scaler.transform(vector)
    
    # XGBoost models need DMatrix for prediction
    if isinstance(model, xgb.Booster):
        dmatrix = xgb.DMatrix(scaled)
        prediction = model.predict(dmatrix)
        return "Positive Feedback" if prediction[0] > 0.5 else "Negative Feedback"
    else:
        # For sklearn models like Decision Tree
        prediction = model.predict(scaled)
        return "Positive Feedback" if prediction[0] == 1 else "Negative Feedback"
    
def predict_with_roberta(text):
    try:
        inputs = tokenizer_roberta(text, return_tensors="pt", truncation=True, padding=True)
        with torch.no_grad():
            outputs = model_roberta(**inputs)
        logits = outputs.logits
        predicted_class = torch.argmax(logits, dim=1).item()
        
        labels_map = {
            0: "Negative Feedback",
            1: "Neutral Feedback",
            2: "Positive Feedback"
        }
        return labels_map[predicted_class]
    except Exception as e:
        print("RoBERTa prediction error:", e)
        return "Error in RoBERTa prediction"



# === AI Response Generation ===
def generate_ai_response(text):
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(f"Respond to this review/tweet: '{text}'. Write a suitable and formal AI-generated response.")
        return response.text
    except Exception as e:
        print("AI Error:", e)
        return "AI Response unavailable."
    
def predict_hate_speech(text):
    try:
        inputs = hate_speech_tokenizer(
            text,
            padding=True,
            truncation=True,
            max_length=128,
            return_tensors="pt"
        )
        with torch.no_grad():
            outputs = hate_speech_model(**inputs)
            logits = outputs.logits
            prediction = torch.argmax(logits, dim=1).item()

        return "Hate Speech Detected" if prediction == 1 else "Clean"
    except Exception as e:
        print("Hate speech prediction error:", e)
        return "Error in Hate Speech Detection"

# === Predict for Single Review ===
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    review_text = data.get('text', '')

    if not review_text:
        return jsonify({"error": "No text provided"}), 400

    xgb_result = predict_feedback(review_text, model_xgb)
    dtc_result = predict_feedback(review_text, model_dt)
    roberta_result = predict_with_roberta(review_text)
    ai_result = generate_ai_response(review_text)

    return jsonify({
        "xgb_prediction": xgb_result,
        "dtc_prediction": dtc_result,
        "roberta_prediction": roberta_result,
        "ai_response": ai_result
    })


@app.route('/upload', methods=['POST'])
def upload_file():
    print("Received upload request")
    
    if 'file' not in request.files:
        print("No file part in the request")
        return jsonify({"error": "No file part"}), 400
        
    file = request.files.get('file')
    if not file or file.filename == '':
        print("No file selected")
        return jsonify({"error": "No file selected"}), 400
        
    print(f"File received: {file.filename}")
    
    try:
        df = pd.read_csv(file)
        print(f"CSV loaded successfully with {len(df)} rows")
        
        if 'verified_reviews' not in df.columns:
            print("Missing required column: verified_reviews")
            return jsonify({"error": "CSV must contain 'verified_reviews' column"}), 400

        df = df.dropna(subset=['verified_reviews'])
        print(f"After dropping NAs: {len(df)} rows")

        results = []
        for index, row in df.iterrows():
            review = row['verified_reviews']
            sentiment = predict_with_roberta(review)
            ai_reply = generate_ai_response(review)
            hate_speech_result = predict_hate_speech(review)
            results.append({
                "id": index,
                "text": review,
                "sentiment": sentiment,
                "hate_speech_detection": hate_speech_result,
                "ai_response": ai_reply,
            })
        
        print(f"Processed {len(results)} reviews")
        return jsonify(results)
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        return jsonify({"error": f"Error processing file: {str(e)}"}), 500

# === AI Reply for a Given Text ===
@app.route('/generate-ai', methods=['POST'])
def ai_reply():
    data = request.json
    review = data.get('text', '')

    if not review:
        return jsonify({"error": "No text provided"}), 400

    ai_reply = generate_ai_response(review)
    return jsonify({"ai_response": ai_reply})

# === Run Flask ===
if __name__ == '__main__':
    app.run(debug=True)