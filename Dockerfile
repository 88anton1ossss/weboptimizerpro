# Use Node.js 20 Alpine as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev for build)
RUN npm install

# Copy all project files
COPY . .

# Build the Vite app
RUN npm run build

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Set environment variable for port
ENV PORT=8080

# Start the server
CMD ["node", "server.js"]
