import os
import json
import tensorflow as tf

from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input


# ==========================================
# CONFIGURATION
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

TRAIN_DIR = os.path.join(
    BASE_DIR,
    "data",
    "disease",
    "train"
)

VALIDATION_DIR = os.path.join(
    BASE_DIR,
    "data",
    "disease",
    "validation"
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models",
    "disease_model"
)

MODEL_PATH = os.path.join(
    MODEL_DIR,
    "crop_disease_model.keras"
)

CLASS_PATH = os.path.join(
    MODEL_DIR,
    "class_names.json"
)


IMAGE_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS = 10


# ==========================================
# CHECK DATASET
# ==========================================

if not os.path.exists(TRAIN_DIR):
    raise FileNotFoundError(
        f"Training directory not found: {TRAIN_DIR}"
    )

if not os.path.exists(VALIDATION_DIR):
    raise FileNotFoundError(
        f"Validation directory not found: {VALIDATION_DIR}"
    )


# ==========================================
# LOAD DATASET
# ==========================================

print("Loading training dataset...")

train_dataset = tf.keras.utils.image_dataset_from_directory(
    TRAIN_DIR,
    image_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=True
)


print("Loading validation dataset...")

validation_dataset = tf.keras.utils.image_dataset_from_directory(
    VALIDATION_DIR,
    image_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False
)


class_names = train_dataset.class_names

print("\nClasses detected:")
for index, name in enumerate(class_names):
    print(index, "=", name)


# ==========================================
# SAVE CLASS NAMES
# ==========================================

os.makedirs(MODEL_DIR, exist_ok=True)

with open(CLASS_PATH, "w") as file:
    json.dump(class_names, file, indent=4)

print("\nClass names saved.")


# ==========================================
# PERFORMANCE OPTIMIZATION
# ==========================================

AUTOTUNE = tf.data.AUTOTUNE

train_dataset = train_dataset.prefetch(
    buffer_size=AUTOTUNE
)

validation_dataset = validation_dataset.prefetch(
    buffer_size=AUTOTUNE
)


# ==========================================
# DATA AUGMENTATION
# ==========================================

data_augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.1),
])


# ==========================================
# MOBILE NET V2
# ==========================================

base_model = MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet"
)


# Freeze pretrained layers initially

base_model.trainable = False


# ==========================================
# BUILD MODEL
# ==========================================

inputs = layers.Input(
    shape=(224, 224, 3)
)

x = data_augmentation(inputs)

x = preprocess_input(x)

x = base_model(
    x,
    training=False
)

x = layers.GlobalAveragePooling2D()(x)

x = layers.Dropout(0.2)(x)

outputs = layers.Dense(
    len(class_names),
    activation="softmax"
)(x)


model = models.Model(
    inputs,
    outputs
)


# ==========================================
# COMPILE
# ==========================================

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)


# ==========================================
# MODEL SUMMARY
# ==========================================

model.summary()


# ==========================================
# TRAIN
# ==========================================

print("\nStarting training...\n")

history = model.fit(
    train_dataset,
    validation_data=validation_dataset,
    epochs=EPOCHS
)


# ==========================================
# SAVE MODEL
# ==========================================

model.save(MODEL_PATH)

print("\n===================================")
print("MODEL TRAINING COMPLETED")
print("===================================")

print(f"Model saved at:")
print(MODEL_PATH)

print(f"\nClasses saved at:")
print(CLASS_PATH)