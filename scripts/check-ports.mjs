import { createServer } from 'net';

const ports = [8001, 8002];

const checkPort = (port) => {
  return new Promise((resolve) => {
    const server = createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
        process.exit(1);
      }
      resolve(false);
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    
    server.listen(port);
  });
};

Promise.all(ports.map(checkPort))
  .then(() => {
    console.log('All ports are available');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error checking ports:', err);
    process.exit(1);
  });
