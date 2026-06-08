FROM node:24-slim

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

RUN npm install -g yarn@1.22.22

WORKDIR /app/api

COPY api/package.json api/yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

COPY api/ ./

RUN yarn generate && yarn build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["yarn", "start:prod"]
