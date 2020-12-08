module.exports = {
    // MongoDB
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost/uniburger',

    // JWT
    TOKEN_SECRET: process.env.TOKEN_SECRET || 'chiave',

    // Express Server Port
    LISTEN_PORT: process.env.LISTEN_PORT || 3001
};