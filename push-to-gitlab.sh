#!/bin/bash

# Script to automatically push Docker image to GitLab registry

# Exit on any error
set -e

echo "Automated GitLab Registry Push - Starting"
echo "----------------------------------------"

# Get GitLab credentials
GITLAB_USER=$(git config --get user.email || echo "your_gitlab_username")
GITLAB_TOKEN=${GITLAB_TOKEN:-$CI_JOB_TOKEN}  # Use CI_JOB_TOKEN if available in GitLab CI, otherwise use GITLAB_TOKEN env var

if [ -z "$GITLAB_TOKEN" ]; then
  # Check if token is stored in Docker config
  if ! docker info | grep -q "Username: ${GITLAB_USER}"; then
    echo "Error: GITLAB_TOKEN environment variable not set and not logged in to registry"
    echo "Either:"
    echo "  1. Set the GITLAB_TOKEN environment variable: export GITLAB_TOKEN=your_personal_access_token"
    echo "  2. Log in manually first: docker login registry.gitlab.com -u ${GITLAB_USER}"
    exit 1
  else
    echo "Using existing Docker registry credentials"
  fi
else
  echo "Logging in to GitLab Registry as ${GITLAB_USER}..."
  echo "$GITLAB_TOKEN" | docker login registry.gitlab.com -u ${GITLAB_USER} --password-stdin
fi

# Define image names
IMAGE_NAME="registry.gitlab.com/intelligent-systems-and-development/company-wiki"
LOCAL_IMAGE="company-wiki-company-wiki:latest"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

echo "Local Docker image: ${LOCAL_IMAGE}"
echo "Target GitLab image: ${IMAGE_NAME}"

# Tag Docker image
echo "Tagging Docker image..."
docker tag ${LOCAL_IMAGE} ${IMAGE_NAME}:latest
docker tag ${LOCAL_IMAGE} ${IMAGE_NAME}:${TIMESTAMP}

# Push to GitLab Registry
echo "Pushing Docker image to GitLab Registry..."
docker push ${IMAGE_NAME}:latest
docker push ${IMAGE_NAME}:${TIMESTAMP}

echo "----------------------------------------"
echo "GitLab Registry push completed successfully!"
echo "Image is now accessible at: ${IMAGE_NAME}:latest"
echo "Timestamped tag: ${IMAGE_NAME}:${TIMESTAMP}"
echo
echo "AWS deployment will proceed via GitLab CI/CD pipeline when changes are pushed to the repository."

# Make the script executable
chmod +x $0
