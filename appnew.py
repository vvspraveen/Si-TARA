from flask import Flask, jsonify, request, make_response, redirect, send_file
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
import re
import cv2
import easyocr
from pdfminer.high_level import extract_pages
from pdfminer.layout import LTTextBoxHorizontal
from fuzzywuzzy import process
 
from email.mime.multipart import MIMEMultipart
 
from email.mime.text import MIMEText
 
from email.mime.application import MIMEApplication
 
from botocore.exceptions import ClientError, NoCredentialsError
 
from datetime import datetime, timedelta
from collections import Counter
import mysql.connector
import mysql
import time
from dotenv import load_dotenv
import os
# import change_stream
 
 
# import change_stream
 
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
 
pem_file_path = "%2Fapp%2Fglobal-bundle.pem"
#conn_url = "mongodb://MSECL6:Phantom2024*@master-tara.cpwdcswc6fon.ap-south-1.docdb.amazonaws.com:27017/?tls=true&tlsCAFile="+pem_file_path+"&replicaSet=rs0&readPreference=primary&retryWrites=false/master_tara"
conn_url = "mongodb://sitara:Phantom2024*@si-tara-database.cluster-cpwdcswc6fon.ap-south-1.docdb.amazonaws.com:27017/?tls=true&tlsCAFile="+pem_file_path+"&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false"
client1=pymongo.MongoClient( "mongodb://sitara:Phantom2024*@si-tara-database.cluster-cpwdcswc6fon.ap-south-1.docdb.amazonaws.com:27017/?tls=true&tlsCAFile="+pem_file_path+"&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false/tara_new")
client2=pymongo.MongoClient( "mongodb://sitara:Phantom2024*@si-tara-database.cluster-cpwdcswc6fon.ap-south-1.docdb.amazonaws.com:27017/?tls=true&tlsCAFile="+pem_file_path+"&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false/Attack_Trees1")
client = pymongo.MongoClient(conn_url)
 
app.config['SECRET_KEY'] = 'uywdcjn2398624yudqkjzx217676'
 
interfaces = []
user_filePath = ""
absPath = []
abs = []
cloud = []
DBAssets = []
application = []
automotive = []
 
status = ""
device = []
userSession = ""
email = ""
 
requestQueue = []
 
departmentName = []
deptCount = []
 
interface_assets = ['USB','Wifi', 'JTAG', 'NFC', 'BLE', 'CAN', 'Flexray', 'Serial Port']
 
aws_assets = [
    'S3', 'EC2', 'API Gateway', 'App Mesh', 'Athena', 'Cloud Map', 'Cloud Search', 'Direct Connect',
    'Elastic Block Storage', 'Elastic Container Service', 'Elastic Kubernetes Service', 'EMR', 'Fsx for Lustre',
    'Fsx for Windows', 'Global Accelerator', 'Lambda', 'Lightsail', 'Neptune', 'Outposts', 'RDS on VMWare',
    'RDS', 'Route 53', 'S3 Glacier', 'Storage Gateway', 'Timestream', 'VMWare Cloud', 'VPC', 'EC2 Auto Scaling',
    'Elastic Container Registry', 'AWS Batch', 'Serverless Application Repository', 'Aurora', 'Dynamodb',
    'Cloudfront', 'Cognito', 'Deepcomposer', 'Deeplens', 'Deepracer', 'Directory Service', 'Elastic Beanstalk',
    'Guardduty', 'Inspector', 'Polly', 'Rekognition', 'Sagemaker', 'Snowball', 'Textract', 'Transcribe',
    'Translate', 'AWS Data Pipeline', 'AWS Data Exchange', 'AWS Kinesis Video Streams', 'AWS Redshift',
    'AWS QuickSight', 'AWS Personalize', 'AWS Panorama', 'AWS OpenSearch Service', 'AWS MSK', 'AWS Monitron',
    'AWS Lookout for Vision', 'AWS Lookout for Metrics', 'AWS Lookout for Equipment', 'AWS Lex',
    'AWS Lake Formation', 'AWS Kinesis Firehose', 'AWS Kinesis Data Streams', 'AWS Kinesis Data Analytics',
    'AWS Kinesis', 'AWS Kendra', 'AWS Glue', 'AWS Simple Email Service', 'CloudTrail', 'Web Application Firewall',
    'AWS KMS', 'REST API', 'AWS Elastic File System', 'AWS Private Link', 'AWS Shield Advanced',
    'AWS Certificate Manager', 'AWS RDS for PostgreSQL']
 
