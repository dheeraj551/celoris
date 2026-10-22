import os
import subprocess
import psutil
from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, MessageHandler, filters
from google import genai
from google.genai import types

BOT_TOKEN = os.environ.get("CELORIS_TELEGRAM_BOT_TOKEN", "").strip()
ALLOWED_USERNAMES = ["celorisdesigns", "burningrose91"]
GEMINI_KEY = os.environ.get("GOOGLE_API_KEY", "").strip()
WORKSPACE_DIR = os.environ.get("CELORIS_PROJECT_DIR", "/root/celoris").strip()

if not BOT_TOKEN:
    BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()

if not GEMINI_KEY:
    GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "").strip()

client = genai.Client(api_key=GEMINI_KEY)

def execute_bash(cmd: str) -> str:
    """Executes any terminal or shell command on the VPS (docker, git, pm2, systemctl, curl, etc.)."""
    cwd = WORKSPACE_DIR if os.path.exists(WORKSPACE_DIR) else "/root"
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=cwd)
    stdout = res.stdout.strip()
    stderr = res.stderr.strip()
    if res.returncode == 0:
        return stdout if stdout else "Command completed successfully with no output."
    return f"Error (Exit {res.returncode}):\n{stderr}\nStdout: {stdout}"

def get_accurate_cpu() -> str:
    """Calculates true Linux CPU usage using /proc/stat delta and load average."""
    import time
    try:
        with open('/proc/stat', 'r') as f:
            l1 = [float(x) for x in f.readline().split()[1:5]]
        time.sleep(0.2)
        with open('/proc/stat', 'r') as f:
            l2 = [float(x) for x in f.readline().split()[1:5]]
        
        user1, nice1, sys1, idle1 = l1
        user2, nice2, sys2, idle2 = l2
        
        total_diff = (user2 + nice2 + sys2 + idle2) - (user1 + nice1 + sys1 + idle1)
        idle_diff = idle2 - idle1
        if total_diff > 0:
            usage = ((total_diff - idle_diff) / total_diff) * 100.0
            return f"{max(0.0, min(100.0, usage)):.1f}%"
    except Exception:
        pass
    
    # Fallback: calculate from load average
    load1, _, _ = os.getloadavg()
    cores = os.cpu_count() or 1
    return f"{min(100.0, (load1 / cores) * 100):.1f}%"

def read_server_stats() -> str:
    """Gets real-time CPU, RAM, Disk, and Docker container status of the Contabo VPS."""
    cpu_str = get_accurate_cpu()
    cores = os.cpu_count() or 1
    load1, load5, load15 = os.getloadavg()
    ram = psutil.virtual_memory()
    disk = psutil.disk_usage('/')
    
    docker_check = subprocess.run("docker ps --format 'table {{.Names}}\t{{.Status}}'", shell=True, capture_output=True, text=True)
    docker_status = docker_check.stdout.strip() if docker_check.returncode == 0 else "Docker not running"

    return (
        f"🖥️ CPU: {cpu_str} (Load: {load1:.2f}, {load5:.2f}, {load15:.2f} · {cores} vCPUs)\n"
        f"🧠 RAM: {ram.percent}% used ({ram.used // (1024**2)}MB / {ram.total // (1024**2)}MB)\n"
        f"💾 Disk: {disk.percent}% used ({disk.free // (1024**3)}GB free)\n\n"
        f"🐳 Docker Containers:\n{docker_status}"
    )

def write_file(filepath: str, content: str) -> str:
    """Creates or updates any file on the VPS."""
    target = os.path.join(WORKSPACE_DIR, filepath) if not os.path.isabs(filepath) else filepath
    os.makedirs(os.path.dirname(target), exist_ok=True)
    with open(target, "w", encoding="utf-8") as f:
        f.write(content)
    return f"Saved file: {target}"

def read_file(filepath: str) -> str:
    """Reads a file on the VPS."""
    target = os.path.join(WORKSPACE_DIR, filepath) if not os.path.isabs(filepath) else filepath
    if not os.path.exists(target):
        return f"File not found: {target}"
    with open(target, "r", encoding="utf-8") as f:
        return f.read()

tools = [execute_bash, read_server_stats, write_file, read_file]
tool_map = {
    "execute_bash": execute_bash,
    "read_server_stats": read_server_stats,
    "write_file": write_file,
    "read_file": read_file,
}

sys_prompt = (
    "You are the 24/7 AI System Supervisor for Celoris Cloud on Contabo Ubuntu VPS. "
    "You manage LiveKit, Caddy, Docker, and the Celoris Next.js web repository. "
    "You have tools to execute bash commands, check server stats, and read/write code. "
    "Always call the appropriate tool when asked to check status, run commands, or edit files. "
    "Format replies in clean, concise Telegram markdown."
)

async def handle_prompt(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    username = (user.username or "").lower()
    
    if username not in [u.lower() for u in ALLOWED_USERNAMES]:
        await update.message.reply_text(f"⛔ Unauthorized access (User: @{user.username}).")
        return

    user_text = (update.message.text or "").strip()
    user_lower = user_text.lower()

    # Instant Zero-Latency Shortcuts (<0.1s response)
    if user_lower in ["status", "/status", "server status", "stats", "server stats"]:
        await update.message.reply_text(read_server_stats())
        return

    if user_lower in ["docker", "/docker", "ps", "docker ps", "containers"]:
        res = execute_bash("docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'")
        await update.message.reply_text(f"🐳 Docker Containers:\n{res}")
        return

    status_msg = await update.message.reply_text("⚡ Supervisor working...")

    try:
        # Non-blocking async call with thinking_budget=0 for instant 1-2s response
        response = await client.aio.models.generate_content(
            model='gemini-3-flash-preview',
            contents=user_text,
            config=types.GenerateContentConfig(
                system_instruction=sys_prompt,
                tools=tools,
                thinking_config=types.ThinkingConfig(thinking_budget=0),
            ),
        )
        
        reply = ""
        if response.function_calls:
            outputs = []
            for call in response.function_calls:
                fn_name = call.name
                fn_args = call.args or {}
                if fn_name in tool_map:
                    res = tool_map[fn_name](**fn_args)
                    outputs.append(str(res))
            reply = "\n\n".join(outputs)
        else:
            reply = response.text or "Command executed."
            
        await status_msg.edit_text(reply[:4000])
    except Exception as e:
        await status_msg.edit_text(f"❌ Error: {str(e)}")

async def handle_file(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    if (user.username or "").lower() not in [u.lower() for u in ALLOWED_USERNAMES]:
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
    caption = update.message.caption or "Please process this file on the VPS."

    status_msg = await update.message.reply_text(f"📥 Received `{file_name}`. Processing...")

    try:
        uploaded_gemini = client.files.upload(file=save_path)
        prompt = [
            uploaded_gemini,
            f"{caption}\n\nNote: The file is temporarily stored on the VPS at '{save_path}'. "
            f"You can copy or move it anywhere using execute_bash."
        ]

        response = await client.aio.models.generate_content(
            model='gemini-3-flash-preview',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction="You are Celoris's DevOps AI Assistant on the VPS. Process the file as requested.",
                tools=tools,
                thinking_config=types.ThinkingConfig(thinking_budget=0),
            ),
        )
        await status_msg.edit_text(response.text[:4000])
    except Exception as e:
        await status_msg.edit_text(f"❌ Error: {str(e)}")

if __name__ == '__main__':
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), handle_prompt))
    app.add_handler(MessageHandler(filters.PHOTO | filters.Document.ALL, handle_file))
    print("🚀 Celoris VPS Supervisor is live!")
    app.run_polling()
