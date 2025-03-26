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

The project includes an automated script to push Docker images to GitLab Container Registry:

1. Configure GitLab authentication (one of the following methods):
   - Set the `GITLAB_TOKEN` environment variable: 
     ```
     export GITLAB_TOKEN=your_personal_access_token
     ```
   - Log in manually first (credentials will be stored): 
     ```
     docker login registry.gitlab.com -u your_gitlab_username
     ```
   - In GitLab CI, the script automatically uses the available token

2. Run the automated script:
   ```
   ./push-to-gitlab.sh
   ```

3. The script will:
   - Authenticate with GitLab Registry
   - Tag the Docker image with latest and timestamp tags
   - Push the images to GitLab Registry
   - Output confirmation when complete

4. Once the image is pushed to GitLab Registry, the CI/CD pipeline will automatically deploy to AWS when code changes are pushed to the repository.

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

## Port Configuration

The application is configured to handle port mapping properly between local development and AWS deployment:

1. **Container Internal Port**: The application runs on port 3000 inside the container
2. **Local Development**: Docker Compose maps port 3005 on the host to port 3000 in the container
3. **AWS ECS**: The container port 3000 is exposed to the load balancer

This port configuration ensures consistency between local and AWS environments. The PORT environment variable is explicitly set to 3000 in the container to avoid any port-related issues.

## Configuration

The application has the following configuration options:

### Environment Variables

- `NODE_ENV` - Set to 'production' for production deployments
- `PORT` - Set to 3000 for the container's internal port
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