azure_assets = [
    'Active Directory','API Management', 'App Service', 'Batch', 'Backup', 'CDN', 'Cosmos Database',
    'Cache for Redis', 'Data Explorer', 'Event Hubs', 'Cognitive services', 'Express Route',
    'IOT Hub', 'Event Grid', 'Databricks', 'Blob Storage', 'Container Instances',
    'Container Registry', 'DevOps', 'Digital Twins', 'Firewall', 'Front Door',
    'Functions', 'Information Protection', 'Kubernetes service (aks)', 'Load Balancer',
    'Logic Apps', 'Machine Learning', 'MariaDB Database', 'Media Services', 'Monitor',
    'MySQL Database', 'Notification Hubs', 'Policy', 'Azure Postgresql', 'Private Link',
    'Quantum', 'Sentinel', 'Service Bus', 'Site Recovery', 'SQL Database', 'Time Series Insights',
    'Virtual Machines', 'Virtual network (vnet)', 'SQL Managed Instance', 'Storage',
    'Synapse analytics', 'Azure API for FHIR', 'Azure Cognitive Search', 'Azure Data Factory',
    'Azure File Storage', 'Azure IoT Central', 'Azure Stack', 'Azure Stream Analytics',
    'Azure Traffic Manager', 'Azure Virtual WAN', 'Azure Search', 'Data Lake Storage',
    'Cost management & billing']
 
gcp_assets = [
    'App Engine','Cloud Functions', 'Cloud Speech-to-Text Api', 'Cloud Storage', 'Compute_Engine',
    'Kubernetes Engine', 'Cloud BigQuery', 'Cloud CDN', 'Cloud Console', 'Cloud Monitoring',
    'Cloud SQL', 'Cloud TPU', 'Big table', 'Cloud data flow', 'Cloud data proc',
    'Cloud data proc metastore', 'Cloud key system management', 'Cloud shell',
    'Cloud translation API', 'SDK', 'IAM', 'Identity Aware-Proxy', 'Interconnect',
    'Load Balancing', 'Networking', 'Text-to-Speech API', 'Vertex Al', 'VPN', 'Cloud Build',
    'Cloud Dataproc Hadoop', 'Cloud Deploy ', 'Cloud Firewall', 'Cloud Run', 'Cloud Shell Editor',
    'Cloud Spanner', 'Cloud Data fusion', 'Cloud Dataproc Hive', 'Cloud memorystore',
    'Cloud Natural Language API', 'Cloud Vision API', 'Auto ML', 'Cloud Audit Logging',
    'Cloud DLP', 'Cloud logging', 'Cloud security command centre']
 
db_assets = ['MySQL', 'PostgreSQL', 'Oracle Database', 'Microsoft SQL Server', 'IBM DB2']
 
automotive_assets = ['event data recorder', 'firmware', 'internal communication messages',
    'safety system', 'toe connected actuators', 'eeprom', 'emmc', 'ethernet switch',
    'gps data communication', 'ipc', 'lpddr4', 'nor flash', 'ssd', 'telematics', 'uart']
 
load_dotenv('/app/.env')
 
SECRET_KEY = os.getenv('SECRET_KEY')
ACCESS_KEY = os.getenv('ACCESS_KEY')
BUCKET_NAME = os.getenv('BUCKET_NAME')
encryptsecret=os.getenv('encryptsecret')
 
test = os.getenv('test')
 
print(test)
 
def filter_texts_function(texts):
    unique_texts = set()
    filtered_texts = []
    for text in texts:
        if text not in unique_texts:
            unique_texts.add(text)
            filtered_texts.append(text)
    return filtered_texts
 
