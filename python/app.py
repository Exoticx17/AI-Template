from flask import Flask, request, jsonify
from keras.preprocessing.text import Tokenizer
from keras.models import load_model
import numpy as np
from keras.preprocessing import image
import tensorflow as tf
from PIL import Image
from keras.preprocessing import image
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the RNN model
rnn_model_path = "C:/Users/ccoff/OneDrive/Chases Stuff/Coding-Projects/aiproject/python/saved/rnn_trained_model"
model_rnn = load_model(rnn_model_path)

# Load the CNN model
cnn_model_path = "C:/Users/ccoff/OneDrive/Chases Stuff/Coding-Projects/aiproject/python/saved/cnn_trained_model"
model_cnn = load_model(cnn_model_path)

# Load the Regression model
regression_model_path = "C:/Users/ccoff/OneDrive/Chases Stuff/Coding-Projects/aiproject/python/saved/prediction_model"
model_regression = load_model(regression_model_path)

# Assuming you have a tokenizer created during training
# Replace this with your actual tokenizer used during training
tokenizer = Tokenizer()  # Create the tokenizer
# Fit tokenizer on your text data
# tokenizer.fit_on_texts(your_text_data)

# API endpoint for text prediction
@app.route('/predict_text', methods=['POST'])
def predict_text():
    data = request.get_json()
    input_text = data['text']

    # Make predictions
    prediction_rnn = model_rnn.predict(np.array([input_text]))

    # Determine categories for text predictions (subjects)
    text_categories = {0: 'Physics', 1: 'Biology', 2: 'Chemistry'}
    text_category = text_categories[np.argmax(prediction_rnn)]

    return jsonify({'text_category': text_category})

# API endpoint for image prediction
@app.route('/predict_image', methods=['POST'])
def predict_image():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image part'})

        image_file = request.files['image']

        if image_file.filename == '':
            return jsonify({'error': 'No selected file'})

        # Add server-side debugging to check received file, if needed
        print(image_file)  # Check if the file object is received properly

        img = Image.open(image_file)
        img = img.resize((224, 224))
        img_array = np.array(img)
        img_array = img_array / 255.0

        # Perform inference using the loaded CNN model (model_cnn)
        # Ensure the model_cnn is correctly loaded and accessible

        # Placeholder prediction
        image_prediction = np.random.rand(1, 3)  # Replace this with your model prediction
        image_categories = {0: 'Nike', 1: 'Adidas', 2: 'Converse'}
        image_category = image_categories[np.argmax(image_prediction)]

        return jsonify({'image_prediction': image_category})

    except Exception as e:
        print('Server-side error:', e)
        return jsonify({'error': 'Error processing image'}), 500

# API endpoint for regression model
@app.route('/predict_regression', methods=['POST'])
def predict_regression():
    data = request.get_json()
    regression_input = np.array(data['array'])

    # Reshape the input data to match the expected shape
    regression_input = regression_input.reshape(1, -1)  # Reshape to (1, num_features)

    # Predict with regression model
    prediction_regression = model_regression.predict(regression_input)

    # Convert predictions to float and then round to the nearest hundredth
    prediction_regression_float = prediction_regression.astype(float)
    rounded_regression_predictions = np.round(prediction_regression_float, decimals=2)
    print(rounded_regression_predictions)

    # Create a dictionary of regression categories and rounded predictions
    regression_categories = {0: 'Physics', 1: 'Biology', 2: 'Chemistry', 3: 'Nike', 4: 'Adidas', 5: 'Converse'}
    regression_ratings = {regression_categories[i]: rounded_regression_predictions[0][i] for i in range(len(rounded_regression_predictions[0]))}

    # Find the favorite regression prediction
    max_regression_index = np.argmax(rounded_regression_predictions)
    favorite_regression_prediction = list(regression_categories.values())[max_regression_index]

    return jsonify({
        'favorite_regression_prediction': favorite_regression_prediction,
        'regression_ratings': regression_ratings
    })

if __name__ == '__main__':
    app.run(debug=True)  # Run Flask app
