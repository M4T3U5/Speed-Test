
from flask import request, url_for, Flask, Response
from flask_api import FlaskAPI, status, exceptions
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def generatePayload ():
    return "0" * 1000000


@app.route("/dataflow", methods=['GET', 'POST'])
def dataFlowFunction():

    dummyData = generatePayload()

    if request.method == 'POST':
        payload = request.form.get("myData")
    #    print(len(payload))
        return Response(status=201)

    if request.method == 'GET':
        return dummyData


@app.route("/", methods=['GET'])
def index():

    if request.method == 'GET':
        return "ola mundo"


def main():
    app.run(port=8766, debug=True)


if __name__ == "__main__":
    main()