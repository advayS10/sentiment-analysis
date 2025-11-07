# AI Sentiment Analyzer

Flask-based API for sentiment analysis, hate speech detection, and AI-generated responses using multiple ML models.

## Features

- **Multi-Model Sentiment Analysis**: XGBoost, Decision Tree, and RoBERTa transformer
- **Hate Speech Detection**: Identifies offensive content
- **AI Response Generation**: Automated replies via Google Gemini API
- **Batch Processing**: Upload CSV files for bulk analysis
- **Single Text Analysis**: Real-time sentiment prediction

## Tech Stack

- Flask + Flask-CORS
- XGBoost & Decision Tree Classifier
- RoBERTa Transformer (PyTorch)
- Google Gemini 1.5 Pro API
- NLTK for text preprocessing

## Installation

```bash
# Clone repository
git clone [<your-repo-url>](https://github.com/advayS10/sentiment-analysis.git)
cd ai-sentiment-analyzer

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Environment Setup

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

## Required Models

Place the following pickle files in the `models/` directory:
- `model_xgb.pkl` - XGBoost model
- `model_dtc.pkl` - Decision Tree model
- `roberta_model.pkl` - RoBERTa model
- `roberta_tokenizer.pkl` - RoBERTa tokenizer
- `Offensive_model.pkl` - Hate speech detection model
- `Offensive_tokenizer.pkl` - Hate speech tokenizer
- `countVectorizer.pkl` - Text vectorizer
- `scaler.pkl` - Feature scaler

## Usage

```bash
# Run the Flask server
python app.py

# Server runs on http://localhost:5000
# Frontend expected on http://localhost:5173
```

## API Endpoints

### 1. Single Text Prediction
```bash
POST /predict
Content-Type: application/json

{
  "text": "This product is amazing!"
}

Response:
{
  "xgb_prediction": "Positive Feedback",
  "dtc_prediction": "Positive Feedback",
  "roberta_prediction": "Positive Feedback",
  "ai_response": "Thank you for your feedback..."
}
```

### 2. CSV File Upload (Batch Processing)
```bash
POST /upload
Content-Type: multipart/form-data

file: reviews.csv (must contain 'verified_reviews' column)

Response:
[
  {
    "id": 0,
    "text": "Review text",
    "sentiment": "Positive Feedback",
    "hate_speech_detection": "Clean",
    "ai_response": "AI generated response"
  },
  ...
]
```

### 3. Generate AI Response
```bash
POST /generate-ai
Content-Type: application/json

{
  "text": "Your review text"
}

Response:
{
  "ai_response": "AI generated formal response"
}
```

## Dependencies

```txt
Flask==3.0.0
flask-cors==4.0.0
xgboost==2.0.3
scikit-learn==1.3.2
transformers==4.35.0
torch==2.1.0
pandas==2.1.3
nltk==3.8.1
google-generativeai==0.3.1
python-dotenv==1.0.0
```

## Text Preprocessing

The application performs:
1. Remove non-alphabetic characters
2. Convert to lowercase
3. Remove stopwords
4. Apply Porter Stemming
5. Vectorization and scaling

## Model Pipeline

1. **Input Text** → Preprocessing
2. **XGBoost** + **Decision Tree** predictions
3. **RoBERTa** transformer for advanced sentiment analysis
4. **Hate Speech Detection** using transformer model
5. **Gemini API** generates contextual AI response

## CSV Format

Your CSV file must contain a `verified_reviews` column:

```csv
verified_reviews
"Great product, highly recommend!"
"Terrible experience, do not buy."
```

## Error Handling

- Missing models: Check `models/` directory
- API errors: Verify GEMINI_API_KEY in `.env`
- CSV errors: Ensure `verified_reviews` column exists

## CORS Configuration

Currently configured for frontend at `http://localhost:5173`. Update CORS settings in code if needed:

```python
CORS(app, resources={r"/*": {"origins": "http://your-frontend-url"}})
```

## License

MIT License
