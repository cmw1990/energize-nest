#!/usr/bin/env node
import { execSync } from 'child_process';
import { PORT_CONFIG, isPortAvailable } from '../src/config/ports';

const checkPorts = async () => {
  console.log('Checking port availability for Well-Charged services...\n');
  
  const results: { service: string; port: number; status: string }[] = [];
  
  for (const [service, port] of Object.entries(PORT_CONFIG)) {
    try {
      const available = await isPortAvailable(port);
      
      if (!available) {
        // Try to get process using the port
        try {
          const command = process.platform === 'win32'
            ? `netstat -ano | findstr :${port}`
            : `lsof -i :${port}`;
          
          const output = execSync(command).toString();
          results.push({
            service,
            port,
            status: `🚫 In use: \n${output.split('\n')[0]}`
          });
        } catch {
          results.push({
            service,
            port,
            status: '🚫 In use (process unknown)'
          });
        }
      } else {
        results.push({
          service,
          port,
          status: '✅ Available'
        });
      }
    } catch (error) {
      results.push({
        service,
        port,
        status: `❌ Error: ${error.message}`
      });
    }
  }
  
  // Print results in a table
  console.table(
    results.map(({ service, port, status }) => ({
      Service: service,
      Port: port,
      Status: status
    }))
  );
  
  // Check if any ports are in use
  const portsInUse = results.filter(r => r.status.includes('🚫'));
  
  if (portsInUse.length > 0) {
    console.log('\n⚠️  Some ports are already in use. To fix this:');
    console.log('1. Stop the conflicting services');
    console.log('2. Update ports.ts with different port numbers');
    console.log('3. Run this check again\n');
    process.exit(1);
  } else {
    console.log('\n✅ All ports are available!\n');
  }
};

checkPorts().catch(console.error);
