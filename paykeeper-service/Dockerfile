FROM node:23

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the application code
COPY . .

ENV PORT=5000
# Expose the port
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]