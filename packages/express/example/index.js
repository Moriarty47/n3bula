import { createApp } from '@n3bula/express';

const PORT = 3000;

async function startServer() {
  const app = await createApp();
  const server = await app.listen(PORT, usedPort => {
    console.log(`Server is running on \x1B[92mhttp://localhost:${usedPort}\x1B[m`);
  });
  return server;
}

startServer();