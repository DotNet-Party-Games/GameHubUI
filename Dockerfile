#Declaring the environment we use to create our angular environment
FROM node:latest as build

#Setting our working directory
#workdir is a combination of mkdir and cd 
#meaning it will create the folder and change your directory to it
WORKDIR /usr/local/app

#Copying our angular project to that working directory
# ./ is the relative path of where the docker file is
COPY ./ /usr/local/app

#Restore our dependencies for this project
RUN npm install

#Build that application
RUN npm run build

#Serving the app with the nginx server
FROM nginx:latest

COPY --from=build /usr/local/app/dist/GameHubUI /usr/share/nginx/html

#exposing this port because by default nginx deploys the app in that port
EXPOSE 80

#docker build -t <username>/<nameOfImage>:<CurrentVersionOfImage> .