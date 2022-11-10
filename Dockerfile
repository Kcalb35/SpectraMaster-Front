FROM node:latest AS builder
WORKDIR /usr/src/app
COPY yarn.lock package.json .env.production.local  ./

CMD npm config set registry https://registry.npm.taobao.org
RUN yarn install

COPY public/ ./public/
COPY src/ ./src/
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN yarn build

FROM node:lts-slim
RUN npm install -g serve 

RUN mkdir /usr/spectra
COPY --from=builder /usr/src/app/build/ /usr/spectra/
CMD npx serve -s /usr/spectra/ -p 3000
