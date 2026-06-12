#!/usr/bin/env bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}--- FastDeck Conventional Commit Builder ---${NC}"

# Check branch name
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" == "main" ]]; then
    echo -e "${RED}❌ Error: You are on the 'main' branch. Please switch to a feature branch (AmitRaikwar/...) before committing.${NC}"
    exit 1
fi

if [[ ! "$CURRENT_BRANCH" =~ ^AmitRaikwar/ ]]; then
    echo -e "${RED}❌ Error: Invalid branch name '$CURRENT_BRANCH'. Branch names must start with 'AmitRaikwar/'.${NC}"
    exit 1
fi

# Check for staged changes
if [ -z "$(git diff --cached --name-only)" ]; then
    echo -e "${YELLOW}⚠️  No changes staged for commit. Please stage changes using 'git add' first.${NC}"
    exit 1
fi

# 1. Type
echo "Select the type of change:"
echo "  1) feat     (New feature)"
echo "  2) fix      (Bug fix)"
echo "  3) docs     (Documentation)"
echo "  4) style    (Formatting, missing semi colons, etc)"
echo "  5) refactor (Refactoring production code)"
echo "  6) perf     (Performance improvements)"
echo "  7) test     (Adding missing tests, refactoring tests)"
echo "  8) build    (Build system, external dependencies)"
echo "  9) ci       (CI configuration, scripts)"
echo " 10) chore    (Other changes that don't modify src or test files)"
echo " 11) revert   (Reverts a previous commit)"

read -p "Selection [1-11]: " TYPE_NUM

case $TYPE_NUM in
    1) TYPE="feat" ;;
    2) TYPE="fix" ;;
    3) TYPE="docs" ;;
    4) TYPE="style" ;;
    5) TYPE="refactor" ;;
    6) TYPE="perf" ;;
    7) TYPE="test" ;;
    8) TYPE="build" ;;
    9) TYPE="ci" ;;
    10) TYPE="chore" ;;
    11) TYPE="revert" ;;
    *) echo -e "${RED}Invalid selection. Defaulting to 'chore'.${NC}"; TYPE="chore" ;;
esac

# 2. Scope
read -p "Enter Scope (e.g., web, desktop, mobile, shared, project, build, ci, scripts) [optional]: " SCOPE

# 3. Title
read -p "Enter Title (short description): " TITLE
if [ -z "$TITLE" ]; then
    echo -e "${RED}Title is required! Exiting.${NC}"
    exit 1
fi

# 4. Details
read -p "Enter Details (longer description) [optional]: " DETAILS

# Construct commit message
if [ -z "$SCOPE" ]; then
    COMMIT_MSG="$TYPE: $TITLE"
else
    COMMIT_MSG="$TYPE($SCOPE): $TITLE"
fi

echo -e "\n${BLUE}Constructed Commit Message:${NC}"
echo "$COMMIT_MSG"
if [ -n "$DETAILS" ]; then
    echo "$DETAILS"
fi
echo ""

# Commit
if [ -z "$DETAILS" ]; then
    git commit -m "$COMMIT_MSG"
else
    git commit -m "$COMMIT_MSG" -m "$DETAILS"
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully committed!${NC}"
else
    echo -e "${RED}❌ Commit failed.${NC}"
fi
