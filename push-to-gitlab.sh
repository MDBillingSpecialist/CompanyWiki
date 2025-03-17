#!/bin/bash

# Script to push Docker image to GitLab registry

echo "This script will help you push the Docker image to GitLab registry"
echo "Make sure you have created a personal access token with 'write_registry' scope in GitLab"
echo

GITLAB_USER=$(git config --get user.email || echo "your_gitlab_username")
IMAGE_NAME="registry.gitlab.com/intelligent-systems-and-development/company-wiki"
LOCAL_IMAGE="company-wiki-company-wiki:latest"

echo "Using GitLab user: ${GITLAB_USER}"
echo "Local Docker image: ${LOCAL_IMAGE}"
echo "Target GitLab image: ${IMAGE_NAME}"
echo

# Ensure the image is tagged properly
echo "Tagging Docker image..."
docker tag ${LOCAL_IMAGE} ${IMAGE_NAME}:latest
docker tag ${LOCAL_IMAGE} ${IMAGE_NAME}:$(date +%Y%m%d-%H%M%S)

echo
echo "To push to GitLab registry, run the following commands:"
echo
echo "1. Log in to GitLab registry:"
echo "   docker login registry.gitlab.com -u ${GITLAB_USER}"
echo "   (You will be prompted for your personal access token)"
echo
echo "2. Push the Docker image to GitLab:"
echo "   docker push ${IMAGE_NAME}:latest"
echo "   docker push ${IMAGE_NAME}:$(date +%Y%m%d-%H%M%S)"
echo
echo "3. After pushing, you can use the image in GitLab CI/CD by updating .gitlab-ci.yml"
echo "   The new .gitlab-ci.yml.new file has been prepared for this."
echo "   To apply it: mv .gitlab-ci.yml.new .gitlab-ci.yml"
echo
echo "4. Image will then be accessible at:"
echo "   ${IMAGE_NAME}:latest"