def create_acronyms_mapping(asset_list):
    acronym_mapping = {}
    for asset in asset_list:
        # Split the asset name into words
        words = asset.split()
        # Filter out 'AWS' from the list of words to avoid including it in the acronym
        filtered_words = [word for word in words if word.upper() != 'AWS']
        if len(filtered_words) == 1:
            # If there's only one word left after filtering, use it as is
            acronym_mapping[filtered_words[0].lower()] = asset
        else:
            # Generate an acronym from the filtered words
            acronym = ''.join(word[0].upper() for word in filtered_words if word[0].isalpha())
            acronym_mapping[acronym.lower()] = asset
    return acronym_mapping
 
aws_acronym_to_full = create_acronyms_mapping(aws_assets)
 
# Preprocess function
def preprocess(text):
    # Define custom replacements
    replacements = {
        '$': 'S',
        '5': 'S',
    }
    # Apply custom replacements
    for key, value in replacements.items():
        text = text.replace(key, value)
 
    # Replace multiple whitespaces with a single whitespace
    text = re.sub(r'\s+', ' ', text)
    text = text.lower().replace("-", " ").replace("_", " ")
    text=text.lower()
 
    # Split text at "or" and return parts as a list
    parts = text.split(" or ")
    parts = [part.strip() for part in parts]
    return parts
 
# Function to find best match using fuzzy matching
def find_best_match(service_name, service_list, provider_name):
    highest_match = process.extractOne(service_name, service_list, score_cutoff=90)
    return highest_match, provider_name if highest_match else None
 
# Function to search for assets based on input text
def search_provider_based_on_input(input_text):
    providers_to_search = [
        ('Interfaces', interface_assets),
        ('AWS', aws_assets),
        ('Azure', azure_assets),
        ('GCP', gcp_assets),
        ('Database', db_assets),
        ('Automotive', automotive_assets)
    ]
    return providers_to_search
 
# Function to find best match using fuzzy matching
def find_best_match(service_name, service_list, provider_name):
    highest_match = process.extractOne(service_name, service_list, score_cutoff=90)
    return highest_match, provider_name if highest_match else None
 
# Function to search for assets based on input text
def search_provider_based_on_input(input_text):
    providers_to_search = [
        ('Interfaces', interface_assets),
        ('AWS', aws_assets),
        ('Azure', azure_assets),
        ('GCP', gcp_assets),
        ('Database', db_assets),
        ('Automotive', automotive_assets)
    ]
    return providers_to_search
 
def main_search(search_text):
    found_assets_list = []
    processed_inputs = preprocess(search_text)
 
    for processed_input in processed_inputs:
        # Check for direct acronym matches in asset lists
        match_found = False
        for part in processed_input.split():
            if part in aws_acronym_to_full:
                found_assets_list.append(aws_acronym_to_full[part])
                match_found = True  # Set flag to True
                break
 
        if match_found:
            continue
 
        providers_to_search = search_provider_based_on_input(processed_input)
        matches = []
        for provider, services in providers_to_search:
            preprocessed_services = [preprocess(service) for service in services]
            match = find_best_match(processed_input, preprocessed_services, provider)
            if match[0]:
                matches.append((match, services))
 
        if matches:
            best_match, original_services = max(matches, key=lambda x: x[0][0][1])
            original_asset = [service for service in original_services if preprocess(service) == best_match[0][0]][0]
            found_assets_list.append(original_asset)
 
    return found_assets_list
 
# Function to process image and extract information
def process_img_and_get_info(img_path):
    reader = easyocr.Reader(['en'], gpu=False)
    img = cv2.imread(img_path)
    results = reader.readtext(img, detail=1, paragraph=True)
    detected_texts = [item[1] for item in results]
    filtered_texts = filter_texts_function(detected_texts)
    found_assets_list = []  # Initialize the list outside the loop
    for text in filtered_texts:
        found_assets_list += main_search(text)  # Accumulate the assets found in each text
    return found_assets_list,filtered_texts
 
 
 
