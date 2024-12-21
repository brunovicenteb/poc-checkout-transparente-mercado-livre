FROM node:16 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build --prod

FROM nginx:alpine

COPY --from=build /app/dist/checkout-transparente-mercado-livre /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]