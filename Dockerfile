FROM node:14
WORKDIR /app
COPY . .
COPY /prisma ./prisma/
RUN npm install
EXPOSE 3333

CMD [  "npm", "run", "start:migrate:serve" ]