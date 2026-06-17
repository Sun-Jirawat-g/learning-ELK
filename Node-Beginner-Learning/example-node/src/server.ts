import app from './app';
import { env } from './config/env';
import { connectDB, disconnectDB } from './config/db';

async function bootstrap(): Promise<void> {
  await connectDB();

  const server = app.listen(env.port, () => {
    console.log(`[server] running on http://localhost:${env.port}`);
    console.log(`[server] env: ${env.nodeEnv}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`[server] ${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  console.error('[server] failed to start', err);
  process.exit(1);
});
