#!/bin/bash

# Script to automatically push Docker image to GitLab registry

# Exit on any error
set -e

echo "Automated GitLab Registry Push - Starting"
echo "----------------------------------------"

# Extra debugging for CI environment
echo "CI Environment Variables:"
echo "CI_JOB_TOKEN length: ${#CI_JOB_TOKEN} characters"
echo "CI_REGISTRY: ${CI_REGISTRY}"
echo "CI_REGISTRY_IMAGE: ${CI_REGISTRY_IMAGE}"

# Handle GitLab authentication based on environment
if [ -n "$CI_JOB_TOKEN" ] && [ -n "$CI_REGISTRY" ]; then
  # We're in GitLab CI environment
  echo "Running in GitLab CI environment, using CI_JOB_TOKEN for authentication..."
  echo "$CI_JOB_TOKEN" | docker login "$CI_REGISTRY" -u gitlab-ci-token --password-stdin
elif [ -n "$GITLAB_TOKEN" ]; then
  # We have a personal access token
  GITLAB_USER=$(git config --get user.email || echo "your_gitlab_username")
  echo "Logging in to GitLab Registry using GITLAB_TOKEN..."
  echo "$GITLAB_TOKEN" | docker login registry.gitlab.com -u ${GITLAB_USER} --password-stdin
else
  # Check if already logged in
  if docker info 2>/dev/null | grep -q "Username:"; then
    echo "Using existing Docker registry credentials"
  else
    echo "Error: No authentication method available"
    echo "Either:"
    echo "  1. Set the GITLAB_TOKEN environment variable: export GITLAB_TOKEN=your_personal_access_token"
    echo "  2. Log in manually first: docker login registry.gitlab.com -u your_gitlab_username"
    echo "  3. Run this script within GitLab CI pipeline"
    exit 1
  fi
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
