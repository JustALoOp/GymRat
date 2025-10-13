# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy root package.json and package-lock.json
COPY package*.json ./

# Install production dependencies for the backend
RUN npm install --only=production

# Copy backend source code
COPY backend/ ./backend

# Expose port 5000
EXPOSE 5000

# Define the command to run your app
CMD [ "node", "backend/server.js" ]