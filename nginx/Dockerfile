FROM node:22.13.1-alpine AS build

WORKDIR /app

COPY react-app/package*.json ./

RUN npm install

COPY react-app/ ./

ARG REACT_APP_API_BASE_URL

ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}

RUN npm run build

FROM nginx

WORKDIR /usr/share/nginx/html

RUN rm index.html

COPY --from=build /app/build .

EXPOSE 80

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]