# Function to process PDF and extract information
def process_pdf_and_get_info(pdf_file):
    found_assets_list = []
    all_texts = []
    for page_layout in extract_pages(pdf_file):
        for element in page_layout:
            if isinstance(element, LTTextBoxHorizontal):
                element_text = element.get_text()
                all_texts.append(element_text)
 
    # Filter and clean text, removing duplicates while preserving order
    filtered_texts = []
    url_pattern = re.compile(r'https?://[^\s]+')
    dots_pattern = re.compile(r'\. \. \.')  # Pattern to match `. . .`
    seen_texts = set()  # Set to keep track of seen texts
 
    for text in all_texts:
        # Check if the text does NOT contain a URL
        if not url_pattern.search(text):
            # Replace '\n' with a space, strip leading and trailing spaces
            clean_text = text.replace('\n', ' ').strip()
            # Replace occurrences of `. . .` with a single space or remove them
            clean_text = dots_pattern.sub('', clean_text)  # Or use '' to remove
            # Ensure we don't add empty strings or duplicates
            if clean_text and clean_text not in seen_texts:
                seen_texts.add(clean_text)  # Mark text as seen
                filtered_texts.append(clean_text)
    filtered_texts_up = filter_texts_function(filtered_texts)
    # Search for assets in the filtered text
    for text in filtered_texts_up:
        found_assets_list += main_search(text)
    print(found_assets_list)
 
    return found_assets_list,filtered_texts_up
 
# Function to process file and extract information
def process_file(file_path):
    if file_path.lower().endswith(('.png', '.jpg', '.jpeg')):
        found_assets_list,filtered_texts_up = process_img_and_get_info(file_path)
    elif file_path.lower().endswith('.pdf'):
        with open(file_path, 'rb') as pdf_file:
            found_assets_list,filtered_texts_up = process_pdf_and_get_info(pdf_file)
    else:
        found_assets_list = ["Unsupported file type. Please provide an image or a PDF file."]
    return found_assets_list,filtered_texts_up
 
def fetch_specified_pairs(arr, keys):
    return [{key: obj.get(key) for key in keys} for obj in arr]
 
# @app.route('/uploadArch', methods=['POST'])
# def upload_Arch():
#     if 'file' not in request.files:
#         return jsonify({"error": "No file part"})
 
#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({"error": "No selected file"})
 
#     # Ensure the temp directory exists
#     temp_dir = 'temp'
#     os.makedirs(temp_dir, exist_ok=True)
 
#     # Temporary save file
#     temp_path = os.path.join(temp_dir, file.filename)
#     file.save(temp_path)
 
#     # Process the uploaded file and extract information
#     found_assets_list = process_file(temp_path)
 
#     # Convert the list of found assets to a set to remove duplicates
#     unique_assets = set(found_assets_list)
 
#     # Convert the set back to a list
#     unique_assets_list = list(unique_assets)
 
#     return jsonify({"assets": unique_assets_list})
 
@app.route('/uploadArch', methods=['POST'])
# def upload_Arch():
#     if 'file' not in request.files:
#         return jsonify({"error": "No file part"})
 
#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({"error": "No selected file"})
 
#     # Ensure the temp directory exists
#     temp_dir = 'temp'
#     os.makedirs(temp_dir, exist_ok=True)
 
#     # Temporary save file
#     temp_path = os.path.join(temp_dir, file.filename)
#     file.save(temp_path)
 
#     # Process the uploaded file and extract information
#     found_assets_list = process_file(temp_path)
 
#     # Convert the list of found assets to a set to remove duplicates
#     unique_assets = set(found_assets_list)
 
#     # Convert the set back to a list
#     unique_assets_list = list(unique_assets)
 
#     return jsonify({"assets": unique_assets_list})
def upload_Arch():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})
 
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"})
 
    # Ensure the temp directory exists
    temp_dir = 'temp'
    os.makedirs(temp_dir, exist_ok=True)
 
    # Temporary save file
    temp_path = os.path.join(temp_dir, file.filename)
    file.save(temp_path)
 
    # Process the uploaded file and extract information
    found_assets_list,filtered_texts_up = process_file(temp_path)
 
    # Convert the list of found assets to a set to remove duplicates
    unique_assets = set(found_assets_list)
 
    # Convert the set back to a list
    unique_assets_list = list(unique_assets)
 
    return jsonify({"assets": unique_assets_list,"all_text_found":filtered_texts_up})
 
