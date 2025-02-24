import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors({
  origin: 'http://localhost:8001',
  credentials: true
}));
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  'https://zoubqdwxemivxrjruvam.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdWJxZHd4ZW1pdnhyanJ1dmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MjAxOTcsImV4cCI6MjA1Mzk5NjE5N30.tq2ssOiA8CbFUZc6HXWXMEev1dODzKZxzNrpvyzbbXs'
);

// Create HTTP server
const server = createServer(app);

// Create WebSocket server attached to the HTTP server
const wss = new WebSocketServer({ 
  server,
  path: '/ws'
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      switch (data.type) {
        case 'SAVE_DIAGRAM':
          const { error } = await supabase
            .from('diagrams')
            .upsert({ 
              id: data.payload.id,
              nodes: data.payload.nodes,
              edges: data.payload.edges,
              updated_at: new Date().toISOString()
            });
          
          if (error) {
            ws.send(JSON.stringify({ type: 'ERROR', payload: error.message }));
          } else {
            ws.send(JSON.stringify({ type: 'DIAGRAM_SAVED', payload: data.payload }));
          }
          break;

        case 'LOAD_DIAGRAM':
          const { data: diagram, error: loadError } = await supabase
            .from('diagrams')
            .select('*')
            .eq('id', data.payload.id)
            .single();
          
          if (loadError) {
            ws.send(JSON.stringify({ type: 'ERROR', payload: loadError.message }));
          } else {
            ws.send(JSON.stringify({ type: 'DIAGRAM_LOADED', payload: diagram }));
          }
          break;

        default:
          ws.send(JSON.stringify({ type: 'ERROR', payload: 'Unknown message type' }));
      }
    } catch (error) {
      ws.send(JSON.stringify({ type: 'ERROR', payload: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// HTTP routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
const PORT = 8003;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
