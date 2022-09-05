FROM node:14
WORKDIR /workspace
COPY . .
# RUN npm config set python $(which python)
# RUN npm config set python "/usr/bin/python2.7" -g
# # RUN npm i -g node-gyp@latest && npm config set node_gyp "/usr/local/lib/node_modules/node-gyp/bin/node-gyp.js"
# # RUN ["npm", "install", "-g", "@nrwl/cli"]
# # RUN ["npm", "install"]
# RUN npm i @nrwl/cli
COPY /prisma ./prisma/
RUN npm install
EXPOSE 3333
EXPOSE 9229
CMD [  "npm", "run", "start:migrate:dev" ]