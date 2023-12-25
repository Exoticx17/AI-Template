from keras.models import load_model
import numpy as np
from keras.preprocessing import image

# Load the RNN model
rnn_model_path = "C:/Users/ccoff/OneDrive/Chases Stuff/Coding-Projects/aiproject/python/saved/rnn_trained_model"
model_rnn = load_model(rnn_model_path)

# Load the CNN model
cnn_model_path = "C:/Users/ccoff/OneDrive/Chases Stuff/Coding-Projects/aiproject/python/saved/cnn_trained_model"
model_cnn = load_model(cnn_model_path)

# Load the Regression model
regression_model_path = "C:/Users/ccoff/OneDrive/Chases Stuff/Coding-Projects/aiproject/python/saved/prediction_model"
model_regression = load_model(regression_model_path)

# Example data you want to test with the models
input_text = "The human body has many interesting parts, espically the brain, like Noahs."
image_path = "C:/Users/ccoff/OneDrive/Chases Stuff/Coding-Projects/aiproject/python/data/nike.jpg"
# Example numeric input for regression, matching the model's expected input shape
regression_input = np.array([[6, 12, 10, 5, 8, 3]])  

# Load and preprocess the image for CNN prediction
img_size = (224, 224)
img = image.load_img(image_path, target_size=img_size)
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)
img_array /= 255.  # Normalization

# Make predictions
prediction_rnn = model_rnn.predict(np.array([input_text]))
prediction_cnn = model_cnn.predict(img_array)
prediction_regression = model_regression.predict(regression_input)

# Determine categories for image predictions (brands)
image_categories = {0: 'Nike', 1: 'Adidas', 2: 'Converse'}
image_category = image_categories[np.argmax(prediction_cnn)]

# Determine categories for text predictions (subjects)
text_categories = {0: 'Physics', 1: 'Biology', 2: 'Chemistry'}
text_category = text_categories[np.argmax(prediction_rnn)]

# Round other predictions to the nearest hundredth
rounded_regression_predictions = np.round(prediction_regression, decimals=2)
regression_categories = {0: 'Physics', 1: 'Biology', 2: 'Chemistry', 3: 'Nike', 4: 'Adidas', 5: 'Converse'}
# Create a dictionary of regression categories and rounded predictions
regression_ratings = {regression_categories[i]: rounded_regression_predictions[i] for i in range(len(rounded_regression_predictions))}
regression_category = regression_categories[np.argmax(prediction_regression)]

# Example: Printing predictions
print("Image Category:", image_category)
print("Text Category:", text_category)
print("Rounded Regression Predictions:", regression_ratings)
print("Favorite Regression Prediction:", regression_category)
