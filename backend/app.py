import logging
import os
from io import BytesIO
from PIL import Image, ImageEnhance
import requests
import base64
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from pathlib import Path
from flask_cors import CORS  # Import CORS

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CarStudioConverter:
    def __init__(self, api_key, remove_bg_api_key):
        self.logger = logging.getLogger(__name__)
        self.api_key = api_key
        self.remove_bg_api_key = remove_bg_api_key
        self.segmind_url = "https://api.segmind.com/v1/sd1.5-img2img"
        self.remove_bg_url = "https://api.remove.bg/v1.0/removebg"

    def image_file_to_base64(self, image_path):
        """Convert an image file to base64"""
        try:
            with open(image_path, 'rb') as f:
                image_data = f.read()
            return base64.b64encode(image_data).decode('utf-8')
        except FileNotFoundError:
            self.logger.error(f"File not found: {image_path}")
            raise

    def process_with_segmind(self, image_base64, prompt, negative_prompt, is_interior=False):
        """Process the image using Segmind API"""
        try:
            strength_value = 0.2 if is_interior else 0.35
            data = {
                "image": image_base64,
                "samples": 1,
                "prompt": prompt,
                "negative_prompt": negative_prompt,
                "scheduler": "DDIM",
                "num_inference_steps": 25,
                "guidance_scale": 10.5,
                "strength": strength_value,
                "seed": 98877465625,
                "img_width": 2048,  # Increased width
                "img_height": 2048,  # Increased height
                "base64": True
            }
            headers = {'x-api-key': self.api_key}
            response = requests.post(self.segmind_url, json=data, headers=headers)
            if response.status_code != 200:
                raise Exception(f"API request failed: {response.status_code}, {response.text}")
            
            image_data = base64.b64decode(response.json()['image'])
            enhanced_image = Image.open(BytesIO(image_data))
            
            # Save enhanced image temporarily
            temp_path = "temp_enhanced.png"
            enhanced_image.save(temp_path)
            
            return enhanced_image, temp_path
        except Exception as e:
            self.logger.error(f"Segmind API processing failed: {e}")
            raise

    def remove_background_with_removebg(self, image_path):
        """Remove background using remove.bg API"""
        try:
            with open(image_path, 'rb') as f:
                image_data = f.read()
            
            headers = {'X-Api-Key': self.remove_bg_api_key}
            data = {
                'size': 'auto',
                'type': 'car',
                'shadow_type': 'car',  # Adds a realistic car shadow
                'shadow_opacity': '90',  # Keeps default shadow opacity
                'format': 'png'
            }
            
            response = requests.post(self.remove_bg_url, files={'image_file': image_data}, data=data, headers=headers)
            
            if response.status_code != 200:
                raise Exception(f"remove.bg API request failed: {response.status_code}, {response.text}")

            car_rgba = Image.open(BytesIO(response.content)).convert('RGBA')
            return car_rgba
        except Exception as e:
            self.logger.error(f"Background removal with remove.bg failed: {e}")
            raise

    def calculate_optimal_scale(self, car_size, bg_size):
        """Calculate scale factor for dominant dimension with 10% margin"""
        scale_w = (bg_size[0] * 0.9) / car_size[0]
        scale_h = (bg_size[1] * 0.9) / car_size[1]
        return min(scale_w, scale_h)

    # def align_car_with_background(self, car_image, background):
    #     bg_width, bg_height = background.size
    #     car_width, car_height = car_image.size

    #     scale_factor = self.calculate_optimal_scale((car_width, car_height), (bg_width, bg_height))

    #     new_size = (int(car_width * scale_factor), int(car_height * scale_factor))
    #     car_image = car_image.resize(new_size, Image.Resampling.LANCZOS)

    #     x_offset = (bg_width - new_size[0]) // 2
    #     y_offset = bg_height - new_size[1] - int(bg_height * 0.2)

    #     aligned_image = Image.new("RGBA", (bg_width, bg_height))
    #     aligned_image.paste(car_image, (x_offset, y_offset), car_image)

    #     return aligned_image

    def align_car_with_background(self, car_image, background):
        """
        Aligns car image with background using adaptive positioning for optimal placement
        in the lower half of the image.
        """
        bg_width, bg_height = background.size
        car_width, car_height = car_image.size

        # Calculate scale factor while maintaining aspect ratio
        scale_factor = self.calculate_optimal_scale((car_width, car_height), (bg_width, bg_height))

        # Resize car image
        new_size = (int(car_width * scale_factor), int(car_height * scale_factor))
        car_image = car_image.resize(new_size, Image.Resampling.LANCZOS)

        # Center horizontally
        x_offset = (bg_width - new_size[0]) // 2

        # Calculate vertical position adaptively
        # Define the boundaries of the lower half
        lower_half_start = bg_height * 0.4  # Start of lower half
        bottom_margin = bg_height * 0.1     # Margin from bottom
        
        # Calculate available space in lower half
        available_height = bg_height - lower_half_start - bottom_margin
        
        # Adjust vertical position based on car size relative to available space
        car_height_ratio = new_size[1] / available_height
        
        if car_height_ratio > 0.8:
            # For taller cars, position closer to the middle
            y_offset = int(lower_half_start - (new_size[1] * 0.2))
        elif car_height_ratio < 0.5:
            # For shorter cars, position closer to the bottom
            y_offset = int(bg_height - bottom_margin - new_size[1])
        else:
            # For medium-sized cars, use proportional positioning
            y_offset = int(bg_height - bottom_margin - new_size[1] - (available_height * 0.1))

        # Create new image with transparent background
        aligned_image = Image.new("RGBA", (bg_width, bg_height))
        
        # Paste car onto the new image
        aligned_image.paste(car_image, (x_offset, y_offset), car_image)
        
        return aligned_image

    def convert_to_studio_image(self, car_image_path, background_url):
        """Optimized conversion workflow"""
        try:
            enhancement_prompt = (
                "studio enhanced photography of the vehicle, the vehicle must not be distorted or changed at all. "
                "MUST retain original vehicle shape. The lighting and shadows are to be enhanced, high-quality result. "
                "Align the vehicle's proportion to be straight ONLY if needed. DO NOT ALTER the shape of the vehicle in any form, and do not change the car's logo. MUST maintain the logo of the car as it is"
            )

            negative_prompt = "nude, disfigured, blurry"

            # Step 1: Process with Segmind
            image_base64 = self.image_file_to_base64(car_image_path)
            enhanced_car, temp_enhanced_path = self.process_with_segmind(
                image_base64, enhancement_prompt, negative_prompt, is_interior=False
            )

            # Step 2: Remove background using remove.bg
            car_rgba = self.remove_background_with_removebg(temp_enhanced_path)

            # Step 3: Load background
            # bg_response = requests.get(background_url)
            background = Image.open(background_url).convert("RGB")
            # background = Image.open(BytesIO(bg_response.content)).convert("RGB")

            # Step 4: Align car with background
            aligned = self.align_car_with_background(car_rgba, background)

            # Step 5: Merge images
            final_image = Image.alpha_composite(background.convert("RGBA"), aligned).convert("RGB")

            # Step 6: Enhance sharpness
            enhancer = ImageEnhance.Sharpness(final_image)
            final_image = enhancer.enhance(1.2)

            # Step 7: Resize for higher resolution
            current_width, current_height = final_image.size
            target_width = min(current_width * 4, 8192)  # Cap at 8192px
            target_height = min(current_height * 4, 8192)  # Cap at 8192px
            
            final_image = final_image.resize(
                (target_width, target_height), 
                Image.Resampling.LANCZOS
            )

            # Save with higher quality
            buffered = BytesIO()
            final_image.save(buffered, format="PNG", quality=100, optimize=True)
            img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')

            return img_str

        except Exception as e:
            self.logger.error(f"Conversion failed: {e}")
            raise

    def convert_to_studio_image_interior(self, car_image_path, background_url):
        """Optimized conversion workflow for interior images"""
        try:
            # Step 1: Remove background using remove.bg
            car_rgba = self.remove_background_with_removebg(car_image_path)

            # Step 2: Load background
            bg_response = requests.get(background_url)
            background = Image.open(BytesIO(bg_response.content)).convert("RGB")

            # Step 3: Resize background to match car interior dimensions
            car_width, car_height = car_rgba.size
            background = background.resize((car_width, car_height), Image.Resampling.LANCZOS)

            # Step 4: Merge images
            final_image = Image.alpha_composite(background.convert("RGBA"), car_rgba).convert("RGB")

            # Step 5: Enhance sharpness
            enhancer = ImageEnhance.Sharpness(final_image)
            final_image = enhancer.enhance(1.2)

            # Step 6: Resize for higher resolution
            current_width, current_height = final_image.size
            target_width = min(current_width * 4, 8192)  # Cap at 8192px
            target_height = min(current_height * 4, 8192)  # Cap at 8192px
            
            final_image = final_image.resize(
                (target_width, target_height), 
                Image.Resampling.LANCZOS
            )

            # Save with higher quality
            buffered = BytesIO()
            final_image.save(buffered, format="PNG", quality=100, optimize=True)
            img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')

            return img_str

        except Exception as e:
            self.logger.error(f"Conversion failed: {e}")
            raise

