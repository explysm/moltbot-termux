# 🦞 OpenClaw Termux

<p align="center">
  <img src="https://raw.githubusercontent.com/openclaw/openclaw/main/docs/whatsapp-clawd.jpg" alt="Clawdbot" width="400">
</p>

<p align="center">
  <a href="https://github.com/explysm/moltbot-termux/actions/workflows/ci.yml?branch=main"><img src="https://img.shields.io/github/actions/workflow/status/explysm/moltbot-termux/ci.yml?branch=main&style=for-the-badge" alt="CI status"></a>
  <a href="https://github.com/explysm/moltbot-termux/releases"><img src="https://img.shields.io/github/v/release/explysm/moltbot-termux?include_prereleases&style=for-the-badge" alt="GitHub release"></a>
  <a href="https://discord.gg/clawd"><img src="https://img.shields.io/discord/1456350064065904867?label=Discord&logo=discord&logoColor=white&color=5865F2&style=for-the-badge" alt="Discord"></a>
</p>

**OpenClaw Termux** is a specialized distribution of [OpenClaw](https://github.com/openclaw/openclaw), optimized for **mid-to-high range Android devices** via Termux. It brings a powerful personal AI assistant to your phone, capable of interacting across WhatsApp, Telegram, Signal, Discord, and more.

---

### 📱 Termux Optimizations
- **Stability**: Integrated `termux-wake-lock` to prevent the Gateway from being killed when the screen is off.
- **Resource Management**: Capped Node.js heap to **1GB** to prevent mobile RAM OOM crashes.
- **Performance**: SQLite optimized with **WAL mode** for mobile flash storage.
- **Tools**: Added **DuckDuckGo** for free web search and `termux-api` for native notifications/toasts.
- **Diagnostics**: Specialized `moltbot doctor` checks tailored for the Android environment.

---

### 🚀 Quick Start

#### 1. Install (Recommended)
```bash
curl -s https://explysm.github.io/moltbot-termux/install.sh | sh
```

#### 2. Initialize
```bash
moltbot onboard
```

#### 3. Run Gateway
```bash
moltbot gateway --port 18789 --verbose
```

---

### 🛠 Essential Fixes for Termux

**NDK Build Fix** (if gemini cli npm installation fails):
```bash
mkdir -p ~/.gyp && echo "{ 'variables': { 'android_ndk_path': '' } }" > ~/.gyp/include.gypi
```

**Manual Clipboard Fix**:
If clipboard functionality is required and not handled by the installer, run this script to stub the clipboard provider for mobile:
```bash
# Save as fix-clipboard.sh and run
CLIPBOARD_FIX_PATH=$(find "$HOME/.local/share/pnpm/global" -name "index.js" -path "*/@mariozechner/clipboard/*" | head -n 1)
if [ -n "$CLIPBOARD_FIX_PATH" ]; then
    cat > "$CLIPBOARD_FIX_PATH" <<EOF
module.exports = {
  availableFormats: () => [], getText: () => "", setText: () => {}, hasText: () => false,
  getImageBinary: () => null, getImageBase64: () => null, setImageBinary: () => {},
  setImageBase64: () => {}, hasImage: () => false, getHtml: () => "", setHtml: () => {},
  hasHtml: () => false, getRtf: () => "", setRtf: () => {}, hasRtf: () => false,
  clear: () => {}, watch: () => {}, callThreadsafeFunction: () => {}
};
EOF
fi
```

---

### 🕹 Common Commands

| Task | Command |
| :--- | :--- |
| **Send Message** | `moltbot message send --to <number> --message "Hello"` |
| **Run Agent** | `moltbot agent --message "Do something" --thinking high` |
| **Check Health** | `moltbot status` or `moltbot health` |
| **Repair Config** | `moltbot doctor --fix` |
| **Update** | `moltbot update` |

---

### 📖 Documentation & Links
- **Official Docs**: [docs.molt.bot](https://docs.molt.bot)
- **Getting Started**: [Beginner's Guide](https://docs.molt.bot/start/getting-started)
- **Security**: [Security Guidance](https://docs.molt.bot/gateway/security)
- **Upstream**: [OpenClaw GitHub](https://github.com/openclaw/openclaw)

---

### 🦞 About OpenClaw
OpenClaw (formerly Moltbot) is a local-first, multi-channel AI gateway built for **Clawd**, the space-lobster assistant. 

**Special thanks to:**
- [Mario Zechner](https://mariozechner.at/) for [pi-mono](https://github.com/badlogic/pi-mono).
- Peter Steinberger and the hundreds of [clawtributors](https://github.com/openclaw/openclaw/graphs/contributors).

*OpenClaw Termux is maintained by the community. Licensed under MIT.*
