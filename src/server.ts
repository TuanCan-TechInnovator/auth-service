import dotenv from 'dotenv';
import http from 'http';
import app from './app';
import logger from './config/logger';

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});

// Add error handler
server.on('error', (error) => {
    logger.error(`Server error: ${error.message}`);
    process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received. Closing server.');
    server.close(() => {
        logger.info('Server closed.');
        process.exit(0);
    });
});