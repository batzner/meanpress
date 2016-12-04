# meanpress
A very simple CMS based on the MEAN stack

## Installation
1. Install `node` and `npm` by [downloading the installer](https://nodejs.org/en/download/).
2. Install and run the [mongoDB community server](https://www.mongodb
.com/download-center#community). Create a database.
3. Run `npm install` in the project's root directory.
4. Set the following environment variables in `resources/env_vars.sh`
    - `MONGO_URL=mongodb://<dbuser>:<dbpassword>@<host>:<port>/<dbname>`
    - `JWT_SECRET=rand0mAlphanumer1cString`
5. Source `resources/env_vars.sh` in your `.bashrc` by adding 
        
        source ~/path/to/resources/env_vars.sh
    
    at the end. 
6. Run `node bin/www` and go to `localhost:3000`.
7. In production, do: `sudo -E forever start ./bin/www` (TODO: Add forever install instructions.
 Explain sudo for port 80).
8. TODO: Activate Babel processing
9. TODO: Alle Schritte in Production Steps dokumentieren

## Setup
1. Enable registration in `routes/index.js` by setting `REGISTRATION_ENABLED = true`.
2. Restart the server and go to `localhost:3000/register`.
3. Create a user and click register. From now on, visit `localhost:3000/login` to log in.