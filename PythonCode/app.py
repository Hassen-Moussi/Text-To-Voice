from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from gtts import gTTS
import os
import uuid

app = Flask(__name__)
CORS(app)  # Enable CORS for your Flask app

@app.route('/api/tts', methods=['POST'])
def tts():
    data = request.get_json()
    text = data.get('text')
    language = data.get('language', 'en')

    if not text:
        return jsonify({'error': 'Text is required'}), 400

    try:
        tts = gTTS(text=text, lang=language)
        filename = f"{uuid.uuid4()}.mp3"

        # Save the MP3 file
        with open(filename, 'wb') as f:
            tts.write_to_fp(f)

        # Send the file as an attachment
        response = send_file(filename, as_attachment=True)

        # Define a function to remove the file after the response is sent
        def remove_file(filename):
            try:
                os.remove(filename)
            except Exception as error:
                app.logger.error("Error removing downloaded file", error)

        # Call remove_file after the response is sent
        response.call_on_close(lambda: remove_file(filename))

        return response

    except ValueError as ve:
        return jsonify({'error': f'ValueError: {str(ve)}'}), 400

    except Exception as e:
        return jsonify({'error': f'Internal Server Error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
