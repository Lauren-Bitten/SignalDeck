from fastapi import FastAPI, HTTPException, Query
import httpx

app = FastAPI(title="SignalDeck API")

CISA_KEV_URL = (
    "https://www.cisa.gov/sites/default/files/feeds/"
    "known_exploited_vulnerabilities.json"
)


@app.get("/")
def read_root():
    return {"message": "SignalDeck API is online"}


@app.get("/cyber/kev")
async def get_known_exploited_vulnerabilities(
    limit: int = Query(default=10, ge=1, le=100)
):
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(CISA_KEV_URL)
            response.raise_for_status()

        data = response.json()
        vulnerabilities = data.get("vulnerabilities", [])

        cleaned_vulnerabilities = [
            {
                "cve_id": item.get("cveID"),
                "vendor": item.get("vendorProject"),
                "product": item.get("product"),
                "name": item.get("vulnerabilityName"),
                "date_added": item.get("dateAdded"),
                "due_date": item.get("dueDate"),
                "known_ransomware_use": item.get("knownRansomwareCampaignUse"),
                "cwes": item.get("cwes", []),
            }
            for item in vulnerabilities[:limit]
        ]

        return {
            "source": "CISA Known Exploited Vulnerabilities Catalog",
            "total_available": len(vulnerabilities),
            "showing": len(cleaned_vulnerabilities),
            "vulnerabilities": cleaned_vulnerabilities,
        }

    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Unable to retrieve CISA KEV data: {str(exc)}",
        )