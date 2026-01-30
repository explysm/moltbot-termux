import subprocess
from github import Github

# --- Config ---
GITHUB_TOKEN = "your_github_token"
REPO_NAME = "your_username/your_fork"
UPSTREAM_REPO = "original_owner/original_repo"

def get_missing_commits():
    g = Github(GITHUB_TOKEN)
    repo = g.get_repo(REPO_NAME)
    # Compare your main branch to the upstream main
    comparison = repo.compare("main", f"{UPSTREAM_REPO}:main")
    return [c.commit.message for c in comparison.commits]

def call_gemini_cli(commit_list):
    # Prepare the prompt
    commits_text = "\n".join(commit_list)
    prompt = (
        f"I have these new commits from an upstream repo. "
        f"Turn them into a clean Markdown checklist for my todo.md. "
        f"Only output the markdown:\n\n{commits_text}"
    )

    # Use subprocess to run the CLI command you already have installed
    # 'gemini' is the command, we pass the prompt as an argument or via stdin
    try:
        result = subprocess.run(
            ["gemini", prompt], 
            capture_output=True, 
            text=True, 
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"CLI Error: {e.stderr}")
        return None

# --- Main Logic ---
new_commits = get_missing_commits()

if new_commits:
    print(f"Found {len(new_commits)} new commits. Asking Gemini to process...")
    todo_content = call_gemini_cli(new_commits)
    
    if todo_content:
        with open("todo.md", "a") as f:
            f.write(f"\n\n### Upstream Updates\n{todo_content}\n")
        print("Successfully updated todo.md")
else:
    print("Everything is up to date!")

