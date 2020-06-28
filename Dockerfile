FROM node:14

# Create app directory
WORKDIR /usr/src/app

RUN apt-get update -y && apt-get install -y \
  imagemagick \
  tree

# Bundle app source
COPY . .
RUN npm install
RUN npm run install:server
RUN npm run install:generator
RUN npm run install:frontend
RUN npm install -g concurrently
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production


EXPOSE 3050
EXPOSE 3055
CMD ["concurrently","npm:server", "npm:generator"]
