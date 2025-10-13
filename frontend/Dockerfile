# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

# Copy frontend package.json and package-lock.json
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY frontend/ ./

# Build the React app
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]