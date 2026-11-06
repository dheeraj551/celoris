#!/usr/bin/env python3
"""
Celoris Social Cloud - Instagram Reels Importer & VPS Media Downloader
======================================================================
Reads an Apify Instagram Reels dataset JSON, downloads the 9:16 MP4 video files,
cover thumbnails, and creator avatars directly to your VPS / local media directory,
and generates a clean JSON/TypeScript manifest ready for Celoris Pulse.

Usage:
    python scripts/download_reels_to_vps.py
    python scripts/download_reels_to_vps.py --input dataset.json --output-dir /var/www/celoris/media/reels --base-url https://media.celoris.in/reels
"""

import os
import sys
import json
import glob
import time
import argparse
import urllib.request
import urllib.error
from pathlib import Path

# Headers to ensure Instagram CDN downloads don't get throttled
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Encoding': 'identity',
    'Connection': 'keep-alive',
}

def download_file(url: str, dest_path: str, retries: int = 3, label: str = "") -> bool:
    """Download a file with retry logic and progress feedback."""
    if not url:
        return False

    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 1024:
        print(f"  [SKIPPED - Already exists]: {os.path.basename(dest_path)}")
        return True

    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    
    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=30) as response, open(dest_path, 'wb') as out_file:
                chunk_size = 64 * 1024  # 64 KB
                total_downloaded = 0
                while True:
                    chunk = response.read(chunk_size)
                    if not chunk:
                        break
                    out_file.write(chunk)
                    total_downloaded += len(chunk)
            
            size_mb = total_downloaded / (1024 * 1024)
            print(f"  [DOWNLOADED]: {os.path.basename(dest_path)} ({size_mb:.2f} MB)")
            return True
        except Exception as e:
            if attempt < retries:
                time.sleep(1.5)
            else:
                print(f"  [FAILED]: {label or dest_path} - Error: {e}")
                if os.path.exists(dest_path):
                    try:
                        os.remove(dest_path)
                    except OSError:
                        pass
                return False

def parse_hashtags(text: str) -> list:
    """Extract hashtags from caption string."""
    if not text:
        return []
    words = text.split()
    tags = [w.lstrip('#').lower() for w in words if w.startswith('#') and len(w) > 1]
    return list(dict.fromkeys(tags))  # Deduplicate

def find_default_dataset() -> str:
    """Find any matching Apify instagram reels dataset JSON in the directory."""
    patterns = [
        'dataset_instagram-search-reels*.json',
        'dataset_*.json',
        '*.json'
    ]
    for p in patterns:
        files = glob.glob(p)
        for f in files:
            if 'dataset_instagram' in f.lower() or 'search-reels' in f.lower():
                return f
    return ''

