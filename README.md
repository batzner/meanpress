# meanpress
A very simple CMS based on the MEAN stack

## Installation
1. Install `node` and `npm` by [downloading the installer](https://nodejs.org/en/download/).
2. Install and run the [mongoDB community server](https://server.js.mongodb
.com/download-center#community). Create a database.
3. Run `npm install` in the project's root directory.
4. Set the following environment variables in `resources/env_vars.sh`
    - `MONGO_URL=mongodb://<dbuser>:<dbpassword>@<host>:<port>/<dbname>`
    - `JWT_SECRET=rand0mAlphanumer1cString`
5. Source `resources/env_vars.sh` in your `.bashrc` by adding 
        
        source ~/path/to/resources/env_vars.sh
    
    at the end. 
6. Run `node bin/server.js` and go to `localhost:3000`.

## Setup
1. Enable registration in `routes/index.js` by setting `REGISTRATION_ENABLED = true`.
2. Restart the server and go to `localhost:3000/register`.
3. Create a user and click register. From now on, visit `localhost:3000/login` to log in.

## Deployment to Production
1. Install `node` and `mongoDB` on your host. For AWS, I can recommend [this tutorial]
(https://scotch.io/tutorials/deploying-a-mean-app-to-amazon-ec2-part-1).
2. Clone the repository on the host and run `sudo npm install`.
3. Copy `resources/env_vars.sh` to `resources/env_vars.prod.sh` and change the port, mongoDB URL 
etc.
4. Source `resources/env_vars.prod.sh` in `~/.bashrc`.
5. Install the `forever` node module.
6. Start the server with `sudo -E forever start ./bin/server.js`. The `sudo` is needed for running on port 80. The `-E` will preserve the existing environment variables (port, mongoDB URL etc.).
7. TODO: Activate Babel processing

TODO: Run all npm 