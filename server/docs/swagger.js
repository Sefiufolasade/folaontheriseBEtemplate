const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FolaOnTheRise API',
      version: '1.0.0',
      description: 'Production-ready REST API for the FolaOnTheRise blog platform',
      contact: {
        name: 'FolaOnTheRise',
        url: 'https://folaontherise.com',
      },
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development server' },
      { url: 'https://api.folaontherise.com', description: 'Production server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token or Firebase ID token',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
            meta: { type: 'object' },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            fullName: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['admin', 'editor', 'author', 'subscriber'] },
            bio: { type: 'string' },
            avatar: { type: 'object', properties: { url: { type: 'string' } } },
            isVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Post: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            slug: { type: 'string' },
            excerpt: { type: 'string' },
            content: { type: 'string' },
            status: { type: 'string', enum: ['draft', 'published', 'archived', 'scheduled'] },
            author: { $ref: '#/components/schemas/User' },
            views: { type: 'integer' },
            likesCount: { type: 'integer' },
            commentsCount: { type: 'integer' },
            publishedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication & user session management' },
      { name: 'Posts', description: 'Blog post CRUD operations' },
      { name: 'Categories', description: 'Category management' },
      { name: 'Tags', description: 'Tag management' },
      { name: 'Comments', description: 'Comment system' },
      { name: 'Newsletter', description: 'Newsletter subscription management' },
      { name: 'Media', description: 'File upload & media library' },
      { name: 'Admin', description: 'Admin dashboard & analytics (admin only)' },
      { name: 'Users', description: 'User profile management' },
      { name: 'SEO', description: 'Sitemap and RSS feed' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

const swaggerSetup = (app) => {
  app.get('/api-docs.json', (req, res) => res.json(specs));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { background-color: #1a1a2e; }',
    customSiteTitle: 'FolaOnTheRise API Docs',
    swaggerOptions: { persistAuthorization: true },
  }));
};

module.exports = swaggerSetup;
