FROM node:18-alpine

WORKDIR /app

# Create directory for logs
RUN mkdir -p /app/logs

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3100

# Expose the application port
EXPOSE 3100

# Start the application
CMD ["node", "src/index.js"]