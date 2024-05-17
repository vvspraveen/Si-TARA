import subprocess
import boto3
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from botocore.exceptions import ClientError
from flask import request


ACCESS_KEY = 'TEST'
SECRET_KEY = 'TEST'


def sendErrorEmail(ErrorMessage):
    client = boto3.client   ('ses',
                      aws_access_key_id=ACCESS_KEY,
                      aws_secret_access_key=SECRET_KEY, region_name='ap-south-1')
                      
    subject = "Error Occured while Generating the Tara Document"
    sender = "Si.Tara@in.bosch.com"

    email = "Si.Tara@in.bosch.com"
    #email = request.json['email']
    print(email)
    
    # Create the email message
    message = MIMEMultipart()
    message['Subject'] = subject
    message['From'] = sender
    message['To'] = email
    best_regards = "\nBest Regards."
    body=MIMEText(f"Hello Admin," + '\n' + '\n' + '\t' + "The following Error has occured while generating tara document:" +'\n'+ErrorMessage+'\n'+f"{best_regards}")
    message.attach(body)
    # Send the email
    try:
        client.send_raw_email(
            Source=sender,
            Destinations=[email],
            RawMessage={'Data': message.as_string()}
        )
        print(" Error Email sent successfully!")
    except ClientError as e:
        print(e)


def repeat_script():
    code_path = "C:\\Users\\Administrator\\Desktop\\Python-Codes\\working-demo.py"  # Replace with the actual path to your Python script
    while True:
        try:
            print(f"Entered at the start")
            subprocess.run(["python", code_path], check=True)
            
            sendErrorEmail("There is some issue in the backend. Please look into it.")

            print(f"Completed try block")
            
            #sendErrorEmail("Error Encountered in script. Please look into it")
        except Exception as e:
            print(f"Error encountered:{e}")

            sendErrorEmail(e)
           # sendErrorEmail("Error Encountered in script")

            print("Restarting the script...")


if __name__ == "__main__":
    repeat_script()




