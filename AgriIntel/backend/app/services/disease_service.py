import json
import logging
import os

from typing import Dict, Any

import numpy as np
import tensorflow as tf

from PIL import Image

from app.config import settings


logger = logging.getLogger(__name__)


# =========================================================
# GLOBAL VARIABLES
# =========================================================

disease_model = None
class_names = []


# =========================================================
# LOAD DISEASE MODEL
# =========================================================

def load_disease_model():

    global disease_model
    global class_names

    logger.info("Initializing disease detection model...")


    # -----------------------------------------------------
    # MODEL PATH
    # -----------------------------------------------------

    model_path = settings.DISEASE_MODEL_PATH

    class_path = settings.DISEASE_CLASS_NAMES_PATH


    # -----------------------------------------------------
    # CHECK MODEL
    # -----------------------------------------------------

    if not os.path.exists(model_path):

        logger.error(
            f"Disease model not found: {model_path}"
        )

        disease_model = None

        return


    try:

        # -------------------------------------------------
        # LOAD KERAS MODEL
        # -------------------------------------------------

        disease_model = tf.keras.models.load_model(
            model_path
        )

        logger.info(
            "Disease model loaded successfully."
        )


        # -------------------------------------------------
        # LOAD CLASS NAMES
        # -------------------------------------------------

        if os.path.exists(class_path):

            with open(
                class_path,
                "r",
                encoding="utf-8"
            ) as f:

                class_names = json.load(f)


            logger.info(
                f"Loaded disease classes: {class_names}"
            )


        else:

            # Fallback classes
            class_names = [
                "Apple_Healthy",
                "Potato_Early_Blight",
                "Potato_Healthy",
                "Tomato_Early_Blight",
                "Tomato_Healthy"
            ]

            logger.warning(
                "class_names.json not found. "
                "Using fallback class names."
            )


    except Exception as e:

        logger.exception(
            f"Failed to load disease model: {e}"
        )

        disease_model = None


# =========================================================
# IMAGE PREPROCESSING
# =========================================================

def preprocess_image(image_bytes: bytes):

    # Convert bytes into image
    image = Image.open(
        __import__("io").BytesIO(image_bytes)
    )


    # Convert to RGB
    image = image.convert("RGB")


    # Resize to MobileNetV2 input size
    image = image.resize(
        (224, 224)
    )


    # Convert image to numpy
    image_array = np.array(
        image,
        dtype=np.float32
    )


    # Add batch dimension
    image_array = np.expand_dims(
        image_array,
        axis=0
    )


    return image_array


# =========================================================
# FORMAT DISEASE NAME
# =========================================================

def format_disease_name(class_name: str):

    # Example:
    # Tomato_Early_Blight
    #
    # becomes:
    # Tomato - Early Blight

    parts = class_name.split("_")


    crop = parts[0]

    disease = " ".join(parts[1:])


    if disease.lower() == "healthy":

        return (
            f"{crop} - Healthy",
            crop
        )


    return (
        f"{crop} - {disease}",
        crop
    )


# =========================================================
# PREDICT DISEASE
# =========================================================

async def predict_plant_disease(
    image_bytes: bytes
) -> Dict[str, Any]:

    if not image_bytes:

        raise ValueError(
            "No image data provided."
        )


    # -----------------------------------------------------
    # CHECK MODEL
    # -----------------------------------------------------

    if disease_model is None:

        raise RuntimeError(
            "Disease model is not loaded."
        )


    # -----------------------------------------------------
    # PREPROCESS IMAGE
    # -----------------------------------------------------

    image_array = preprocess_image(
        image_bytes
    )


    # -----------------------------------------------------
    # PREDICTION
    # -----------------------------------------------------

    predictions = disease_model.predict(
        image_array,
        verbose=0
    )


    # -----------------------------------------------------
    # GET BEST CLASS
    # -----------------------------------------------------

    predicted_index = int(
        np.argmax(predictions[0])
    )


    confidence = float(
        predictions[0][predicted_index]
    )


    # -----------------------------------------------------
    # CLASS NAME
    # -----------------------------------------------------

    predicted_class = class_names[
        predicted_index
    ]


    # -----------------------------------------------------
    # FORMAT RESULT
    # -----------------------------------------------------

    disease_name, crop = format_disease_name(
        predicted_class
    )


    # -----------------------------------------------------
    # SEVERITY
    # -----------------------------------------------------

    if "Healthy" in predicted_class:

        severity = "Healthy"

    elif confidence >= 0.80:

        severity = "Moderate"

    else:

        severity = "Low confidence"


    # -----------------------------------------------------
    # SYMPTOMS
    # -----------------------------------------------------

    if "Healthy" in predicted_class:

        symptoms = [

            "Leaf color and texture appear normal.",

            "No major visible disease symptoms detected.",

            "Continue regular crop monitoring."
        ]

    elif "Early_Blight" in predicted_class:

        symptoms = [

            "Dark brown spots may appear on leaves.",

            "Concentric ring patterns may develop.",

            "Yellowing may occur around infected areas."
        ]

    else:

        symptoms = [

            "Visible signs of plant stress detected.",

            "Further field inspection is recommended."
        ]


    # -----------------------------------------------------
    # TREATMENT
    # -----------------------------------------------------

    if "Healthy" in predicted_class:

        treatment = {

            "organic_control": [

                "Continue balanced irrigation.",

                "Maintain proper field sanitation.",

                "Monitor the crop regularly."
            ],

            "chemical_control": []

        }

    else:

        treatment = {

            "organic_control": [

                "Remove heavily infected leaves.",

                "Avoid excessive moisture on foliage.",

                "Maintain good air circulation."
            ],

            "chemical_control": [

                "Use an appropriately labelled fungicide "
                "according to local agricultural guidance."
            ]

        }


    # -----------------------------------------------------
    # FINAL RESPONSE
    # -----------------------------------------------------

    return {

        "disease_name": disease_name,

        "scientific_name": "",

        "confidence": round(
            confidence,
            4
        ),

        "severity": severity,

        "affected_crop": crop,

        "predicted_class": predicted_class,

        "symptoms": symptoms,

        "treatment": treatment

    }