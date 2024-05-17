from flask import Flask, jsonify, request, make_response
import requests
import pymongo
import os
from flask_cors import CORS, cross_origin
import json
from bson import json_util
# from mongotriggers import MongoTrigger
from subprocess import Popen
import threading
import bcrypt
import jwt
from functools import wraps
from datetime import datetime, timedelta
import boto3
from cryptography.fernet import Fernet
# Import the necessary modules

from email.mime.multipart import MIMEMultipart

from email.mime.text import MIMEText

from email.mime.application import MIMEApplication

from botocore.exceptions import ClientError

from datetime import datetime, timedelta
from collections import Counter

import pymongo


# import change_stream

ACCESS_KEY = 'TEST'

SECRET_KEY = 'TEST'
encryptsecret="TEST"
# import change_stream

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# conn_url = "mongodb://m001-student:FrdDev54@sandbox-shard-00-00.hb8k2.mongodb.net:27017,sandbox-shard-00-01.hb8k2.mongodb.net:27017,sandbox-shard-00-02.hb8k2.mongodb.net:27017/?ssl=true&replicaSet=atlas-c329am-shard-0&authSource=admin&retryWrites=true/master_tara"  # your connection string
conn_url = "mongodb://localhost:27017/tara"
client = pymongo.MongoClient(conn_url)


conn_url = "mongodb://localhost:27017/security_controls"
clientnew = pymongo.MongoClient(conn_url)


# triggers = MongoTrigger(client)

# print(client)
# Database = client.get_database('master_tara')

# sampleTable = Database.Interfaces
# print(client.changestream.sampleTable.insert_one)

# app.config['CORS_HEADERS'] = 'Content-Type', 'access-control-allow-origin'
app.config['SECRET_KEY'] = 'uywdcjn2398624yudqkjzx217676'

interfaces = []
user_filePath = ""
absPath = []
abs = []
cloud = []
DBAssets = []
application = []

status = ""
device = []
userSession = ""
email = ""

requestQueue = []

departmentName = []
deptCount = []

def notify(op_document):
    print("added data to database")


def getStatus():
    change_stream = client.master_tara.Interfaces.watch(
        [{"$match": {"operationType": {"$in": ["update"]}}}]
    )

    for change in change_stream:
        global status
        global file_path
        global email
        status = ""
        file_path = ""
        email = ""
        # status = change["updateDescription"]["updatedFields"]["status"]
        # user_filePath = change["updateDescription"]["updatedFields"]["filePath"]
        # print(change["updateDescription"]["updatedFields"])
        # print("user session is", userSession)
        document = client.master_tara.Interfaces.find_one({"sessionId": userSession})

        if document:
            file_path = document.get("filePath")
            status = document.get('status')
            email = document.get('email')
        else:
            print("Session ID not found.")
        print("")  # for readability only
        break
        # break


# def runAnotherFile():
#     Popen('python db_access.py')


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        # return 401 if token is not passed
        if not token:
            return jsonify({'message' : 'Token is missing !!'}), 401

        try:
            # decoding the payload to fetch the stored details
            data = jwt.decode(token, app.config['SECRET_KEY'])
            # current_user = User.query\
            #     .filter_by(public_id = data['public_id'])\
            #     .first()
            current_user = client.master_tara.UserData.find_one({"email": data['email']})
        except:
            return jsonify({
                'message' : 'Token is invalid !!'
            }), 401
        # returns the current logged in users context to the routes
        return  f(current_user, *args, **kwargs)

    return decorated


@app.route("/hello", methods=["GET"])
def home():
    resp = make_response("hello")
    resp.headers['server'] = "Test"
    return resp

@app.route('/userFeedback',methods=["POST"])

