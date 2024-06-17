// config/swaggerConfig.js
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API for Welto Backend',
        },
        servers: [
            {
                url: process.env.SERVER_URL,
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJsDoc(options);

module.exports = specs;