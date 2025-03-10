const { execSync } = require('child_process');
const path = require('path');

// Get app to deploy from command line
const app = process.argv[2];
if (!app) {
  console.error('Please specify an app to deploy: npm run deploy mood|fresh');
  process.exit(1);
}

// Map app names to directory names
const appMap = {
  mood: 'easier-mood',
  fresh: 'mission-fresh'
};

// Map app names to domains
const domainMap = {
  mood: 'mood.yourbrand.com',
  fresh: 'fresh.yourbrand.com'
};

const appDir = appMap[app];
if (!appDir) {
  console.error(`Unknown app: ${app}. Use one of: mood, fresh`);
  process.exit(1);
}

const domain = domainMap[app];

console.log(`Building ${appDir} for deployment to ${domain}...`);

// Build the app
try {
  execSync(`yarn workspace ${appDir} build`, { stdio: 'inherit' });
  
  // Here you would add your deployment command, e.g.:
  // execSync(`netlify deploy --dir=apps/${appDir}/dist --site=${domain} --prod`, { stdio: 'inherit' });
  
  console.log(`✅ Successfully built ${appDir}. Ready for deployment to ${domain}`);
} catch (error) {
  console.error(`❌ Failed to build ${appDir}:`, error.message);
  process.exit(1);
} 