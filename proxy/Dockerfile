FROM node:18.13.0

WORKDIR /src
COPY ./ /src
WORKDIR /src/server
RUN npm install
RUN npm run build

EXPOSE 8000

ENTRYPOINT ["npm", "start"]
