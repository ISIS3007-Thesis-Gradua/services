import io
import boto3
import awsgi
from flask import Flask, Response, send_file
from contextlib import closing
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# Constant variable with path prefix
BASE_ROUTE = "/polly"


@app.route(BASE_ROUTE, methods=['GET'])
def speak():
    print("si te respondi we pero me quede chikito")
    AUDIO_FORMATS = {"ogg_vorbis": "audio/ogg",
                     "mp3": "audio/mpeg",
                     "pcm": "audio/wave; codecs=1"}
    client = boto3.client('polly')
    try:
        response = client.synthesize_speech(
            OutputFormat='mp3',
            Text='All Gaul is divided into three parts',
            LanguageCode='es-MX',
            VoiceId='Bianca'
        )
        if "AudioStream" in response:

            with closing(response.get("AudioStream")) as stream:
                print("Sending file")
                return Response(
                    stream.iter_chunks(chunk_size=1024),
                    headers={
                        # NOTE: Ensure stream is not cached.
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    },
                    mimetype=AUDIO_FORMATS["mp3"])
                # return send_file(stream, mimetype=AUDIO_FORMATS['mp3'], attachment_filename='ttsResult', as_attachment=True)
    except Exception as e:
        print(e)
        return Response(
            str(e),
            status=400,
        )


def handler(event, context):
    print('>>>>>INFO>>>>> ${event}')
    return awsgi.response(app, event, context)
