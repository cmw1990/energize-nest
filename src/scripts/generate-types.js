require('dotenv').config();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Get Supabase URL and key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  process.exit(1);
}

console.log('Generating types from Supabase schema...');

// Helper function to convert JSON Schema types to TypeScript types
function getTypeScriptType(propDef) {
  if (!propDef) return 'any';
  
  if (propDef.type === 'string') {
    return 'string';
  } else if (propDef.type === 'integer' || propDef.type === 'number') {
    return 'number';
  } else if (propDef.type === 'boolean') {
    return 'boolean';
  } else if (propDef.type === 'array') {
    const itemType = getTypeScriptType(propDef.items);
    return `${itemType}[]`;
  } else if (propDef.type === 'object' || propDef.$ref) {
    return 'Json';
  } else if (propDef.type === 'null') {
    return 'null';
  } else if (Array.isArray(propDef.type)) {
    if (propDef.type.includes('null')) {
      const nonNullTypes = propDef.type.filter(t => t !== 'null');
      if (nonNullTypes.length === 1) {
        return `${getTypeScriptType({ type: nonNullTypes[0] })} | null`;
      }
    }
    return propDef.type.map(t => getTypeScriptType({ type: t })).join(' | ');
  }
  
  return 'any';
}

// Function to fetch schema from Supabase
function fetchSchema() {
  return new Promise((resolve, reject) => {
    const schemaUrl = `${supabaseUrl}/rest/v1/?apikey=${supabaseServiceRoleKey}`;
    
    https.get(schemaUrl, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const schema = JSON.parse(data);
          resolve(schema);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Main function to generate types
async function generateTypes() {
  try {
    // Path for the generated types
    const typesOutputPath = path.resolve(__dirname, '../integrations/supabase/types.ts');
    const careConnectorTypesPath = path.resolve(__dirname, '../integrations/supabase/care-connector-types.ts');
    
    // Use https to fetch the schema directly
    console.log('Fetching schema from Supabase...');
    
    // Wait for the schema to be fetched
    const schema = await fetchSchema();
    
    console.log('Creating TypeScript types from schema...');
    
    // Generate a basic Database type
    let typesContent = `// Auto-generated types for Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
`;

    // Add table definitions
    for (const [tableName, tableDefinition] of Object.entries(schema.definitions || {})) {
      if (tableName.startsWith('public_')) {
        const actualTableName = tableName.replace('public_', '');
        
        typesContent += `      ${actualTableName}: {\n`;
        typesContent += `        Row: {\n`;
        
        // Add row properties
        for (const [propName, propDef] of Object.entries(tableDefinition.properties || {})) {
          const type = getTypeScriptType(propDef);
          typesContent += `          ${propName}: ${type}\n`;
        }
        
        typesContent += `        }\n`;
        typesContent += `        Insert: {\n`;
        
        // Add insert properties (same as row but with optional fields)
        for (const [propName, propDef] of Object.entries(tableDefinition.properties || {})) {
          const type = getTypeScriptType(propDef);
          const isRequired = (tableDefinition.required || []).includes(propName);
          typesContent += `          ${propName}${isRequired ? '' : '?'}: ${type}\n`;
        }
        
        typesContent += `        }\n`;
        typesContent += `        Update: {\n`;
        
        // Add update properties (all optional)
        for (const [propName, propDef] of Object.entries(tableDefinition.properties || {})) {
          const type = getTypeScriptType(propDef);
          typesContent += `          ${propName}?: ${type}\n`;
        }
        
        typesContent += `        }\n`;
        typesContent += `        Relationships: []\n`;
        typesContent += `      }\n`;
      }
    }
    
    // Close the type definition
    typesContent += `    }\n`;
    typesContent += `    Views: {}\n`;
    typesContent += `    Functions: {}\n`;
    typesContent += `    Enums: {}\n`;
    typesContent += `    CompositeTypes: {}\n`;
    typesContent += `  }\n`;
    typesContent += `}\n`;
    
    // Write the types to the output file
    fs.writeFileSync(typesOutputPath, typesContent);
    console.log(`Types generated successfully at ${typesOutputPath}`);
    
    // Extract Care Connector types from the main types file
    console.log('Extracting Care Connector types...');
    
    // Extract only the Care Connector related types
    const careConnectorTypesContent = `// Auto-generated types for Care Connector
import { Database } from './types';

export type CareConnectorTables = Pick<
  Database['public']['Tables'], 
  | 'care_groups'
  | 'care_group_members'
  | 'care_group_invitations'
  | 'care_tasks'
  | 'care_health_records'
  | 'care_providers'
  | 'care_provider_reviews'
  | 'care_activity_log'
>;

export type CareGroup = Database['public']['Tables']['care_groups']['Row'];
export type CareGroupInsert = Database['public']['Tables']['care_groups']['Insert'];
export type CareGroupUpdate = Database['public']['Tables']['care_groups']['Update'];

export type CareGroupMember = Database['public']['Tables']['care_group_members']['Row'];
export type CareGroupMemberInsert = Database['public']['Tables']['care_group_members']['Insert'];
export type CareGroupMemberUpdate = Database['public']['Tables']['care_group_members']['Update'];

export type CareGroupInvitation = Database['public']['Tables']['care_group_invitations']['Row'];
export type CareGroupInvitationInsert = Database['public']['Tables']['care_group_invitations']['Insert'];
export type CareGroupInvitationUpdate = Database['public']['Tables']['care_group_invitations']['Update'];

export type CareTask = Database['public']['Tables']['care_tasks']['Row'];
export type CareTaskInsert = Database['public']['Tables']['care_tasks']['Insert'];
export type CareTaskUpdate = Database['public']['Tables']['care_tasks']['Update'];

export type CareHealthRecord = Database['public']['Tables']['care_health_records']['Row'];
export type CareHealthRecordInsert = Database['public']['Tables']['care_health_records']['Insert'];
export type CareHealthRecordUpdate = Database['public']['Tables']['care_health_records']['Update'];

export type CareProvider = Database['public']['Tables']['care_providers']['Row'];
export type CareProviderInsert = Database['public']['Tables']['care_providers']['Insert'];
export type CareProviderUpdate = Database['public']['Tables']['care_providers']['Update'];

export type CareProviderReview = Database['public']['Tables']['care_provider_reviews']['Row'];
export type CareProviderReviewInsert = Database['public']['Tables']['care_provider_reviews']['Insert'];
export type CareProviderReviewUpdate = Database['public']['Tables']['care_provider_reviews']['Update'];

export type CareActivityLog = Database['public']['Tables']['care_activity_log']['Row'];
export type CareActivityLogInsert = Database['public']['Tables']['care_activity_log']['Insert'];
export type CareActivityLogUpdate = Database['public']['Tables']['care_activity_log']['Update'];
`;

    fs.writeFileSync(careConnectorTypesPath, careConnectorTypesContent);
    console.log(`Care Connector types extracted to ${careConnectorTypesPath}`);

    console.log('Type generation completed successfully!');
  } catch (error) {
    console.error('Error generating types:', error);
    process.exit(1);
  }
}

// Run the async function
generateTypes(); 