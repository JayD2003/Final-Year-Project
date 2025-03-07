from flask import Flask, request, jsonify
from ultralytics import YOLO
from PIL import Image
import io
import os
from flask_cors import CORS  # (Optional, if frontend is on a different domain)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://coral-sense.netlify.app"}})  # ✅ Allow only your frontend

# Load YOLOv11m-cls model (Update the path)
model = YOLO("models/coral-classifier.pt")  # Load local YOLOv11 model

@app.route('/')
def home():
    return '''
    <h1>🪸 Coral Reef Health API</h1>
    <p>Welcome to the Coral Reef Health Analysis API!</p>
    <p>Use the <code>/predict</code> endpoint to analyze coral reef images.</p>
    '''


@app.route('/predict', methods=['POST'])
def predict():
    print(request.files)  # Debugging
    if 'image' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['image']

    image = Image.open(io.BytesIO(file.read())).convert('RGB')

    # Perform inference
    results = model(image)
    predicted_class = results[0].names[int(results[0].probs.top1)]
    confidence = results[0].probs.top1conf.item() * 100

    return jsonify({
            'prediction': predicted_class,
            'confidence': f"{confidence:.2f}%",
        })


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Use Render's assigned port
    app.run(host="0.0.0.0", port=port, debug=False)  # ✅ Disable debug mode
