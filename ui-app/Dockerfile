FROM node:14-alpine

ARG SERVICE_PORT
ENV PORT=$SERVICE_PORT

# Create app directory
WORKDIR /usr/src/app

# Add `usr/src/app/node_modules/.bin` to $PATH
ENV PATH=/usr/src/app/node_modules/.bin:$PATH

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python && \
  npm install --quiet node-gyp -g &&\
  npm install --quiet && \
  apk del native-deps
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
RUN npm rebuild node-sass

EXPOSE ${SERVICE_PORT}
CMD [ "npm", "run", "start"]
