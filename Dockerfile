FROM node:20

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Expose port
EXPOSE 5000

# Command to run the app
CMD ["npm", "start"]