def main():
    parser = argparse.ArgumentParser(description="Download Instagram Reels to VPS storage for Celoris Pulse")
    parser.add_argument('--input', '-i', type=str, default='', help='Path to Apify dataset JSON file')
    parser.add_argument('--output-dir', '-o', type=str, default='./public/media/reels', help='Output folder for videos and images')
    parser.add_argument('--base-url', '-b', type=str, default='/media/reels', help='Base public URL for serving media')
    parser.add_argument('--max', '-m', type=int, default=0, help='Max items to download (0 = all)')
    parser.add_argument('--save-avatars', action='store_true', default=True, help='Also download creator avatars')

    args = parser.parse_args()

    input_file = args.input
    if not input_file:
        input_file = find_default_dataset()
        if not input_file:
            print("ERROR: No dataset JSON file specified or found in current directory.")
            print("Please specify with: python scripts/download_reels_to_vps.py --input <filename.json>")
            sys.exit(1)

    print(f"\n=======================================================")
    print(f"  CELORIS SOCIAL CLOUD - REELS VPS MEDIA DOWNLOADER")
    print(f"=======================================================")
    print(f"Input Dataset  : {input_file}")
    print(f"Target Directory: {os.path.abspath(args.output_dir)}")
    print(f"Public Base URL : {args.base_url}")
    print(f"=======================================================\n")

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if not isinstance(data, list):
        print("ERROR: Input JSON must be an array of reels items.")
        sys.exit(1)

    total_items = len(data)
    items_to_process = data if args.max <= 0 else data[:args.max]
    print(f"Loaded {total_items} items from dataset. Processing {len(items_to_process)} reels...\n")

    out_media_dir = os.path.abspath(args.output_dir)
    os.makedirs(out_media_dir, exist_ok=True)
    avatars_dir = os.path.join(out_media_dir, "avatars")
    if args.save_avatars:
        os.makedirs(avatars_dir, exist_ok=True)

    celoris_posts = []
    success_count = 0

    for idx, item in enumerate(items_to_process, 1):
        code = item.get('code') or f"reel_{idx}"
        video_url = item.get('video_url')
        thumbnail_url = item.get('thumbnail_url') or (item.get('image_versions2', {}).get('candidates', [{}])[0].get('url'))

        user_obj = item.get('user', {})
        username = user_obj.get('username') or f"creator_{code.lower()}"
        full_name = user_obj.get('full_name') or username
        profile_pic_url = user_obj.get('profile_pic_url')

        caption_obj = item.get('caption')
        caption_text = ""
        if isinstance(caption_obj, dict):
            caption_text = caption_obj.get('text', '')
        elif isinstance(caption_obj, str):
            caption_text = caption_obj

        likes_count = item.get('like_count', 0)
        comments_count = item.get('comment_count', 0)
        play_count = item.get('play_count', 0)
        timestamp = item.get('device_timestamp') or item.get('taken_at') or int(time.time())

        print(f"[{idx}/{len(items_to_process)}] Processing @{username} (Code: {code})...")

        # 1. Download Video (.mp4)
        video_filename = f"{code}.mp4"
        video_dest = os.path.join(out_media_dir, video_filename)
        video_ok = False
        if video_url:
            video_ok = download_file(video_url, video_dest, label=f"Video {video_filename}")

        # 2. Download Thumbnail (.jpg)
        thumb_filename = f"{code}_thumb.jpg"
        thumb_dest = os.path.join(out_media_dir, thumb_filename)
        if thumbnail_url:
            download_file(thumbnail_url, thumb_dest, label=f"Thumb {thumb_filename}")

        # 3. Download Creator Avatar (.jpg)
        avatar_rel_path = f"{args.base_url.rstrip('/')}/avatars/{username}.jpg"
        if args.save_avatars and profile_pic_url:
            avatar_dest = os.path.join(avatars_dir, f"{username}.jpg")
            if download_file(profile_pic_url, avatar_dest, label=f"Avatar {username}"):
                pass
            else:
                avatar_rel_path = profile_pic_url  # fallback to remote if download fails
        else:
            avatar_rel_path = profile_pic_url or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"

        # Construct final public URLs
        base_clean = args.base_url.rstrip('/')
        final_video_url = f"{base_clean}/{video_filename}"
        final_thumb_url = f"{base_clean}/{thumb_filename}"

        # Build Celoris Post Object
        celoris_post = {
            "id": f"post_reel_{code}",
            "userId": f"user_{username}",
            "user": {
                "id": f"user_{username}",
                "username": username,
                "name": full_name,
                "avatar": avatar_rel_path,
                "bio": f"Digital Creator · Content on Celoris Pulse",
                "isVerified": user_obj.get('is_verified', True if likes_count > 50000 else False),
                "followersCount": max(int(likes_count * 0.45), 1200),
                "followingCount": 180,
                "postsCount": 24,
                "isOnline": True
            },
            "images": [final_video_url],
            "thumbnail": final_thumb_url,
            "mediaType": "video",
            "aspectRatio": "9:16",
            "caption": caption_text.strip(),
            "likesCount": likes_count,
            "commentsCount": comments_count,
            "playCount": play_count,
            "createdAt": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime(timestamp if timestamp < 1e11 else timestamp / 1000)),
            "tags": parse_hashtags(caption_text),
            "isLiked": False,
            "isSaved": False,
            "comments": []
        }

        celoris_posts.append(celoris_post)
        if video_ok:
            success_count += 1

    # Save Clean Output JSON Manifest
    manifest_file = os.path.join(out_media_dir, "celoris_reels_manifest.json")
    with open(manifest_file, 'w', encoding='utf-8') as f:
        json.dump(celoris_posts, f, indent=2, ensure_ascii=False)

    print(f"\n=======================================================")
    print(f"  DOWNLOAD COMPLETE!")
    print(f"=======================================================")
    print(f"Successfully downloaded : {success_count} / {len(items_to_process)} video reels")
    print(f"Saved media files to   : {out_media_dir}")
    print(f"Manifest written to    : {manifest_file}")
    print(f"=======================================================\n")
    print("Next step: You can now serve these videos directly from your VPS")
    print("or import `celoris_reels_manifest.json` straight into Celoris Social Cloud!\n")

if __name__ == '__main__':
    main()