@app.route("/attackTrees", methods=["POST"])
def attackTrees():
    assetName = request.json["attacktrees_list"]
    keys_to_fetch = ["name", "security_properties","attack","time","expertise","knowledge","access","equipment","threat"]
    res_arr = {}
    for asset in assetName:
        collection = client2.Attack_Trees1[str(asset)]
        res = collection.find()
        selected_pairs = fetch_specified_pairs(res, keys_to_fetch)
        # values = []
        # for obj in res:
        #     # Create an array to store values for this object
        #     values.append(obj)
 
        res_arr[asset]=selected_pairs
    #return res_arr
    return json.dumps(res_arr, indent=4, default=json_util.default)
 
 
@app.route("/EditDataNew", methods=["POST"])
def EditDataNew():
    assetName = request.json["asset_list"]
 
    #res = client.tara.jtag.find()
    #print(res)
    keys = [
          "assumptions",
          "comments",
          "muc description",
          "comment",
          "damage scenario",
          "consequence",
          "reasoning for the relevance of the ds for this analysis",
          "reasoning for the choice of the consequence value",
          "asset description",
          "objective",
          "description",
          "threat",
          "affected security goal",
          "damage scenarios",
          "security need description_assumptions",
          "sn_assumption",
          "security need description_bosch,customer",
          "requirement",
          "security need description_threats",
          "threat t"
      ]
 
    res_arr = []
    for asset in assetName:
        collection = client1.tara_new[str(asset)]
        res = collection.find()
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
 
def notify(op_document):
    print("added data to database")
 
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file part'})
 
    file = request.files['pdf']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
 
    #file_name = request.json['sessionID']
    sessionId = request.form['sessionId']
    pdf_data = file.read()
 
 
    result = client.tara_pdf.PDF.insert_one({'pdf':pdf_data,'filename':sessionId})
    return jsonify({'message': 'PDF uploaded successfully', 'pdf_id': str(result.inserted_id)}), 200
 
@app.route('/getSQLDATA', methods=["POST"])
def getSqlData():
    userProjectName = []
    userDocType = []
    userTimeStamp = []
 
    email = request.json['email']
 
    user = list(client.master_tara.UserDocData.find({"email": email}))
    for data in user:
        userProjectName.append(data.get("projectName"))
        userDocType.append(data.get("docType"))
        userTimeStamp.append(data.get("timeStamp"))
    return jsonify({"projectName": userProjectName, "docType": userDocType, "timeStamp": userTimeStamp})
 
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
 
@app.route('/getDoc', methods=["POST"])
def download_Doc():
    time.sleep(5)
    # Replace 'folder_in_s3' with the actual folder structure in your S3 bucket
    email = request.json['email']
    userData = client.master_tara.UserData.find_one({'email': email})
    sessionId = request.json['sessionId']
    docType = request.json['docType']
    if userData:
        selectedDocType = "AP SCD"
        selectedDocType1 = "LE SCD"
        if selectedDocType in docType:
            s3_key = f'Sitara_TARA_Storage/{email}/{sessionId}/Security_Concepts.docx'
        elif selectedDocType1 in docType:
            s3_key = f'Sitara_TARA_Storage/{email}/{sessionId}/Security_Concepts.docx'
        else:
            s3_key = 'null'
 
        if s3_key != 'null':
            presigned_url = generate_presigned_url(BUCKET_NAME, s3_key)
            print("url is", presigned_url)
            return jsonify({'url': presigned_url, "secdoc_status": userData["secdoc_status"]}), 200
        else:
            return jsonify({'url': "null"})
 
@app.route('/getAT', methods=["POST"])
def download_AT():
    # Replace 'folder_in_s3' with the actual folder structure in your S3 bucket
    email = request.json['email']
    sessionId = request.json['sessionId']
    docType = request.json['docType']
    selectedDocType = "AP AT"
    if selectedDocType in docType:
        s3_key = f'Sitara_TARA_Storage/{email}/{sessionId}/Attack_Trees.pdf'
    else:
        s3_key = 'null'
 
    if s3_key != 'null':
        presigned_url = generate_presigned_url(BUCKET_NAME, s3_key)
        print("url is", presigned_url)
        return jsonify({'url': presigned_url})
    else:
        return jsonify({'url': "null"})
 
