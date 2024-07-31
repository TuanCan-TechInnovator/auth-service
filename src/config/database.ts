import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

export async function connectToDatabase() {
  try {
    await pool.getConnection();
    logger.info('Connected to MySQL database');
  } catch (error) {
    if (error instanceof Error && 'errors' in error) {
      logger.error('Failed to connect to MySQL database: AggregateError');
      for (const err of (error as any).errors) {
        logger.error((err as Error).message);
        logger.error((err as Error).stack);
      }
    } else if (error instanceof Error) {
      logger.error('Failed to connect to MySQL database:', error.message);
      logger.error(error.stack);
    } else {
      logger.error('Failed to connect to MySQL database:', error);
    }
    process.exit(1);
  }
}

export default pool;