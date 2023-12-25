import pandas as pd
import ast
import numpy as np
from sklearn.model_selection import train_test_split
from keras.models import Model
from keras.layers import Input, Dense, Dropout, BatchNormalization, LeakyReLU
import matplotlib.pyplot as plt

# Load the data from the CSV file
file_path = 'C:/Users/ccoff/OneDrive/Chases Stuff/Coding-Projects/aiproject/python/data/votingTrain.csv'
data = pd.read_csv(file_path)

# Convert string representations of lists to actual lists for 'Ratings' and 'Output' columns
data['Ratings'] = data['Ratings'].apply(lambda x: np.array(ast.literal_eval(x)))
data['Output'] = data['Output'].apply(lambda x: np.array(ast.literal_eval(x)))

# Assuming 'Ratings' are the input features and 'Output' is the target variable
X = np.array(data['Ratings'].tolist())  # Convert list of lists to a numpy array
y = np.array(data['Output'].tolist())   # Convert list of lists to a numpy array

# Splitting the data into training and testing sets
train_sentences, val_sentences, train_labels, val_labels = train_test_split(X, y, test_size=0.2, random_state=42)

# Define input layer
input_layer = Input(shape=(train_sentences.shape[1],))

# Hidden layers with batch normalization, LeakyReLU activation, and dropout
hidden0 = Dense(256)(input_layer)
batch0 = BatchNormalization()(hidden0)
activation0 = LeakyReLU(alpha=0.1)(batch0)
dropout0 = Dropout(0.2)(activation0)

hidden1 = Dense(128)(dropout0)
batch1 = BatchNormalization()(hidden1)
activation1 = LeakyReLU(alpha=0.1)(batch1)
dropout1 = Dropout(0.2)(activation1)

hidden2 = Dense(64)(dropout1)
batch2 = BatchNormalization()(hidden2)
activation2 = LeakyReLU(alpha=0.1)(batch2)
dropout2 = Dropout(0.2)(activation2)

hidden3 = Dense(32)(dropout2)
batch3 = BatchNormalization()(hidden3)
activation3 = LeakyReLU(alpha=0.1)(batch3)
dropout3 = Dropout(0.2)(activation3)

hidden4 = Dense(16)(dropout3)
batch4 = BatchNormalization()(hidden4)
activation4 = LeakyReLU(alpha=0.1)(batch4)
dropout4 = Dropout(0.2)(activation4)

# Output layer
output_layer = Dense(train_labels.shape[1])(hidden4)  # Adjust the output shape accordingly

# Create the model
regression_model = Model(inputs=input_layer, outputs=output_layer)

# Compile the model
regression_model.compile(optimizer='adam', loss='mean_squared_error', metrics=['mae'])

# Fit the model with 20 epochs and manage steps per epoch
regression_history = regression_model.fit(train_sentences, train_labels, epochs=50, batch_size=32, validation_data=(val_sentences, val_labels), steps_per_epoch=len(train_sentences)//32)

# Save the trained model
regression_model.save("C:/Users/ccoff/OneDrive/Chases Stuff/Coding-Projects/aiproject/python/saved/prediction_model")

# Plot training and validation loss
plt.plot(regression_history.history['loss'], label='Training Loss')
plt.plot(regression_history.history['val_loss'], label='Validation Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.legend()
plt.show()