def generate_presigned_url(bucket_name, s3_key, expiration=3600):
    try:
        s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY)
        url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': s3_key},
            ExpiresIn=expiration
        )
        return url
    except NoCredentialsError:
        print('AWS credentials not available or incorrect.')
 
@app.route('/getFiles', methods=["POST"])
def download_file():
    # Replace 'folder_in_s3' with the actual folder structure in your S3 bucket
 
    time.sleep(5)
 
    try:
        email = request.json['email']
        userData = client.master_tara.UserData.find_one({'email': email})
        if userData:
            sessionId = request.json['sessionId']
            s3_key = f'Sitara_TARA_Storage/{email}/{sessionId}/Si-TaRA_files/Si-TaRA_Files.zip'
 
            presigned_url = generate_presigned_url(BUCKET_NAME, s3_key)
 
            #return send_file(presigned_url, mimetype='application/zip')
            print("url is", presigned_url)
            return jsonify({'url': presigned_url, "xl_status": userData["xl_status"]}), 200
        else:
            return jsonify({"message": "user not found"}), 401
    except:
        return jsonify({"message": "token can't be decoded"}), 401
 
@app.route('/getVDFile', methods=["POST"])
def downloadVDFile():
    # Replace 'folder_in_s3' with the actual folder structure in your S3 bucket
 
    time.sleep(5)
 
    try:
        email = request.json['email']
        userData = client.master_tara.UserData.find_one({'email': email})
        if userData:
            sessionId = request.json['sessionId']
            s3_key = f'Sitara_TARA_Storage/{email}/{sessionId}/Si-TaRA_files/Si-TaRA_Files.zip'
 
            presigned_url = generate_presigned_url(BUCKET_NAME, s3_key)
 
            #return send_file(presigned_url, mimetype='application/zip')
            print("url is", presigned_url)
            return jsonify({'url': presigned_url, "VD_status": userData["VD_status"]}), 200
        else:
            return jsonify({"message": "user not found"}), 401
    except:
        return jsonify({"message": "token can't be decoded"}), 401
 
@app.route('/getLEFile', methods=["POST"])
def download_LE_file():
    # Replace 'folder_in_s3' with the actual folder structure in your S3 bucket
 
    time.sleep(5)
 
    try:
        email = request.json['email']
        userData = client.master_tara.UserData.find_one({'email': email})
        if userData:
            sessionId = request.json['sessionId']
            s3_key = f'Sitara_TARA_Storage/{email}/{sessionId}/Si-TaRA_files/Si-TaRA_Files.zip'
 
            presigned_url = generate_presigned_url(BUCKET_NAME, s3_key)
 
            #return send_file(presigned_url, mimetype='application/zip')
            print("url is", presigned_url)
            return jsonify({'url': presigned_url, "lexl_status": userData["lexl_status"]}), 200
        else:
            return jsonify({"message": "user not found"}), 401
    except:
        return jsonify({"message": "token can't be decoded"}), 401
 
@app.route('/getXLVDStatus', methods=["POST"])
def download_XLVD():
    # Replace 'folder_in_s3' with the actual folder structure in your S3 bucket
 
    time.sleep(5)
 
    try:
        email = request.json['email']
        userData = client.master_tara.UserData.find_one({'email': email})
        if userData:
            sessionId = request.json['sessionId']
            s3_key = f'Sitara_TARA_Storage/{email}/{sessionId}/Si-TaRA_files/Si-TaRA_Files.zip'
 
            presigned_url = generate_presigned_url(BUCKET_NAME, s3_key)
 
            #return send_file(presigned_url, mimetype='application/zip')
            print("url is", presigned_url)
            return jsonify({'url': presigned_url, "xl_status": userData["xl_status"], "VD_status": userData["VD_status"]}), 200
        else:
            return jsonify({"message": "user not found"}), 401
    except:
        return jsonify({"message": "token can't be decoded"}), 401
 
