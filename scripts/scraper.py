import sys
import json
from jobspy import scrape_jobs

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: scraper.exe '<json_config>'" }))
        sys.exit(1)
        
    try:
        config = json.loads(sys.argv[1])
    except Exception as e:
        print(json.dumps({"error": f"Invalid JSON config: {str(e)}"}))
        sys.exit(1)
        
    role = config.get("role", "")
    location = config.get("location", "")
    
    # Advanced filters
    is_remote = config.get("is_remote", False)
    easy_apply = config.get("easy_apply", False)
    
    raw_job_type = config.get("job_type", "")
    job_type = raw_job_type if raw_job_type and raw_job_type != "any" else None
    
    raw_hours = config.get("hours_old", "")
    hours_old = int(raw_hours) if raw_hours else None
    
    sites = config.get("sites", ["indeed", "linkedin"])
    if not sites:
        sites = ["indeed", "linkedin"]
    
    try:
        jobs = scrape_jobs(
            site_name=sites,
            search_term=role,
            location=location,
            results_wanted=15,
            country_indeed='USA',
            is_remote=is_remote,
            easy_apply=easy_apply if easy_apply else None,
            job_type=job_type,
            hours_old=hours_old
        )
        
        if jobs is None or jobs.empty:
            print(json.dumps({"jobs": []}))
            return

        # Convert NaN to empty strings for proper JSON serialization
        jobs = jobs.fillna("")
        
        records = []
        for _, row in jobs.iterrows():
            records.append({
                "title": str(row.get("title", "")),
                "company": str(row.get("company", "")),
                "location": str(row.get("location", "")),
                "description": str(row.get("description", "")),
                "url": str(row.get("job_url", ""))
            })
            
        print(json.dumps({"jobs": records}))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
