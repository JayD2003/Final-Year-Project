from flask import Flask, request, jsonify
import torch
from PIL import Image
import io
from ultralytics import YOLO



app = Flask(__name__)

# Load your pre-trained model
model = YOLO('C:/Users/jayas/OneDrive/Desktop/Coral-Reef-Health-Monitoring-and-Plastic-Detection-main/coral reef/backend/healthy-bleach-coral-classifier.pt')
model.eval()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Read image file from request
        img_file = request.files['image']
        img = Image.open(io.BytesIO(img_file.read()))

        # Pre-process image and run through the model
        # (Modify this based on your model's requirements)
        output = model(img)
        # Process output and return response
        result = output.argmax(dim=1).item()  # Assuming binary classification
        return jsonify({'prediction': 'healthy' if output[0].names[int(output[0].probs.top1)] == 0 else 'bleached'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
