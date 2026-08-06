const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Enable explicit CORS
server.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// OpenAPI 3.0 Swagger Specification
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Traveler Booking API",
    version: "1.0.0",
    description: "RESTful API for Travel Hotel Directory and Reservation System"
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "Local Development Server"
    }
  ],
  paths: {
    "/hotels": {
      get: {
        summary: "Get all hotels listing",
        responses: {
          "200": {
            description: "A list of hotel objects"
          }
        }
      }
    },
    "/hotels/{id}": {
      get: {
        summary: "Get hotel by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": { description: "Hotel object" },
          "404": { description: "Hotel not found" }
        }
      },
      patch: {
        summary: "Update hotel availability status",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  available: { type: "boolean" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Updated hotel object" }
        }
      }
    }
  }
};

// Mount Swagger UI at /api-docs
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 JSON Server with CORS running on port ${PORT}`);
  console.log(`📄 Swagger OpenAPI docs available at http://localhost:${PORT}/api-docs`);
});
