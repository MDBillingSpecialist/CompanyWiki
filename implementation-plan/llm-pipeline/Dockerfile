FROM node:18-alpine

WORKDIR /app

# Create directory for logs and content cache
RUN mkdir -p /app/logs /app/content-cache

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3400

# Expose the application port
EXPOSE 3400

# Start the application
CMD ["node", "src/index.js"]