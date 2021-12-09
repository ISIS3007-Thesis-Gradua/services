import awsgi
from flask_cors import CORS
from flask import Flask, jsonify, make_response
import boto3
import tempfile
import os
myText = """
Hello,
My name is Eralper.
Welcome to my website kodyaz.com
"""


app = Flask(__name__)
CORS(app)
# Constant variable with path prefix
BASE_ROUTE = "/polly"


@app.route(BASE_ROUTE, methods=['GET'])
def polly():
    client = boto3.client('polly')
    voice = client.synthesize_speech(
        OutputFormat='mp3',
        Text='All Gaul is divided into three parts',
        VoiceId='Joanna',
    )
    try:
        print("1")
        print(voice['AudioStream'].next())
        print("2")
        response = make_response(voice['AudioStream'].next())
        response.headers['Content-Type'] = 'audio/mpeg'
        response.headers['Content-Disposition'] = 'attachment; filename=sound.mp3'
        response.headers.extend({
            'Content-Type': 'audio/mpeg',
            'Content-Disposition': 'attachment; filename=sound.mp3',
            'Cache-Control': 'no-cache'
        })
        return response
    except Exception as e:
        print(e)


def handler(event, context):

    return awsgi.response(app, event, context)
