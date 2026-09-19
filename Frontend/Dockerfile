# Stage 1: Build React/Vite app with Node.js
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve built static files using lightweight Nginx
FROM nginx:alpine

# Copy built dist files to Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose Nginx default port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]