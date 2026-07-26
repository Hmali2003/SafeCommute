from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]

flow = InstalledAppFlow.from_client_secrets_file("client_secret.json", SCOPES)
creds = flow.run_local_server(port=0)

print("Refresh token:", creds.refresh_token)
print("Client ID:", creds.client_id)
print("Client secret:", creds.client_secret)