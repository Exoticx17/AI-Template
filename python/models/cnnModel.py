import tensorflow as tf
from efficientnet.tfkeras import EfficientNetB3
from keras.models import Model
from keras.optimizers import Adam
from keras.preprocessing.image import ImageDataGenerator
from keras.layers import Dense, Flatten, Dropout, BatchNormalization
import matplotlib.pyplot as plt

# Define the paths to your train and test directories
train_dir = 'C:/Users/ccoff/OneDrive/Chases Stuff/Coding-Projects/aiproject/python/data/train'
test_dir = 'C:/Users/ccoff/OneDrive/Chases Stuff/Coding-Projects/aiproject/python/data/test'

# Define image size and batch size
img_size = (224, 224)
batch_size = 32

# Use ImageDataGenerator for image preprocessing and augmentation
train_datagen = ImageDataGenerator(
    rescale=1./255,  # Normalize pixel values
    rotation_range=20,  # Randomly rotate images
    width_shift_range=0.2,  # Randomly shift images horizontally
    height_shift_range=0.2,  # Randomly shift images vertically
    shear_range=0.2,  # Shear transformations
    zoom_range=0.2,  # Randomly zoom inside pictures
    horizontal_flip=True,  # Randomly flip images horizontally
    fill_mode='nearest'  # Fill mode for filling in newly created pixels
)

test_datagen = ImageDataGenerator(rescale=1./255)  # Only rescaling for test data

# Use flow_from_directory to load images from directories and perform preprocessing
train_data = train_datagen.flow_from_directory(
    train_dir,
    target_size=img_size,
    batch_size=batch_size,
    class_mode='categorical'  # For multi-class classification
)

test_data = test_datagen.flow_from_directory(
    test_dir,
    target_size=img_size,
    batch_size=batch_size,
    class_mode='categorical'
)

# Load ResNet50 with pretrained weights (without the top classification layer)
base_model = EfficientNetB3(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

# Freeze the layers of the base model
for layer in base_model.layers:
    layer.trainable = False

# Add your custom classification layers on top of the ResNet50 base
x = base_model.output
x = Flatten()(x)
x = Dense(256, activation='relu')(x)
x = BatchNormalization()(x)
x = Dropout(0.5)(x)
x = Dense(128, activation='relu')(x)
x = BatchNormalization()(x)
output = Dense(3, activation='softmax')(x)  # Adjust units for your classification task

# Create the full model
model_cnn = Model(inputs=base_model.input, outputs=output)

# Compile the model
model_cnn.compile(optimizer=Adam(lr=0.0001), loss='categorical_crossentropy', metrics=['accuracy'])

# Fit the model
cnn_model_history = model_cnn.fit(train_data,
                        epochs=10,
                        steps_per_epoch=len(train_data),
                        validation_data=test_data,
                        validation_steps=len(test_data))

# Freeze the first few layers and unfreeze the rest for fine-tuning
for layer in base_model.layers[:-15]:
    layer.trainable = False

# Recompile the model after changing trainable layers
model_cnn.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train the model again with fine-tuning
cnn_full_history = model_cnn.fit(train_data, epochs=10, steps_per_epoch=len(train_data),
                    validation_data=test_data, validation_steps=len(test_data))


# Save the model
model_cnn.save("C:/Users/ccoff/OneDrive/Chases Stuff/Coding-Projects/aiproject/python/saved/cnn_trained_model")


# Plot training and validation loss

plt.plot(cnn_full_history.history['loss'], label='Training Loss')
plt.plot(cnn_full_history.history['val_loss'], label='Validation Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.legend()
plt.show()

# Plot training and validation accuracy
plt.plot(cnn_full_history.history['accuracy'], label='Training Accuracy')
plt.plot(cnn_full_history.history['val_accuracy'], label='Validation Accuracy')
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.legend()
plt.show()
