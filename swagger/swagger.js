const swaggerJsdocs = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API Project",
      version: "1.0.0",
      description: "Dokumentasi API Swagger - Daffala Viro Hidayat"
    },
    tags: [
      { name: "1. Module Membership"},
      { name: "2. Module Information"},
      { name: "3. Module Transaction"}
    ],
    servers: [
      {
        url: process.env.BASE_URL,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [], 
      },
    ],
  },
  apis: [path.join(__dirname, "../controller/*.js"), path.join(__dirname, "../routes/*.js")],
};

const specs = swaggerJsdocs(options);

console.log(specs);
const setupSwagger = (app) => {
    app.use("/", swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = setupSwagger;