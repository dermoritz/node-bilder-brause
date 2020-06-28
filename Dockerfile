FROM node:14

# Create app directory
WORKDIR /usr/src/app

RUN apt-get update -y && apt-get install imagemagick -y 

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /

EXPOSE 3050
EXPOSE 3055
CMD npm run server ; npm run generator