@app.route('/getPdf', methods=["POST"])
def getPdf():
    time.sleep(5)
    email = request.json['email']
    sessionId = request.json['sessionId']
    methodology = request.json['methodology']
    docType = request.json['docType']
    selectedDocType = "AP .PDF"
    selectedDocType1 = "LE .PDF"
    if methodology == "Attack Potential" and (selectedDocType in docType):
        print("inside ap")
        s3_key = f'Sitara_TARA_Storage/{email}/{sessionId}/Si-TaRA_Threat_and_Risk_Analysis_AP.pdf'
    elif methodology == "Likelihood Estimation" and (selectedDocType1 in docType):
        print("inside le")
        s3_key = f'Sitara_TARA_Storage/{email}/{sessionId}/Si-TaRA_Threat_and_Risk_Analysis_LE.pdf'
    else:
        print('null')
        s3_key = 'null'
    print(s3_key)
    if(s3_key != 'null'):
        presigned_url = generate_presigned_url(BUCKET_NAME, s3_key)
        return jsonify({'url': presigned_url})
    else:
        return jsonify({'url': "null"})
 
@app.route('/getTG', methods=["POST"])
def download_TG():
    # Replace 'folder_in_s3' with the actual folder structure in your S3 bucket
    email = request.json['email']
    sessionId = request.json['sessionId']
    docType = request.json['docType']
    selectedDocType = "AP TR"
    selectedDocType1 = "LE TR"
    if selectedDocType in docType:
        s3_key = f'Sitara_TARA_Storage/{email}/{sessionId}/Traceability_Graphs.pdf'
    elif selectedDocType1 in docType:
        s3_key = f'Sitara_TARA_Storage/{email}/{sessionId}/Traceability_Graphs.pdf'
    else:
        s3_key = 'null'
 
    if s3_key != 'null':
        presigned_url = generate_presigned_url(BUCKET_NAME, s3_key)
        print("url is", presigned_url)
        return jsonify({'url': presigned_url})
    else:
        return jsonify({'url': "null"})
 
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
    global automotive
 
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
    automotive = request.json['automotive']
    astArch = request.json['astArch']
 
    queryObject = {
        'interfaces': interfaces if len(interfaces) > 0 else "",
        'cloud': cloud if len(cloud) > 0 else "",
        'DBAssets': DBAssets if len(DBAssets) > 0 else "",
        'device': device if len(device) > 0 else "",
        'application': application if len(application) > 0 else "",
        'sessionId': userSession,
        'status': "NEW",
        'automotive': automotive if len(automotive) > 0 else "",
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
        'techDesc': techDesc,
        'astArch': astArch
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
 
 
def hash_password(password):
    password_bytes = password.encode("utf-8")
    hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    return hashed_password.decode("utf-8")
 
 
@app.route("/registerUser", methods=["POST"])
def uploadUserData():
    email_ = request.json["mail"]
    password_ = request.json["password"]
    cipher_suite = Fernet(encryptsecret)
    email_ = cipher_suite.decrypt(email_)
    password_=cipher_suite.decrypt(password_)
    email=email_.decode("utf-8")
    password=password_.decode("utf-8")
    pass_hash = hash_password(password)
    LE_xl = 0
    AP_xl = 0
    AP_PDF = 0
    LE_PDF = 0
    AP_AT = 0
    AP_VD = 0
    LE_VD = 0
    AP_SCD = 0
    LE_SCD = 0
    AP_TR = 0
    LE_TR = 0
 
    if client.master_tara.UserData.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400
 
    else:
        query = {"email": email, "password": pass_hash, "LE_xl": LE_xl, "AP_xl": AP_xl, "AP_PDF": AP_PDF, "LE_PDF": LE_PDF, "AP_AT": AP_AT, "AP_VD": AP_VD, "LE_VD": LE_VD, "AP_SCD": AP_SCD, "LE_SCD": LE_SCD, "AP_TR": AP_TR, "LE_TR": LE_TR}
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
        hasAccess = user.get("hasAccess")
        db_password = user.get("password").encode("utf-8")
        if bcrypt.checkpw(password.encode("utf-8"), db_password) and user.get("hasAccess") == True:
            passwordChanged = user.get("passwordChanged")
            token = jwt.encode({
                'email': user.get("email"),
                'exp' : datetime.utcnow() + timedelta(minutes = 40)
            }, app.config['SECRET_KEY'])
            return jsonify({"message": "Login successful", 'token': token, 'passwordStatus': passwordChanged, 'hasAccess': hasAccess}), 200
        elif user.get("hasAccess") == False and bcrypt.checkpw(password.encode("utf-8"), db_password) == True:
            return jsonify({"message": "Site is under maintenance, Try again later", 'hasAccess': hasAccess})
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
 
@app.route('/getPDFStatus', methods=["POST"])
def getPDFStatus():
    time.sleep(5)
 
    try:
        email = request.json['email']
        userData = client.master_tara.UserData.find_one({'email': email})
        if userData:
            # return jsonify({"PDF_status": userData["PDF_status"]}), 200
            sessionId = request.json['sessionId']
            methodology = request.json['methodology']
            docType = request.json['docType']
            selectedDocType = "AP .PDF"
            selectedDocType1 = "LE .PDF"
            if methodology == "Attack Potential" and (selectedDocType in docType):
                # print("inside ap")
                s3_key = f'Sitara_TARA_Storage/{email}/{sessionId}/Si-TaRA_Threat_and_Risk_Analysis_AP.pdf'
            elif methodology == "Likelihood Estimation" and (selectedDocType1 in docType):
                # print("inside le")
                s3_key = f'Sitara_TARA_Storage/{email}/{sessionId}/Si-TaRA_Threat_and_Risk_Analysis_LE.pdf'
            else:
                print('null')
                s3_key = 'null'
            print(s3_key)
            if(s3_key != 'null'):
                presigned_url = generate_presigned_url(BUCKET_NAME, s3_key),
                # print(presigned_url)
                return jsonify({'url': presigned_url, "PDF_status": userData["PDF_status"]}), 200
            else:
                return jsonify({'url': "null"})
        else:
            return jsonify({"message": "user not found"}), 401
    except:
        return jsonify({"message": "token can't be decoded"}), 401
 
 
 
 
@app.route('/myAccount', methods=["GET"])
def myAccount():
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
            return jsonify({"AP_xl": userData['AP_xl'],
                            "LE_xl": userData['LE_xl'],
                            "AP_PDF": userData['AP_PDF'],
                            "LE_PDF": userData['LE_PDF'],
                            "AP_AT": userData['AP_AT'],
                            "AP_VD": userData['AP_VD'],
                            "LE_VD": userData['LE_VD'],
                            "AP_SCD": userData['AP_SCD'],
                            "LE_SCD": userData['LE_SCD']}), 200
        else:
            return jsonify({"message": "user not found"}), 401
    except:
        return jsonify({"message": "token can't be decoded"}), 401
 
@app.route('/fetch_collection_names', methods=['GET'])
def fetch_collection_names():
    try:
        collection_names = client["Attack_Path_DB"].list_collection_names()
        return jsonify(collection_names)
    except Exception as e:
        print("Error fetching collection names:", e)
        return jsonify({"error": "Unable to fetch collection names"}), 500
 
# Route to fetch data from selected collection
@app.route('/fetch_data/<collection_name>', methods=['GET'])
def fetch_data(collection_name):
    try:
        collection = client["Attack_Path_DB"][collection_name]
        data = list(collection.find())
        # Convert ObjectId to string for JSON serialization
        serialized_data = json_util.dumps(data)
        return serialized_data, 200, {'Content-Type': 'application/json'}
    except Exception as e:
        print("Error fetching data:", e)
        return jsonify({"error": "Unable to fetch data"}), 500
 
@app.route("/EditDataSecControl", methods=["POST"])
 
def EditDataSecControl():
    assetName = request.json["asset_list"]
 
    keys = ["asset","security_goal","security_control","security_control_description"]
 
    res_arr = []
 
    for asset in assetName:
        collection = client.Security_Goals_Controls[str(asset)]
        res = collection.find()
        print(asset)
        for obj in res:
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
 
if __name__ == "__main__":
    # port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=5000, threaded=True)
    # Thread(target=app.run).start()
