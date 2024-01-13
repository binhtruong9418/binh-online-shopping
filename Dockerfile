FROM node:16.20.2

#Change directory
WORKDIR /app

# cache node_modules
COPY package.json .

RUN yarn install

# copy my source code
COPY . .

#build js version
#RUN npm run build
RUN yarn build

RUN apt update
RUN apt install -y nginx
RUN mv default /etc/nginx/sites-available/
# expose port 3000
EXPOSE 4173


# run command to start the server
#CMD  ["yarn", "preview"]
CMD service nginx restart && yarn preview
