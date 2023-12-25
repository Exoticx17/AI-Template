import pandas as pd
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
from keras import layers
from sklearn.model_selection import train_test_split
from keras.layers.experimental.preprocessing import TextVectorization
from keras.utils import to_categorical

# Load your CSV data from a local folder
file_path = 'C:/Users/ccoff/OneDrive/Chases Stuff/Coding-Projects/aiproject/python/data/rnnTrain.csv'
data = pd.read_csv(file_path)

# Shuffle training dataframe
train_df_shuffled = data.sample(frac=1, random_state=42)

# Use train_test_split to split training data into training and validation sets
train_sentences, val_sentences, train_labels, val_labels = train_test_split(
    train_df_shuffled["Comment"].to_numpy(),
    train_df_shuffled["Topic"].to_numpy(),
    test_size=0.1,
    random_state=42
)

# Setup text vectorization with custom variables
max_vocab_length = 10000 
max_length = 15 
text_vectorizer = TextVectorization(max_tokens=max_vocab_length,
                                    output_mode="int",
                                    output_sequence_length=max_length)

# Fit the text vectorizer to the training text
text_vectorizer.adapt(train_sentences)
tf.random.set_seed(42)

# Create a Text Embedding
embedding = layers.Embedding(input_dim=max_vocab_length, # set input shape
                             output_dim=128, # set size of embedding vector
                             embeddings_initializer="uniform", # default, intialize randomly
                             input_length=max_length, # how long is each input
                             name="embedding_1")

# Convert labels to numerical categorical format
label_to_categorical = {'Physics': 0, 'Biology': 1, 'Chemistry': 2}  # Map your labels to numerical values
numerical_train_labels = [label_to_categorical[label] for label in train_labels]

# Convert numerical labels to one-hot encoded format
one_hot_train_labels = to_categorical(numerical_train_labels, num_classes=4)  # 4 is the number of classes

numerical_val_labels = [label_to_categorical[label] for label in val_labels]

# Convert numerical labels to one-hot encoded format
one_hot_val_labels = to_categorical(numerical_val_labels, num_classes=4)  # 4 is the number of classes

# Connect Layers
inputs = layers.Input(shape=(1,), dtype="string")
x = text_vectorizer(inputs)
x = embedding(x)
x = layers.Bidirectional(layers.LSTM(64, return_sequences=True))(x)
x = layers.Bidirectional(layers.GRU(64))(x)
outputs = layers.Dense(4, activation="softmax")(x)

# Define the model
model_rnn = tf.keras.Model(inputs=inputs, outputs=outputs)

# Compile the model
model_rnn.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)
total_steps = len(train_sentences) // 32

# Train the model
rnn_model_history = model_rnn.fit(
    train_sentences,
    one_hot_train_labels,
    epochs=15,
    steps_per_epoch=total_steps,
    validation_data=(val_sentences, one_hot_val_labels)
)

# Save the model
model_rnn.save("C:/Users/ccoff/OneDrive/Chases Stuff/Coding-Projects/aiproject/python/saved/rnn_trained_model")


# Plot training and validation loss

plt.plot(rnn_model_history.history['loss'], label='Training Loss')
plt.plot(rnn_model_history.history['val_loss'], label='Validation Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.legend()
plt.show()

# Plot training and validation accuracy
plt.plot(rnn_model_history.history['accuracy'], label='Training Accuracy')
plt.plot(rnn_model_history.history['val_accuracy'], label='Validation Accuracy')
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.legend()
plt.show()
