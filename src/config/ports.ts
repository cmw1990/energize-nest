// Port range allocated for Well-Charged project: 8001-8099
export const PORT_CONFIG = {
  // Main application ports
  WEBSITE_PREVIEW: 8001,
  MOBILE_PREVIEW: 8002,
  
  // API and service ports
  MAIN_SERVER: 8010,
  AUTH_SERVICE: 8011,
  WEBSOCKET_SERVICE: 8012,
  
  // Development tools
  VITE_HMR: 8020,
  STORYBOOK: 8021,
  TEST_SERVER: 8022,
  
  // Database and cache
  DATABASE_ADMIN: 8030,
  REDIS_ADMIN: 8031,
  
  // Monitoring and debugging
  DEBUG_PORT: 8040,
  METRICS_PORT: 8041,
} as const;

// Validate no port conflicts
const usedPorts = new Set<number>();
Object.values(PORT_CONFIG).forEach(port => {
  if (usedPorts.has(port)) {
    throw new Error(`Port conflict detected: ${port} is used multiple times`);
  }
  usedPorts.add(port);
});

// Validate ports are within allowed range
const MIN_PORT = 8001;
const MAX_PORT = 8099;

Object.entries(PORT_CONFIG).forEach(([service, port]) => {
  if (port < MIN_PORT || port > MAX_PORT) {
    throw new Error(
      `Port ${port} for ${service} is outside allowed range (${MIN_PORT}-${MAX_PORT})`
    );
  }
});

export const isPortAvailable = async (port: number): Promise<boolean> => {
  try {
    const net = await import('net');
    return new Promise((resolve) => {
      const server = net.createServer();
      server.once('error', () => resolve(false));
      server.once('listening', () => {
        server.close();
        resolve(true);
      });
      server.listen(port, '127.0.0.1');
    });
  } catch (error) {
    return false;
  }
};

// Get next available port in range
export const getNextAvailablePort = async (startPort: number = MIN_PORT): Promise<number> => {
  for (let port = startPort; port <= MAX_PORT; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available ports in range ${MIN_PORT}-${MAX_PORT}`);
};
