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

## NVD CVE Integration

Integrated the NIST National Vulnerability Database (NVD) API to allow SignalDeck to retrieve detailed information for a specific CVE.

### Work Completed

- Added the NVD CVE API as a second cybersecurity intelligence source
- Created the `/cyber/cve/{cve_id}` API endpoint
- Added support for looking up individual vulnerabilities by CVE ID
- Tested the endpoint using `CVE-2021-44228` (Log4Shell)
- Verified the endpoint through FastAPI Swagger UI
- Successfully received a `200 OK` response from the CVE lookup

### Screenshot

![NVD CVE API Success](../screenshots/nvd-cve-api-success.png)

## NVD CVE Data Enrichment

Enhanced the SignalDeck NVD CVE lookup endpoint to provide additional vulnerability intelligence for use in the future Cyber dashboard.

### Features Implemented

- Added CVE publication date
- Added last modified date
- Added associated CWE weakness information
- Added up to five external reference URLs
- Maintained CVSS score, severity, vector, and vulnerability description
- Tested the enriched endpoint using `CVE-2021-44228` (Log4Shell)
- Verified the enriched API response returned `200 OK`

### Enriched CVE Data

The `/cyber/cve/{cve_id}` endpoint now returns:

- CVE ID
- CVSS score
- Severity
- CVSS vector
- Description
- Published date
- Last modified date
- CWE weaknesses
- External references

### Screenshot

![NVD CVE Enriched Response](../screenshots/nvd-cve-enriched-success.png)

## Combined CISA KEV and NVD Intelligence

Created a combined cyber intelligence endpoint that enriches actively exploited vulnerability data from the CISA Known Exploited Vulnerabilities (KEV) Catalog with vulnerability severity data from the NIST National Vulnerability Database (NVD).

### Features Implemented

- Added the `/cyber/kev/enriched` endpoint
- Retrieves actively exploited vulnerabilities from CISA KEV
- Uses CVE IDs to retrieve additional vulnerability intelligence from NVD
- Combines data from both sources into a single API response
- Returns vendor, product, vulnerability name, and remediation dates
- Includes known ransomware campaign usage when available
- Adds CVSS score and severity from NVD
- Adds vulnerability descriptions from NVD
- Preserves CISA data if an individual NVD enrichment request fails
- Limited requests to a maximum of 10 vulnerabilities to reduce external API load
- Successfully tested the combined endpoint with a `200 OK` response

### Combined Intelligence Data

The `/cyber/kev/enriched` endpoint returns:

- CVE ID
- Vendor
- Product
- Vulnerability name
- Date added to CISA KEV
- Remediation due date
- Known ransomware campaign use
- CVSS score
- Severity
- Vulnerability description

### Screenshot

![CISA KEV and NVD Enriched Intelligence](../screenshots/kev-enriched-success.png)