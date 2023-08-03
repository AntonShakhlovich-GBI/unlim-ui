# Use the official Node.js image as a base
FROM node:17-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

RUN npm ci
# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Build the production version of the React app
RUN npm run build

# Expose the port that the React app will run on
EXPOSE 3000

CMD [ "npm", "start" ]





