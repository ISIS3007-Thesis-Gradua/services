import io
import base64
import boto3
import awsgi
from flask import Flask, Response, send_file
from contextlib import closing
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# Constant variable with path prefix
BASE_ROUTE = "/polly"
AUDIO_FORMATS = {"ogg_vorbis": "audio/ogg",
                 "mp3": "audio/mpeg",
                 "pcm": "audio/wave; codecs=1"}


@app.route(BASE_ROUTE, methods=['POST'])
def speak():
    try:
        client = boto3.client('polly')
        response = client.synthesize_speech(
            OutputFormat='mp3',
            Text='All Gaul is divided into three parts',
            LanguageCode='es-MX',
            VoiceId='Bianca'
        )
        if "AudioStream" in response:

            with closing(response.get("AudioStream")) as stream:
                print("Sending file")
                content = stream.read()
                print(content)
                audioEncoded = base64.b64encode(content)
                print(audioEncoded)
                return Response(
                    audioEncoded,
                    headers={
                        # NOTE: Ensure stream is not cached.
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                        'Content-Type': AUDIO_FORMATS["mp3"],
                        'Content-Disposition': 'attachment; filename=pollyttsresult.mp3',
                    },
                    mimetype=AUDIO_FORMATS["mp3"])
    except Exception as e:
        print(e)
        return Response(
            str(e),
            status=400,
        )


def handler(event, context):
    print('>>>>>INFO>>>>> ${event}')
    return awsgi.response(app, event, context)