def userFeedback():

    name=request.json["username"]

    email = request.json["email"]

    feedback= request.json["message"]

    # print(message)



    client = boto3.client('ses',

                      aws_access_key_id=ACCESS_KEY,

                      aws_secret_access_key=SECRET_KEY, region_name='ap-south-1')



    subject = "Feedback from si-tara User"

    sender = "Si.Tara@in.bosch.com"



    # Create the email message

    message = MIMEMultipart()

    message['Subject'] = subject

    message['From'] = email

    message['To'] = sender



    body = MIMEText(f"From {name}," + '\n' + '\n' + '\t' + "Email: " + f"{email}"+ '\n'  + '\t'+  "Feedback: " + f"{feedback}" + '\n')

    print(body)

    message.attach(body)

    try:

        client.send_raw_email(

            Source=email,

            Destinations = [sender],

            RawMessage={'Data': message.as_string()}

        )

        print("Email sent successfully!")

        return jsonify({"message": "successfull"}), 200

    except ClientError as e:

        print(e)

        return jsonify({"message": "failed"}), 401


# @app.route('/interfaces', methods=['POST'])
# # @cross_origin(origin='*',headers=['access-control-allow-origin','Content-Type'])
# def getInterfaces():
#     global interfaces
#     interfaces = request.json["interfaces"]
#     print("pipe interfaces")
#     runAnotherFile()
#     pipe = win32pipe.CreateNamedPipe(
#         r'\\.\pipe\Foo',
#         win32pipe.PIPE_ACCESS_DUPLEX,
#         win32pipe.PIPE_TYPE_MESSAGE | win32pipe.PIPE_READMODE_MESSAGE | win32pipe.PIPE_WAIT,
#         1, 65536, 65536,
#         0,
#         None)
#     try:
#         print("waiting for client")
#         win32pipe.ConnectNamedPipe(pipe, None)
#         print("got client")

#         win32file.WriteFile(pipe, str.encode(f"{interfaces}"))
#         time.sleep(2)
#         win32file.WriteFile(pipe, str.encode(f"{sendFilePath()}"))
#         abs.clear()
#         # print(sendFilePath())
#         print("finished now")
#     finally:
#         win32file.CloseHandle(pipe)
#     return interfaces


@app.route("/addData", methods=["POST"])
# @cross_origin(origin='*',headers=['access-control-allow-origin','Content-Type'])
def getInterfaces():
    global interfaces
    global userSession
    global cloud
    global DBAssets
    global device
    global methodologies
    global application
    global projectName
    global email
    global docType
    global managerName
    global dateTime
    global deptName
    global vuln
    global scope
    global techDesc

    token = None
    # jwt is passed in the request header
    if 'x-access-token' in request.headers:
        token = request.headers['x-access-token']
    # return 401 if token is not passed
    if not token:
        return jsonify({'message' : 'Token is missing !!'}), 401

    interfaces = request.json["interfaces"]
    cloud = request.json["cloud"]
    DBAssets = request.json["DBAssets"]
    device = request.json["device"]
    application = request.json["application"]
    projectName = request.json["ProjectName"]
    userSession = request.json["sessionId"]
    methodologies = request.json["methodologies"]
    data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    email = data['email']
    filePath = request.json['filePath']
    docType = request.json['docType']
    managerName = request.json['managerName']
    dateTime = request.json['dateTime']
    deptName = request.json['deptName']
    vuln = request.json['vulnDoc']
    scope = request.json['scope']
    techDesc = request.json['techDesc']

    queryObject = {
        'interfaces': interfaces if len(interfaces) > 0 else "",
        'cloud': cloud if len(cloud) > 0 else "",
        'DBAssets': DBAssets if len(DBAssets) > 0 else "",
        'device': device if len(device) > 0 else "",
        'application': application if len(application) > 0 else "",
        'sessionId': userSession,
        'status': "NEW",
        'methodology': methodologies,
        'email': email,
        'filePath': filePath,
        'projectName': projectName,
        'docType': docType,
        'managerName': managerName,
        'dateTime': dateTime,
        'deptName': deptName,
        'vulnDoc': vuln,
        'scope': scope,
        'techDesc': techDesc
        }
    # print("from global", getStatus())
    # thread = threading.Thread(target=getStatus)
    # thread.daemon = True
    # thread.start()
    # print(client.master_tara.sampleTable.insert_one(queryObject).inserted_id)

    query = client.master_tara.Interfaces.insert_one(queryObject)



    # change_streams = client.master_tara.Interfaces.watch([{
    # '$match': {
    #     'operationType': { '$in': ['update'] }
    #     }
    # }])

    # for change in change_streams:
    #     print(change['updateDescription']['updatedFields']['status'])
    # change_streams.close()
    print("pipe interfaces")

    # getStatus()

    # pipe = win32pipe.CreateNamedPipe(
    #     r'\\.\pipe\Foo',
    #     win32pipe.PIPE_ACCESS_DUPLEX,
    #     win32pipe.PIPE_TYPE_MESSAGE | win32pipe.PIPE_READMODE_MESSAGE | win32pipe.PIPE_WAIT,
    #     1, 65536, 65536,
    #     0,
    #     None)
    # try:
    #     print("waiting for client")
    #     win32pipe.ConnectNamedPipe(pipe, None)
    #     print("got client")

    #     win32file.WriteFile(pipe, str.encode(f"{interfaces}"))
    #     abs.clear()
    #     # print(sendFilePath())
    #     print("finished now")
    # finally:
    #     win32file.CloseHandle(pipe
    return interfaces


