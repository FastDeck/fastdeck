# Commit & Branching Skill

Whenever the user asks to "make a commit" or "commit the changes", follow this workflow:

## 1. Branching Strategy
Before committing, check the current branch:
- If you are on `main`, you MUST create a new branch first.
- **Branch Naming**: `AmitRaikwar/{description-of-change}`
  - The description should be 3-7 words, kebab-cased (e.g., `AmitRaikwar/enforce-branch-naming-rules`).
- If you are already on a feature branch (not `main`), ensure it starts with `AmitRaikwar/`.

## 2. Committing (Initial)
Use the following command to perform the initial commit:
```bash
make commit
```
- **Input Strategy**: Provide all inputs (Type, Scope, Title, Details) in a **single** `send_command_input` call, separated by newlines.
  - Example: `1\nscripts\nupdate commit script\nAdded branch validation to commit.sh\n`

## 3. Amending the Commit
After the initial commit, you MUST amend it to include structured technical details.
```bash
git commit --amend -m "{original_subject}" -m "{original_details}" -m "### Requirement
{detailed_requirement_from_user}" -m "### Description of Changes
{detailed_technical_description}"
```
- This ensures the commit history contains both the conventional summary and the deep technical context.

## 4. Automation & Permissions
- For all commands, set `SafeToAutoRun: true`.
- The user has granted permission to execute these steps without individual command approval.
