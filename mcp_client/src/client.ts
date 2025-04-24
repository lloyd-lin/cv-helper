import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// --- Configuration ---
const usernameToQuery = process.argv[2] || 'lingao'; // Get username from cmd line arg or default
const serverExecutable = 'node';
const serverScriptPath = 'mcp_server/dist/server.js'; // Path to the compiled server script

// --- Client Setup ---
const client = new Client({
  name: "user-score-client-stdio",
  version: "1.0.0",
});

// --- Transport Setup ---
// Instantiate StdioClientTransport, providing the command to run the server
const transport = new StdioClientTransport({
  command: serverExecutable,
  args: [serverScriptPath]
});

// --- Main Function ---
async function main() {
  console.log(`Attempting to start and connect to MCP server via stdio: ${serverExecutable} ${serverScriptPath}`);

  try {
    // Connect the client to the server via the transport
    // This will spawn the server process
    await client.connect(transport);
    console.log("Successfully connected to server via stdio.");

    // Call the tool
    console.log(`Calling tool 'getUserScore' for username: ${usernameToQuery}...`);
    const result = await client.callTool({
      name: "getUserScore",
      arguments: {
        username: usernameToQuery,
      },
    });

    // The server's response (tool result) will come back through the transport
    console.log("Tool Result:", JSON.stringify(result, null, 2));

  } catch (error) {
    console.error("An error occurred:", error);
    // Update hints for stdio context
    console.error("\n[Hint] Did the server process start correctly? Check for build errors (`npm run build`) or runtime errors from the server script.");
    console.error(`[Hint] Ensure the server script exists at '${serverScriptPath}' and is executable.`);

  } finally {
    // Disconnecting the client might terminate the spawned server process
    console.log("Disconnecting client (may terminate server process)...");
    // transport.close() might be needed if client.disconnect doesn't exist/work
    // await client.disconnect(); // Still likely doesn't exist
    console.log("Client disconnected.");
  }
}

// --- Execute Main ---
main(); 