@app.route("/EditDataSecControl", methods=["POST"])
def EditDataSecControl():
    assetName = request.json["asset_list"]
 
    #res = client.tara.jtag.find()
    #print(res)
    keys = [
          "asset",
          "security_goal",
          "security_control",
          "security_control_description"
      ]
 
    res_arr = []
    for asset in assetName:
        collection = clientnew.security_controls[str(asset)]
        res = collection.find()
        print(asset)
        for obj in res:
            # Create an array to store values for this object
            values = []
            # Iterate over each key
           
            for key in keys:
                # If the key exists in the object, append its value to the values array
                if key in obj:
 
                    values.append(obj[key])
                else:
                    values.append("")  # Append None if key doesn't exist
            # Append the values array to the main array
            res_arr.append(values)
    #return res_arr
    return json.dumps(res_arr, indent=4, default=json_util.default)


def hash_password(password):
    password_bytes = password.encode("utf-8")
    hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    return hashed_password.decode("utf-8")

@app.route("/EditData", methods=["POST"])
def EditData():
    assetName = request.json["interfaces"]
    collection = client.tara[assetName]

    res = collection.find()
        
    #res = client.tara.jtag.find()
    #print(res)
    res_arr = []
    for data in res:
        res_arr.append(data)
    print(res_arr)
    #return res_arr 
    return json.dumps(res_arr, indent=4, default=json_util.default)

@app.route("/registerUser", methods=["POST"])
def uploadUserData():
    email_ = request.json["mail"]
    password_ = request.json["password"]
    cipher_suite = Fernet(encryptsecret)
    email_ = cipher_suite.decrypt(email_)
    password_=cipher_suite.decrypt(password_)
    email=email_.decode("utf-8")
    password=password_.decode("utf-8")
    docCount = 0
    LE_xl = 0
    AP_xl = 0
    AP_PDF = 0
    LE_PDF = 0
    AP_AT = 0
    AP_VD = 0
    LE_VD = 0
    AP_SCD = 0
    LE_SCD = 0
    pass_hash = hash_password(password)
    if client.master_tara.UserData.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400

    else:
        query = {"email": email, "password": pass_hash, "LE_xl": LE_xl, "AP_xl": AP_xl, "AP_PDF": AP_PDF, "LE_PDF": LE_PDF, "AP_AT": AP_AT, "AP_VD": AP_VD, "LE_VD": LE_VD, "AP_SCD": AP_SCD, "LE_SCD": LE_SCD}
        client.master_tara.UserData.insert_one(query)
        return jsonify({"message": "Data has been successfully uploaded"}), 201


