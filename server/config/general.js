module.exports = {
    JWT_SECRET: 'rand0mAlphanumer1cString',
    MONGO_URL: 'mongodb://localhost:27017/blog',
    PORT: 3000,
    REGISTRATION_ENABLED: false
};

// If we are in production, overwrite the module exports
if (process.env.NODE_ENV === 'production') {
    module.exports = require('general.prod');
}