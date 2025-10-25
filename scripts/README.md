# GitHub Stats Update Script

## Setup

1. Get a GitHub Personal Access Token:
   - Go to https://github.com/settings/tokens
   - Generate new token (classic)
   - No special scopes needed for public repos

2. Run the script:
   ```bash
   GITHUB_TOKEN=your_token_here node scripts/update-github-stats.js
   ```

## Automation Options

### Option 1: Local Cron (Run from your computer)
```bash
# Edit crontab
crontab -e

# Add this line to run every Sunday at 2am
0 2 * * 0 cd /path/to/ascii && GITHUB_TOKEN=your_token node scripts/update-github-stats.js
```

### Option 2: Server Cron (Run from your home server)
Same as above, but on your home server.

### Option 3: GitHub Actions (Run on push or schedule)
Create `.github/workflows/update-stats.yml` - automatically runs in CI.

After updating stats, commit the changes to `data/about.json` and deploy.
