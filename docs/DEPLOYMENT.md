# HIPAA Wiki Deployment Guide

This document outlines the deployment process for the HIPAA Wiki application.

## Prerequisites

- Docker installed on your local machine
- Access to GitLab repository with proper permissions
- (Optional) AWS CLI configured if deploying to AWS

## Local Deployment

### Running with Docker Compose

1. Build the Docker image:
   ```
   docker-compose build
   ```

2. Start the container:
   ```
   docker-compose up -d
   ```

3. Access the application at http://localhost:3005

4. Stop the container:
   ```
   docker-compose down
   ```

## GitLab Registry Deployment

To push the Docker image to GitLab Container Registry:

1. Run the provided script:
   ```
   ./push-to-gitlab.sh
   ```

2. Follow the instructions provided by the script:
   - Log in to GitLab registry with your access token
   - Push the tagged images
   - Apply the updated CI/CD configuration

3. Once the image is pushed to GitLab Registry, the CI/CD pipeline can use it.

## AWS ECS Deployment

The project includes a CI/CD pipeline for deploying to AWS ECS:

1. Ensure the following environment variables are set in GitLab CI/CD:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_ACCOUNT_ID`
   - `AWS_DEFAULT_REGION`

2. The pipeline will:
   - Pull the image from GitLab Registry
   - Push it to AWS ECR
   - Update the ECS service to use the new image

## Configuration

The application has the following configuration options:

### Environment Variables

- `NODE_ENV` - Set to 'production' for production deployments
- Additional environment variables can be added to `docker-compose.yml`

### .gitlab-ci.yml

The CI/CD pipeline is configured in `.gitlab-ci.yml` and includes:
- Building the Docker image
- Pushing to GitLab Registry
- Deploying to AWS ECS (production and staging)

## Troubleshooting

### Common Issues

- **Health check failing**: Check if the application is running inside the container:
  ```
  docker-compose logs
  ```

- **Container not starting**: Verify Docker is running and port 3005 is available:
  ```
  docker ps
  lsof -i :3005
  ```

- **AWS deployment issues**: Check AWS logs and ensure proper permissions for ECR and ECS.

## Maintenance

- Regularly update dependencies by running `npm update` and rebuilding the Docker image.
- Check for security updates in the Node.js base image.
- Monitor application logs for errors or warnings.

For additional support, contact the development team.