@app.route("/loginUser", methods=["POST"])
def loginUser():
    email_ = request.json["mail"]
    password_ = request.json["password"]
    cipher_suite = Fernet(encryptsecret)
    email_ = cipher_suite.decrypt(email_)
    password_=cipher_suite.decrypt(password_)
    email=email_.decode("utf-8")
    password=password_.decode("utf-8")
    #CaptchaToken=request.json["CaptchaToken"]
    #CaptchaSecretkey=request.json["CaptchaSecretKey"]
    user = client.master_tara.UserData.find_one({"email": email})
    # CaptchaResponse=requests.get(f'https://www.google.com/recaptcha/api/siteverify?secret={CaptchaSecretkey}&response={CaptchaToken}')
#    print(f'https://www.google.com/recaptcha/api/siteverify?secret={CaptchaSecretkey}&response={CaptchaToken}')
    if user is None:
        return jsonify({"message": "Email not found"}), 404

    else:
        db_password = user.get("password").encode("utf-8")
        if bcrypt.checkpw(password.encode("utf-8"), db_password):
            passwordChanged = user.get("passwordChanged")
            token = jwt.encode({
                'email': user.get("email"),
                'exp' : datetime.utcnow() + timedelta(minutes = 20)
            }, app.config['SECRET_KEY'])
            return jsonify({"message": "Login successful", 'token': token, 'passwordStatus': passwordChanged}), 200
        else:
            return jsonify({"message": "Incorrect password"}), 401

@app.route("/updatePassword", methods=["POST"])
def updatePassword():
    email_ = request.json["mail"]
    password_ = request.json["password"]
    cipher_suite = Fernet(encryptsecret)
    email_ = cipher_suite.decrypt(email_)
    password_=cipher_suite.decrypt(password_)
    email=email_.decode("utf-8")
    password=password_.decode("utf-8")

    pass_hash = hash_password(password)

    filter = { 'email': email }

    # Values to be updated.
    newPassword = { "$set": { 'password': pass_hash, 'passwordChanged': True } }

    client.master_tara.UserData.update_one(filter, newPassword)

    return jsonify({ "message": "Password Updated Successfully"}), 200


def getInput():
    if len(interfaces) > 0:
        return "YES"
    else:
        return "NO"


@token_required
@app.route('/getAssets', methods=["GET"])
def getAssets():
    assetData = client.master_tara.Assets.find()
    for i in assetData:
        return json.dumps(i, indent=4, default=json_util.default)

@app.route('/getUserData', methods=["GET"])
def getUserData():
    token = None
    # jwt is passed in the request header
    if 'x-access-token' in request.headers:
        token = request.headers['x-access-token']
    # return 401 if token is not passed
    if not token:
        return jsonify({'message' : 'Token is missing !!'}), 400

    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        email = data['email']
        userData = client.master_tara.UserData.find_one({'email': email})
        if userData:
            return jsonify({"email": userData['email'], "passwordChanged": userData['passwordChanged']}), 200
        else:
            return jsonify({"message": "user not found"}), 401
    except:
        return jsonify({"message": "token can't be decoded"}), 401

@app.route('/getUserCountByDept', methods=["GET"])
def getUserCountByDept():
    departmentName.clear()
    deptCount.clear()
    docCount = list(client.master_tara.Interfaces.find({"deptName": {"$ne": None}}))
    for entry in docCount:
        departmentName.append(entry.get("deptName"))
    count = Counter(departmentName)
    for deptNames in count.keys():
        counts = count.get(deptNames)
        deptCount.append(counts)
    return jsonify({"deptName": departmentName, "docCount": deptCount, "count": Counter(departmentName)}), 200

# # @cross_origin(origin='*',headers=['access-control-allow-origin','Content-Type'])
# def checkStatus():
#     # change_stream = client.master_tara.Interfaces.watch([{
#     # '$match': {
#     #     'operationType': { '$in': ['update'] }
#     #     }
#     # }])

#     # for change in change_stream:
#     #     # print(change['updateDescription']['updatedFields']['status'])
#     #     global status
#     #     status = change['updateDescription']['updatedFields']['status']
#     if getStatus() == "processing":
#         return "YES"
#     else:
#         return "FALSE"


if __name__ == "__main__":
    # port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=5000, threaded=True)
    # Thread(target=app.run).start()
