FROM node:14-alpine

ARG SERVICE_PORT
ENV PORT=$SERVICE_PORT

# Create app directory
WORKDIR /usr/src/app

ENV PATH=/usr/src/app/node_modules/.bin:$PATH

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE ${SERVICE_PORT}
CMD ["npm", "run", "dev"]
