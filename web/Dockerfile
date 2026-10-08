FROM node:24-slim AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM nginx:alpine
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist/latamtechtn-web/browser /usr/share/nginx/html
ENV PORT=8080
EXPOSE 8080
