from flask import Flask, request, jsonify
from pdf2image import convert_from_bytes
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "static/images"
CORS(app)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route("/upload", methods=["POST"])
def upload_pdf():
    file = request.files["pdf"]
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    pdf_path = os.path.join(UPLOAD_FOLDER, secure_filename(file.filename))
    file.save(pdf_path)

    pages = convert_from_bytes(open(pdf_path, "rb").read(), dpi=200)
    image_urls = []

    for i, page in enumerate(pages):
        image_path = os.path.join(OUTPUT_FOLDER, f"{os.path.splitext(file.filename)[0]}_{i+1}.jpg")
        page.save(image_path, "JPEG")
        image_urls.append(f"http://localhost:5000/{image_path}")

    return jsonify({"images": image_urls})

@app.route("/static/images/<path:path>")
def serve_image(path):
    return app.send_static_file(f"images/{path}")

if __name__ == "__main__":
    app.run(debug=True)
