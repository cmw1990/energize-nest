#!/usr/bin/env node
import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

// Global port configuration file location
const PORT_CONFIG_PATH = join(homedir(), '.project-ports.json');

interface ProjectPorts {
  [projectName: string]: {
    portRange: {
      start: number;
      end: number;
    };
    ports: {
      [serviceName: string]: number;
    };
  };
}

// Default port ranges for different projects
const DEFAULT_PORT_RANGES = {
  'well-charged': { start: 8001, end: 8099 },
  'project-2': { start: 8101, end: 8199 },
  'project-3': { start: 8201, end: 8299 },
  'project-4': { start: 8301, end: 8399 },
  'project-5': { start: 8401, end: 8499 },
};

// Initialize or load global port configuration
function initializePortConfig(): ProjectPorts {
  if (existsSync(PORT_CONFIG_PATH)) {
    return JSON.parse(readFileSync(PORT_CONFIG_PATH, 'utf8'));
  }

  const config: ProjectPorts = {
    'well-charged': {
      portRange: DEFAULT_PORT_RANGES['well-charged'],
      ports: {
        WEBSITE_PREVIEW: 8001,
        MOBILE_PREVIEW: 8002,
        MAIN_SERVER: 8010,
        AUTH_SERVICE: 8011,
        WEBSOCKET_SERVICE: 8012,
        VITE_HMR: 8020,
        STORYBOOK: 8021,
        TEST_SERVER: 8022,
        DATABASE_ADMIN: 8030,
        REDIS_ADMIN: 8031,
        DEBUG_PORT: 8040,
        METRICS_PORT: 8041,
      },
    },
  };

  writeFileSync(PORT_CONFIG_PATH, JSON.stringify(config, null, 2));
  return config;
}

// Check if a port is available
async function isPortAvailable(port: number): Promise<boolean> {
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
}

// Get process using a port
function getProcessUsingPort(port: number): string {
  try {
    const command = process.platform === 'win32'
      ? `netstat -ano | findstr :${port}`
      : `lsof -i :${port}`;
    return execSync(command).toString().split('\n')[0];
  } catch {
    return 'Process unknown';
  }
}

// Register a new project
async function registerProject(
  projectName: string,
  services: string[],
  customPortRange?: { start: number; end: number }
): Promise<void> {
  const config = initializePortConfig();
  
  // Use custom port range or find next available range
  const portRange = customPortRange || DEFAULT_PORT_RANGES[projectName] || {
    start: Math.max(...Object.values(config).map(p => p.portRange.end)) + 1,
    end: Math.max(...Object.values(config).map(p => p.portRange.end)) + 99,
  };

  // Validate port range doesn't overlap with existing projects
  for (const [name, project] of Object.entries(config)) {
    if (name === projectName) continue;
    
    if (
      (portRange.start >= project.portRange.start && portRange.start <= project.portRange.end) ||
      (portRange.end >= project.portRange.start && portRange.end <= project.portRange.end)
    ) {
      throw new Error(`Port range overlaps with project ${name}`);
    }
  }

  // Assign ports to services
  const ports: { [key: string]: number } = {};
  let nextPort = portRange.start;

  for (const service of services) {
    while (nextPort <= portRange.end) {
      if (await isPortAvailable(nextPort)) {
        ports[service] = nextPort;
        nextPort++;
        break;
      }
      nextPort++;
    }
    if (!ports[service]) {
      throw new Error(`No available ports for service ${service}`);
    }
  }

  config[projectName] = { portRange, ports };
  writeFileSync(PORT_CONFIG_PATH, JSON.stringify(config, null, 2));
}

// Check ports for a specific project
async function checkProjectPorts(projectName: string): Promise<void> {
  const config = initializePortConfig();
  const project = config[projectName];

  if (!project) {
    throw new Error(`Project ${projectName} not found in configuration`);
  }

  console.log(`\nChecking ports for project: ${projectName}`);
  console.log(`Port range: ${project.portRange.start}-${project.portRange.end}\n`);

  const results: { service: string; port: number; status: string }[] = [];

  for (const [service, port] of Object.entries(project.ports)) {
    const available = await isPortAvailable(port);
    results.push({
      service,
      port,
      status: available ? '✅ Available' : `🚫 In use: ${getProcessUsingPort(port)}`,
    });
  }

  console.table(
    results.map(({ service, port, status }) => ({
      Service: service,
      Port: port,
      Status: status,
    }))
  );

  const portsInUse = results.filter(r => r.status.includes('🚫'));
  if (portsInUse.length > 0) {
    console.log('\n⚠️  Some ports are in use. To fix:');
    console.log('1. Stop the conflicting services');
    console.log('2. Update port configuration');
    console.log('3. Run this check again\n');
    process.exit(1);
  } else {
    console.log('\n✅ All ports are available!\n');
  }
}

// List all projects and their port configurations
function listProjects(): void {
  const config = initializePortConfig();
  console.log('\nProject Port Configurations:\n');
  
  for (const [projectName, project] of Object.entries(config)) {
    console.log(`\n${projectName.toUpperCase()}`);
    console.log('='.repeat(projectName.length));
    console.log(`Port Range: ${project.portRange.start}-${project.portRange.end}`);
    console.log('\nServices:');
    for (const [service, port] of Object.entries(project.ports)) {
      console.log(`  ${service}: ${port}`);
    }
  }
}

// Command line interface
async function main() {
  const command = process.argv[2];
  const projectName = process.argv[3];

  switch (command) {
    case 'register':
      const services = process.argv.slice(4);
      await registerProject(projectName, services);
      console.log(`\n✅ Project ${projectName} registered successfully!\n`);
      break;

    case 'check':
      await checkProjectPorts(projectName);
      break;

    case 'list':
      listProjects();
      break;

    default:
      console.log('\nUsage:');
      console.log('  register <project-name> <service1> <service2> ...');
      console.log('  check <project-name>');
      console.log('  list\n');
      break;
  }
}

main().catch(console.error);
