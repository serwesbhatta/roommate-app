# Use a Node.js runtime as the base image
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Use Nginx to serve the built app
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf 
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]