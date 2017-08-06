# meanpress
A very simple CMS based on the MEAN stack, written in ECMAScript 6.

## Showcase:
http://ec2-54-200-157-28.us-west-2.compute.amazonaws.com/ (online as of 2017-08-06)

## Installation
1. Install `node (v6.9.2)` and `npm (v3.10.9)` by [downloading the installer](https://nodejs.org/en/download/).
2. Install and run the [mongoDB community server](https://server.js.mongodb.com/download-center#community). Create a database.
3. Run `npm install` and `npm install --prefix public/javascripts/lib` in the project's root directory.
4. Set the mongoDB URL in `server/config/general.js` and set `REGISTRATION_ENABLED: true`.
5. Run `npm start` and go to `localhost:3000`.

## Setup
1. Go to `localhost:3000/register`.
2. Create a user and click register. From now on, visit `localhost:3000/login` to log in.
3. Deactivate registering again in the config.

## Deployment to Production

### First time
1. Install `node` and `mongoDB` on your host. For AWS, I can recommend [this tutorial](https://scotch.io/tutorials/deploying-a-mean-app-to-amazon-ec2-part-1).
2. `sudo git clone https://github.com/batzner/meanpress.git` and `cd meanpress`
3. `sudo npm install gulp forever -g`
4. `sudo vim server/config/general-prod.js` - Change your mongoDB URL, port etc. here

### Every time
1. `sudo git pull`
2. `sudo npm install` and `sudo npm install --prefix public/javascripts/lib`
3. `sudo gulp`
4. `sudo forever stopall`
5. `sudo npm run-script server` and test the site in your browser.
6. `sudo npm run-script forever` to detach.
