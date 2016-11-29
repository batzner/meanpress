# meanpress
A very simple CMS based on the MEAN stack

## Installation
1. Install `node` and `npm` by [downloading the installer](https://nodejs.org/en/download/).
2. Install and run the [mongoDB community server](https://www.mongodb.com/download-center#community).
3. Run `npm install` in the project's root directory.
4. Set an environment variable called `JWT_SECRET`: `export JWT_SECRET=r4nd0mAlphanumer1cString`
5. Run `node bin/www` and go to `localhost:3000`.

## Setup
1. Enable registration in `routes/index.js` by setting `REGISTRATION_ENABLED = true`.
2. Restart the server and go to `localhost:3000/register`.
3. Create a user and click register. From now on, visit `localhost:3000/login` to log in.