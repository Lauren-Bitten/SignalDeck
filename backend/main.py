from fastapi import FastAPI, HTTPException, Query
import httpx

app = FastAPI(title="SignalDeck API")

CISA_KEV_URL = (
    "https://www.cisa.gov/sites/default/files/feeds/"
    "known_exploited_vulnerabilities.json"
)
NVD_CVE_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0"

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
@app.get("/cyber/cve/{cve_id}")
async def get_cve_details(cve_id: str):
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                NVD_CVE_URL,
                params={"cveId": cve_id.upper()},
            )
            response.raise_for_status()

        data = response.json()
        vulnerabilities = data.get("vulnerabilities", [])

        if not vulnerabilities:
            raise HTTPException(
                status_code=404,
                detail=f"No NVD data found for {cve_id}",
            )

        cve = vulnerabilities[0].get("cve", {})
        metrics = cve.get("metrics", {})

        cvss_score = None
        severity = None
        vector = None

        for metric_name in (
            "cvssMetricV40",
            "cvssMetricV31",
            "cvssMetricV30",
            "cvssMetricV2",
        ):
            if metrics.get(metric_name):
                metric = metrics[metric_name][0]
                cvss_data = metric.get("cvssData", {})

                cvss_score = cvss_data.get("baseScore")
                severity = (
                    cvss_data.get("baseSeverity")
                    or metric.get("baseSeverity")
                )
                vector = cvss_data.get("vectorString")
                break

        descriptions = cve.get("descriptions", [])

        published = cve.get("published")
        last_modified = cve.get("lastModified")

        references = [
            item.get("url")
            for item in cve.get("references", [])
            if item.get("url")
        ][:5]

        weaknesses = []

        for weakness_group in cve.get("weaknesses", []):
            for item in weakness_group.get("description", []):
                if item.get("lang") == "en":
                    weaknesses.append(item.get("value"))        

        description = next(
            (
                item.get("value")
                for item in descriptions
                if item.get("lang") == "en"
            ),
            None,
        )

        return {
    "cve_id": cve.get("id"),
    "cvss_score": cvss_score,
    "severity": severity,
    "vector": vector,
    "description": description,
    "published": published,
    "last_modified": last_modified,
    "weaknesses": weaknesses,
    "references": references,
}

    except HTTPException:
        raise

    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Unable to retrieve NVD data: {str(exc)}",
        ) 

@app.get("/cyber/kev/enriched")
async def get_enriched_kev(
    limit: int = Query(default=5, ge=1, le=10)
):
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            # Get actively exploited vulnerabilities from CISA KEV
            kev_response = await client.get(CISA_KEV_URL)
            kev_response.raise_for_status()

            kev_data = kev_response.json()
            kev_items = kev_data.get("vulnerabilities", [])[:limit]

            enriched_vulnerabilities = []

            for item in kev_items:
                cve_id = item.get("cveID")

                cvss_score = None
                severity = None
                description = None

                try:
                    nvd_response = await client.get(
                        NVD_CVE_URL,
                        params={"cveId": cve_id},
                    )
                    nvd_response.raise_for_status()

                    nvd_data = nvd_response.json()
                    nvd_vulnerabilities = nvd_data.get(
                        "vulnerabilities",
                        [],
                    )

                    if nvd_vulnerabilities:
                        cve = nvd_vulnerabilities[0].get("cve", {})
                        metrics = cve.get("metrics", {})

                        for metric_name in (
                            "cvssMetricV40",
                            "cvssMetricV31",
                            "cvssMetricV30",
                            "cvssMetricV2",
                        ):
                            if metrics.get(metric_name):
                                metric = metrics[metric_name][0]
                                cvss_data = metric.get("cvssData", {})

                                cvss_score = cvss_data.get("baseScore")
                                severity = (
                                    cvss_data.get("baseSeverity")
                                    or metric.get("baseSeverity")
                                )
                                break

                        descriptions = cve.get("descriptions", [])

                        description = next(
                            (
                                value.get("value")
                                for value in descriptions
                                if value.get("lang") == "en"
                            ),
                            None,
                        )

                except httpx.HTTPError:
                    # Keep the CISA data even if NVD enrichment fails
                    pass

                enriched_vulnerabilities.append(
                    {
                        "cve_id": cve_id,
                        "vendor": item.get("vendorProject"),
                        "product": item.get("product"),
                        "name": item.get("vulnerabilityName"),
                        "date_added": item.get("dateAdded"),
                        "due_date": item.get("dueDate"),
                        "known_ransomware_use": item.get(
                            "knownRansomwareCampaignUse"
                        ),
                        "cvss_score": cvss_score,
                        "severity": severity,
                        "description": description,
                    }
                )

        return {
            "source": "CISA KEV enriched with NVD",
            "showing": len(enriched_vulnerabilities),
            "vulnerabilities": enriched_vulnerabilities,
        }

    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Unable to retrieve cyber intelligence data: {str(exc)}",
        )       