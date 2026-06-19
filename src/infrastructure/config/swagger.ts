import swaggerJSDoc from 'swagger-jsdoc'

/**
 * Swagger/OpenAPI configuration.
 *
 * Documentation is generated from the @swagger JSDoc comments already
 * present in each route file — see src/infrastructure/http/routes/.
 */
const swaggerDefinition: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Personal Backend Showcase API',
      version: '1.0.0',
      description:
        'A sanitized excerpt from a private production backend, demonstrating Clean Architecture, testing practices, and code quality. Full repository available on request.',
    },
    servers: [
      {
        url: '/',
        description: 'Current server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Paste the raw JWT token returned by /auth/login — the "Bearer " prefix is added automatically.',
        },
      },
    },
  },
  apis: ['./src/infrastructure/http/routes/*.ts'],
}

export const swaggerSpec = swaggerJSDoc(swaggerDefinition)