# Initialize the converter with API keys from environment variables
try:
    SEGMENT_API_KEY = os.getenv("SEGMENT_API_KEY")
    REMOVE_BG_API_KEY = os.getenv("REMOVE_BG_API_KEY")

    if not SEGMENT_API_KEY or not REMOVE_BG_API_KEY:
        raise ValueError("SEGMENT_API_KEY and REMOVE_BG_API_KEY must be set in the environment variables.")

    converter = CarStudioConverter(SEGMENT_API_KEY, REMOVE_BG_API_KEY)

except ValueError as e:
    logger.error(f"Initialization error: {e}")
    exit()  # Exit if the API keys are not properly set

@app.route('/api/enhanceExterior', methods=['POST'])
def convert_exterior_image():  # renamed from convert_image
    """
    Endpoint to convert an image to a studio image.
    Expects:
    - image: Image file of the car.
    Returns:
    - JSON response with:
        - image: Base64 encoded image if successful.
        - error: Error message if unsuccessful.
    """
    try:
        # Retrieve parameters from the request
        image_file = request.files['image']  # Changed 'car_image' to 'image'
        # background_url = "https://www.shutterstock.com/image-vector/white-grey-gradient-studio-dark-600nw-2507567311.jpg"  #Hardcoded, remove it later
        # background_url = "https://img.freepik.com/premium-photo/empty-garage_950558-3016.jpg"\
        background_url = "bg_img_final.png"
        # Check if the image file was provided
        if not image_file:
            return jsonify({'error': 'No image provided'}), 400  # Changed 'car_image' to 'image'

        # Save the uploaded image temporarily
        temp_image_path = "temp_car_image.png"
        image_file.save(temp_image_path)

        # Perform the conversion
        converted_image = converter.convert_to_studio_image(temp_image_path, background_url)

        # Remove the temporary image file
        os.remove(temp_image_path)

        # Return the base64 encoded image
        return jsonify({'image': converted_image}), 200

    except Exception as e:
        logger.error(f"Error processing request: {e}")
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/enhanceInterior', methods=['POST'])
def convert_interior_image():  # renamed from convert_image
    """
    Endpoint to convert an image to a studio image.
    Expects:
    - image: Image file of the car.
    Returns:
    - JSON response with:
        - image: Base64 encoded image if successful.
        - error: Error message if unsuccessful.
    """
    try:
        # Retrieve parameters from the request
        image_file = request.files['image']  # Changed 'car_image' to 'image'
        background_url = "https://www.shutterstock.com/image-vector/white-grey-gradient-studio-dark-600nw-2507567311.jpg"  #Hardcoded, remove it later
        # background_url = "https://img.freepik.com/premium-photo/empty-garage_950558-3016.jpg"
        # Check if the image file was provided
        if not image_file:
            return jsonify({'error': 'No image provided'}), 400  # Changed 'car_image' to 'image'

        # Save the uploaded image temporarily
        temp_image_path = "temp_car_image.png"
        image_file.save(temp_image_path)

        # Perform the conversion
        converted_image = converter.convert_to_studio_image_interior(temp_image_path, background_url)

        # Remove the temporary image file
        os.remove(temp_image_path)

        # Return the base64 encoded image
        return jsonify({'image': converted_image}), 200

    except Exception as e:
        logger.error(f"Error processing request: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))