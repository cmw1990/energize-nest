require('dotenv').config();
const https = require('https');
const fs = require('fs');
const path = require('path');

// Supabase credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://zoubqdwxemivxrjruvam.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

console.log('Environment loaded:', {
  SUPABASE_URL: !!supabaseUrl,
  SERVICE_KEY_EXISTS: !!supabaseServiceKey
});

// Function to fetch schema from Supabase
function fetchSchema() {
  return new Promise((resolve, reject) => {
    const url = `${supabaseUrl}/rest/v1/?apikey=${supabaseServiceKey}`;
    console.log(`Fetching schema from: ${supabaseUrl}/rest/v1/`);
    
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`API responded with status code ${res.statusCode}`));
      }
      
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          reject(new Error(`Failed to parse JSON response: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

// Convert JSON schema types to TypeScript types
function jsonSchemaToTs(schema, tableName) {
  let result = '';
  
  // Handle columns
  for (const [columnName, columnInfo] of Object.entries(schema.properties || {})) {
    let tsType = 'unknown';
    
    switch (columnInfo.type) {
      case 'string':
        if (columnInfo.format === 'date-time') {
          tsType = 'string'; // Or could be Date
        } else {
          tsType = 'string';
        }
        break;
      case 'number':
        tsType = 'number';
        break;
      case 'integer':
        tsType = 'number';
        break;
      case 'boolean':
        tsType = 'boolean';
        break;
      case 'object':
        tsType = 'Record<string, unknown>'; // Generic object
        break;
      case 'array':
        tsType = 'any[]'; // Generic array
        break;
      default:
        tsType = 'unknown';
    }
    
    // Handle nullable
    if (schema.nullable && schema.nullable.includes(columnName)) {
      tsType += ' | null';
    }
    
    result += `      ${columnName}: ${tsType};\n`;
  }
  
  return result;
}

// Function to convert schema to TypeScript
async function generateTypes() {
  console.log('Starting TypeScript type generation...');
  
  try {
    const schema = await fetchSchema();
    console.log('Schema fetched successfully');
    
    // Generate Database interface
    let typesContent = `export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
`;

    // Extract Care Connector tables
    const careConnectorTables = Object.keys(schema.definitions)
      .filter(key => key.startsWith('care_'))
      .reduce((obj, key) => {
        obj[key] = schema.definitions[key];
        return obj;
      }, {});
    
    console.log(`Found ${Object.keys(careConnectorTables).length} Care Connector tables`);
    
    // Generate table types
    for (const [tableName, tableSchema] of Object.entries(careConnectorTables)) {
      typesContent += `      ${tableName}: {\n`;
      typesContent += `        Row: {\n`;
      typesContent += jsonSchemaToTs(tableSchema, tableName);
      typesContent += `        };\n`;
      typesContent += `        Insert: {\n`;
      typesContent += jsonSchemaToTs(tableSchema, tableName);
      typesContent += `        };\n`;
      typesContent += `        Update: {\n`;
      typesContent += jsonSchemaToTs(tableSchema, tableName);
      typesContent += `        };\n`;
      typesContent += `      };\n`;
    }
    
    // Close the interface
    typesContent += `    };\n`;
    typesContent += `    Views: {\n`;
    typesContent += `      [_ in never]: never;\n`;
    typesContent += `    };\n`;
    typesContent += `    Functions: {\n`;
    typesContent += `      create_care_group: {\n`;
    typesContent += `        Args: { p_name: string; p_description?: string; p_is_public?: boolean };\n`;
    typesContent += `        Returns: string;\n`;
    typesContent += `      };\n`;
    typesContent += `    };\n`;
    typesContent += `    Enums: {\n`;
    typesContent += `      [_ in never]: never;\n`;
    typesContent += `    };\n`;
    typesContent += `  };\n`;
    typesContent += `}\n`;
    
    // Write to file
    const outputPath = path.resolve(__dirname, './src/integrations/supabase/care-connector-types.ts');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, typesContent);
    
    console.log(`Types generated successfully and written to ${outputPath}`);
  } catch (error) {
    console.error('Error generating types:', error);
    process.exit(1);
  }
}

generateTypes(); 