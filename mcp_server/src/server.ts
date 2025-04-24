import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// --- In-memory store for user scores (replace with database later) ---
const userScores: { [username: string]: number } = {
  'lingao': 100,
  'alice': 95,
  'bob': 80,
};

// --- MCP Server Setup ---
const server = new McpServer({
  name: "user-score-service-stdio",
  version: "1.0.0",
  capabilities: {
    tools: {},
  },
});

// --- Define the getUserScore tool ---
const getUserScoreTool = server.tool(
  "getUserScore",
  {
    username: z.string().describe("The username to fetch the score for"),
  },
  async ({ username }) => {
    console.error(`Tool 'getUserScore' called for username: ${username}`);
    if (userScores.hasOwnProperty(username)) {
      const score = userScores[username];
      return {
        content: [{ type: "text", text: `Score for ${username}: ${score}` }],
      };
    } else {
      return {
        content: [{ type: "text", text: `Error: User '${username}' not found` }],
      };
    }
  }
);

getUserScoreTool.description = "Fetches the score for a given username.";

// --- Main Function to Setup and Run Server via Stdio ---
async function main() {
  console.error("Initializing MCP server with StdioTransport...");

  // Instantiate the Stdio transport
  const transport = new StdioServerTransport();

  try {
    // Connect the server to the transport
    // This typically starts listening on stdin/stdout immediately
    await server.connect(transport);
    console.error("MCP server connected via Stdio. Ready for requests.");
    // Keep the process alive (server runs until stdin is closed or process exits)

  } catch (error) {
    console.error("Failed to connect MCP server via Stdio:", error);
    process.exit(1); // Exit if connection fails
  }
}

// --- Run the server ---
main(); 