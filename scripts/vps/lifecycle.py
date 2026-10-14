#!/usr/bin/env python3
"""
Celoris Cloud VPS Site Lifecycle Manager
Runs daily via cron (e.g., 0 2 * * *) to maintain VPS health:
- Sites inactive for > 7 days are archived/slept (resources preserved, 1-click wake up).
- Sites inactive for > 30 days are purged to reclaim disk space.
- Main network site (blog_id = 1) is strictly protected.
"""

import json
import subprocess
import datetime
import sys

def run_cmd(cmd):
    try:
        res = subprocess.run(cmd, shell=True, capture_output=True, text=True, check=True)
        return res.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"[{datetime.datetime.now()}] ERROR running '{cmd}': {e.stderr}", file=sys.stderr)
        return None

def main():
    now = datetime.datetime.now(datetime.timezone.utc)
    print(f"[{now.isoformat()}] Starting Celoris Cloud daily lifecycle check...")

    # Fetch subsites list in JSON format from WordPress Multisite
    output = run_cmd("docker exec celoris-wordpress wp site list --fields=blog_id,url,last_updated,archived,deleted --format=json --allow-root")
    if not output:
        print("No sites returned or failed to execute wp site list.")
        return

    try:
        sites = json.loads(output)
    except Exception as e:
        print(f"Failed to parse WP site list JSON: {e}")
        return

    archived_count = 0
    deleted_count = 0
    active_count = 0

    for site in sites:
        blog_id = str(site.get('blog_id', ''))
        url = site.get('url', '')
        last_updated_str = site.get('last_updated', '')
        is_archived = str(site.get('archived', '0')) == '1'

        # Never touch the primary root domain (blog_id = 1)
        if blog_id == '1' or 'celoris.in/' in url or url == 'http://celoris.in' or url == 'https://celoris.in':
            continue

        if not last_updated_str or last_updated_str.startswith('0000'):
            # If no timestamp, skip or treat as newly created
            continue

        try:
            # WP datetime format: YYYY-MM-DD HH:MM:SS
            last_updated = datetime.datetime.strptime(last_updated_str, "%Y-%m-%d %H:%M:%S").replace(tzinfo=datetime.timezone.utc)
        except Exception:
            continue

        days_inactive = (now - last_updated).days

        # Rule 2: Recycle sites abandoned for >= 30 days
        if days_inactive >= 30:
            print(f"[{now.isoformat()}] PURGING: Site {blog_id} ({url}) inactive for {days_inactive} days.")
            run_cmd(f"docker exec celoris-wordpress wp site delete {blog_id} --yes --allow-root")
            deleted_count += 1

        # Rule 1: Sleep/Archive sites inactive for >= 7 days
        elif days_inactive >= 7 and not is_archived:
            print(f"[{now.isoformat()}] SLEEPING: Site {blog_id} ({url}) inactive for {days_inactive} days. Archiving...")
            run_cmd(f"docker exec celoris-wordpress wp site archive {blog_id} --allow-root")
            archived_count += 1
        else:
            active_count += 1

    print(f"[{datetime.datetime.now(datetime.timezone.utc).isoformat()}] Lifecycle complete: {active_count} active, {archived_count} put to sleep, {deleted_count} purged.")

if __name__ == '__main__':
    main()
