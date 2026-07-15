# SignalDeck Project Foundation

## Objective

Build the initial foundation for SignalDeck, a personal intelligence dashboard designed to monitor cybersecurity threats, global events, financial markets, cryptocurrency, and prediction markets.

## Work Completed

- Created the public SignalDeck GitHub repository
- Configured the repository with a README, Python `.gitignore`, and MIT license
- Cloned the repository locally using Visual Studio Code
- Created the initial project structure:
  - `backend`
  - `frontend`
  - `docs`
  - `screenshots`
- Installed and configured Python
- Created a Python virtual environment
- Installed FastAPI and Uvicorn
- Created the first SignalDeck API endpoint
- Verified the API using the browser and FastAPI Swagger UI
- Created `requirements.txt` for Python dependency tracking
- Committed and pushed the initial project foundation to GitHub

## Technologies Used

- Python
- FastAPI
- Uvicorn
- Git
- GitHub
- Visual Studio Code
- PowerShell

## API Test

The initial API endpoint returned:

```json
{
  "message": "SignalDeck API is online"
}

## CISA Known Exploited Vulnerabilities Integration

Integrated the CISA Known Exploited Vulnerabilities (KEV) Catalog into the SignalDeck backend.

### Features Implemented

- Created a `/cyber/kev` FastAPI endpoint
- Used HTTPX to retrieve live vulnerability data from CISA
- Added a configurable `limit` query parameter
- Limited accepted values between 1 and 100
- Parsed the CISA response to return relevant vulnerability intelligence
- Included CVE ID, vendor, product, vulnerability name, dates, known ransomware use, and CWE information
- Added HTTP error handling for failed external API requests
- Verified the endpoint through FastAPI Swagger UI
- Successfully received a `200 OK` response with live CISA KEV data

### Screenshot

![CISA KEV API Success](../screenshots/cisa-kev-api-success.png)