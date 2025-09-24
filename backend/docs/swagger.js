import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Smart University Helpdesk',
      version: '1.0.0',
      description: `
      This backend provides a smart university helpdesk system using AI agents.

      Features:
       - Complaint Resolver: Automatically classify and respond to complaints.
       - Notice/Info Assistant
       - FAQ Agent

      This backend is multi-functional, scalable.
      `,
    },
    servers: [
      { url: 'http://localhost:3000' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [], 
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
