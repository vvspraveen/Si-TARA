# Use the official Node.js image as the base image
FROM node:18 as builder

# Set the working directory inside the container
WORKDIR /app
COPY .npmrc .
# Copy package.json and package-lock.json (if available)
COPY package*.json ./
COPY frontend.kit-npm-3.4.0.tgz .
RUN npm install frontend.kit-npm-3.4.0.tgz
RUN npm install fernet
# Install dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the React app for production
RUN npm run build

FROM nginx

COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
