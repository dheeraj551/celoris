#!/usr/bin/env python3
"""
Celoris 24/7 AI VPS Supervisor Daemon
Connects to Telegram, receives commands via text/voice/files,
and executes them on the Contabo VPS autonomously.
"""

import os
import sys
import subprocess
import psutil
from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, MessageHandler, filters
from google import genai
from google.genai import types

# Read from environment variables
BOT_TOKEN = os.environ.get("CELORIS_TELEGRAM_BOT_TOKEN", "").strip()
ADMIN_CHAT_ID_STR = os.environ.get("CELORIS_ADMIN_CHAT_ID", "").strip()
GEMINI_KEY = os.environ.get("GOOGLE_API_KEY", "").strip()
PROJECT_DIR = os.environ.get("CELORIS_PROJECT_DIR", "/var/www/celoris").strip()

if not BOT_TOKEN:
    print("[!] ERROR: CELORIS_TELEGRAM_BOT_TOKEN environment variable not set.")
    sys.exit(1)

if not GEMINI_KEY:
    print("[!] ERROR: GOOGLE_API_KEY environment variable not set.")
    sys.exit(1)

try:
    ADMIN_CHAT_ID = int(ADMIN_CHAT_ID_STR) if ADMIN_CHAT_ID_STR else None
except ValueError:
    print(f"[!] Warning: Invalid ADMIN_CHAT_ID '{ADMIN_CHAT_ID_STR}'.")
    ADMIN_CHAT_ID = None

client = genai.Client(api_key=GEMINI_KEY)

# === AGENT TOOLS ===

def execute_bash(cmd: str) -> str:
    """Executes any terminal or shell command on the VPS (docker, git, pm2, systemctl, etc.)."""
    work_dir = PROJECT_DIR if os.path.exists(PROJECT_DIR) else "/root"
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=work_dir)
    stdout = res.stdout.strip()
    stderr = res.stderr.strip()
    if res.returncode == 0:
        return stdout if stdout else "Command completed successfully with no output."
    return f"Error (Exit {res.returncode}):\n{stderr}\nStdout: {stdout}"

def read_server_stats() -> str:
    """Gets real-time CPU, RAM, Disk, and Docker status of the Contabo VPS."""
    cpu = psutil.cpu_percent(interval=0.5)
    ram = psutil.virtual_memory()
    disk = psutil.disk_usage('/')
    
    # Check docker containers
    docker_check = subprocess.run(
        "docker ps --format 'table {{.Names}}\t{{.Status}}'",
        shell=True, capture_output=True, text=True
    )
    docker_status = docker_check.stdout.strip() if docker_check.returncode == 0 else "Docker not running or no permissions"

    return (
        f"🖥️ CPU: {cpu}%\n"
        f"🧠 RAM: {ram.percent}% used ({ram.used // (1024**2)}MB / {ram.total // (1024**2)}MB)\n"
        f"💾 Disk: {disk.percent}% used ({disk.free // (1024**3)}GB free)\n\n"
        f"🐳 Docker Containers:\n{docker_status}"
    )

def write_file(filepath: str, content: str) -> str:
    """Creates or overwrites a file in the project."""
    target = os.path.join(PROJECT_DIR, filepath) if not os.path.isabs(filepath) else filepath
    os.makedirs(os.path.dirname(target), exist_ok=True)
    with open(target, "w", encoding="utf-8") as f:
        f.write(content)
    return f"Successfully saved file: {filepath}"

def read_file(filepath: str) -> str:
    """Reads the contents of a file in the project."""
    target = os.path.join(PROJECT_DIR, filepath) if not os.path.isabs(filepath) else filepath
    if not os.path.exists(target):
        return f"File does not exist: {filepath}"
    try:
        with open(target, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        return f"Error reading file: {str(e)}"

tools = [execute_bash, read_server_stats, write_file, read_file]

# === TELEGRAM HANDLERS ===

async def handle_prompt(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    if ADMIN_CHAT_ID and user_id != ADMIN_CHAT_ID:
        await update.message.reply_text("⛔ Unauthorized access.")
        return

    user_text = update.message.text
    status_msg = await update.message.reply_text("⚡ Supervisor working on Contabo VPS...")

    sys_prompt = (
        "You are the 24/7 AI System Supervisor for Celoris Cloud running on a Contabo Ubuntu VPS. "
        "You manage LiveKit, Caddy, Docker, and the Celoris Next.js web repository. "
        "You have tools to execute bash commands, check server stats, and read/write code. "
        "Keep your replies concise and formatted in Telegram markdown. "
        "When executing tasks, explain what you did and provide the output."
    )

    try:
        response = client.models.generate_content(
            model='gemini-2.5-pro',
            contents=user_text,
            config=types.GenerateContentConfig(
                system_instruction=sys_prompt,
                tools=tools,
            ),
        )
        reply = response.text or "Command executed."
        await status_msg.edit_text(reply[:4000])
    except Exception as e:
        await status_msg.edit_text(f"❌ Error: {str(e)}")

async def handle_file_upload(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    if ADMIN_CHAT_ID and user_id != ADMIN_CHAT_ID:
        return

    file_obj = None
    file_name = "upload.tmp"

    if update.message.photo:
        file_obj = await update.message.photo[-1].get_file()
        file_name = "image.jpg"
    elif update.message.document:
        file_obj = await update.message.document.get_file()
        file_name = update.message.document.file_name or "document.bin"

    save_path = os.path.join("/tmp", file_name)
    await file_obj.download_to_drive(save_path)
    caption = update.message.caption or "Please process and integrate this file into the project."

    status_msg = await update.message.reply_text(f"📥 Received `{file_name}`. Processing...")

    try:
        uploaded_gemini = client.files.upload(file=save_path)
        prompt = [
            uploaded_gemini,
            f"{caption}\n\nNote: The file is temporarily stored on the VPS at '{save_path}'. "
            f"You can copy or move it to '{PROJECT_DIR}' using execute_bash."
        ]

        response = client.models.generate_content(
            model='gemini-2.5-pro',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction="You are Celoris's DevOps AI Assistant on the VPS. Process the file as requested.",
                tools=tools,
            ),
        )
        await status_msg.edit_text(response.text[:4000])
    except Exception as e:
        await status_msg.edit_text(f"❌ Error processing file: {str(e)}")

if __name__ == '__main__':
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), handle_prompt))
    app.add_handler(MessageHandler(filters.PHOTO | filters.Document.ALL, handle_file_upload))
    print("🚀 Celoris VPS Supervisor is live and listening on Telegram!")
    app.run_polling()
