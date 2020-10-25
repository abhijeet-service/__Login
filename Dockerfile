# Use an official node runtime as a parent image
FROM node:12.2.0-alpine
WORKDIR /app/
# Install dependencies
COPY package.json /app/
RUN npm install
RUN npm install -g serve
RUN npm install pubnub
RUN npm install pubnub-react@rc
# Add rest of the client code
COPY . /app/
EXPOSE 3000
RUN REACT_APP_ENV=development GENERATE_SOURCEMAP=false npm run build
CMD export PORT=3000 && serve -s build
# CMD ["npm","start"]
