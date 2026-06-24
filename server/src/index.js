import dns from 'dns';
// Use Google public DNS — fixes routers that cannot resolve SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

import config from './config.js';
import { createApp } from './app.js';
import { connectDB } from './db.js';

async function main() {
  try {
    await connectDB();
  } catch (err) {
    console.error('[startup] Failed to connect to MongoDB:', err.message);
    console.error('[startup] The server will start anyway so you can debug.');
  }

  const app = createApp();
  const server = app.listen(config.port, () => {
    console.log(`[server] running on http://localhost:${config.port} (${config.nodeEnv})`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    console.log(`\n[server] ${signal} received, shutting down...`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main();
