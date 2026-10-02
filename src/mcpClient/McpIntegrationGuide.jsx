import React from "react";
import {
  COLORS,
  Section,
  Card,
  Table,
  Code,
  Bullets,
  Steps,
} from "./MCPTab.jsx";

const APP = "AskAway";

export function McpIntegrationGuide() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>

      {/* 1. OVERVIEW */}
      <Section
        n={1}
        title={`Overview — Integrating MCP in ${APP}`}
        kicker="The Model Context Protocol (MCP) is an open standard that standardizes how generative AI applications connect to external data sources, tools, and systems."
      >
        <Card title="USB-C FOR AI">
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: COLORS.muted }}>
            Think of MCP as the "USB-C for AI" — a universal, secure, standardized way for the LLMs powering <b style={{ color: COLORS.text }}>{APP}</b> to interact with your enterprise ecosystem without custom, point-to-point API integrations for every new tool. By adopting MCP, {APP} can dynamically fetch real-time context, execute complex workflows, and interact with your existing infrastructure (databases, SaaS apps, file systems) securely and efficiently.
          </p>
        </Card>
      </Section>

      {/* 2. WHY MCP */}
      <Section
        n={2}
        title="Why MCP? (Key Benefits)"
        kicker="Four reasons protocol-level integration beats hand-written connectors."
      >
        <Card title="KEY BENEFITS" accent={COLORS.emerald}>
          <Bullets accent={COLORS.emerald} items={[
            <><b style={{ color: COLORS.text }}>Eliminate Integration Fragmentation:</b> Stop building custom connectors for every new tool. Use standardized MCP servers to plug in new data sources in minutes.</>,
            <><b style={{ color: COLORS.text }}>Dynamic Context Retrieval:</b> Allow the AI to fetch only the exact data it needs, when it needs it, optimizing token usage and reducing hallucinations.</>,
            <><b style={{ color: COLORS.text }}>Actionable AI:</b> Move beyond read-only chat. MCP enables the AI to safely execute tools (e.g., creating a Jira ticket, updating a CRM record, running a SQL query).</>,
            <><b style={{ color: COLORS.text }}>Enterprise-Grade Security:</b> Centralize access control, audit logging, and data governance at the protocol level rather than inside individual LLM prompts.</>,
          ]} />
        </Card>
      </Section>

      {/* 3. ARCHITECTURE */}
      <Section
        n={3}
        title={`MCP Architecture in ${APP}`}
        kicker="Three core components, three primitives."
      >
        <Card title="THE THREE CORE COMPONENTS" accent={COLORS.sky}>
          <Steps items={[
            <><b style={{ color: COLORS.text }}>The MCP Host ({APP}):</b> The AI application itself. It orchestrates the user experience, manages the LLM, and acts as the central hub for context.</>,
            <><b style={{ color: COLORS.text }}>The MCP Client:</b> A lightweight component embedded <i>inside</i> {APP} that maintains a 1-to-1 connection with MCP servers. It handles the protocol translation and security handshakes.</>,
            <><b style={{ color: COLORS.text }}>The MCP Servers:</b> Standalone, lightweight services that expose specific capabilities to the AI. They can be hosted locally, in the cloud, or managed by third-party vendors.</>,
          ]} />
        </Card>

        <Card title="THE CORE PRIMITIVES" accent={COLORS.violet}>
          <Bullets accent={COLORS.violet} items={[
            <><b style={{ color: COLORS.text }}>Resources (Data):</b> Read-only context. Examples: database records, Confluence pages, local file systems, or real-time telemetry data.</>,
            <><b style={{ color: COLORS.text }}>Tools (Actions):</b> Executable functions. Examples: sending an email, creating a GitHub issue, or triggering a CI/CD pipeline.</>,
            <><b style={{ color: COLORS.text }}>Prompts (Templates):</b> Pre-defined, user-controlled interaction templates that help guide the LLM on how to use specific tools or resources effectively.</>,
          ]} />
        </Card>
      </Section>

      {/* 4. DEVELOPER INTEGRATION GUIDE */}
      <Section
        n={4}
        title="Developer Integration Guide"
        kicker={`Follow these steps to integrate MCP capabilities into ${APP}.`}
      >
        <Card title="STEP 1 — INSTALL THE MCP SDK" accent={COLORS.amber}>
          <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.7, color: COLORS.muted }}>
            We use the official MCP SDK to handle client-server communication. Choose your language:
          </p>
          <Code label="INSTALL" lang="bash">{`# For TypeScript/Node.js environments
npm install @modelcontextprotocol/sdk

# For Python environments
pip install mcp`}</Code>
        </Card>

        <Card title="STEP 2 — CONFIGURE THE MCP CLIENT" accent={COLORS.amber}>
          <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.7, color: COLORS.muted }}>
            Initialize the MCP client within the {APP} backend to manage connections to your MCP servers.
          </p>
          <Code label="client.ts" lang="typescript">{`import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// Example: Connecting to a local PostgreSQL MCP Server
const transport = new StdioClientTransport({
  command: "npx",
  args: ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
});

const client = new Client({ name: "AskAway-Client", version: "1.0.0" });
await client.connect(transport);`}</Code>
        </Card>

        <Card title="STEP 3 — DISCOVER AND BIND CAPABILITIES" accent={COLORS.amber}>
          <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.7, color: COLORS.muted }}>
            Allow the LLM to discover available tools and resources dynamically.
          </p>
          <Code label="discover.ts" lang="typescript">{`// List available tools from the connected server
const { tools } = await client.listTools();

// Format tools for the LLM's function-calling schema
const llmTools = tools.map(tool => ({
  type: "function",
  function: {
    name: tool.name,
    description: tool.description,
    parameters: tool.inputSchema
  }
}));`}</Code>
        </Card>

        <Card title="STEP 4 — EXECUTE TOOL CALLS" accent={COLORS.amber}>
          <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.7, color: COLORS.muted }}>
            When the LLM decides to use a tool, route the execution back through the MCP client.
          </p>
          <Code label="execute.ts" lang="typescript">{`// Execute a tool call requested by the LLM
const result = await client.callTool({
  name: "query_database",
  arguments: { sql: "SELECT * FROM users WHERE active = true LIMIT 5;" }
});

// Feed the result back into the LLM context`}</Code>
        </Card>
      </Section>

      {/* 5. SECURITY & GOVERNANCE */}
      <Section
        n={5}
        title="Security & Governance"
        kicker={`Because MCP allows AI to interact with sensitive enterprise systems, strict governance is enforced at the protocol level in ${APP}.`}
      >
        <Card title="PROTOCOL-LEVEL CONTROLS" accent={COLORS.rose}>
          <Bullets accent={COLORS.rose} items={[
            <><b style={{ color: COLORS.text }}>Authentication & Authorization:</b> All MCP servers must authenticate via OAuth 2.0 or API keys. The MCP client enforces Role-Based Access Control (RBAC), ensuring the AI can only invoke tools the <i>current user</i> has permission to access.</>,
            <><b style={{ color: COLORS.text }}>Data Privacy & PII:</b> Context injected via MCP Resources is evaluated against our data-loss-prevention (DLP) policies before being sent to the LLM.</>,
            <><b style={{ color: COLORS.text }}>Human-in-the-Loop (HITL):</b> For high-risk MCP tools (e.g., financial transactions, deleting records), {APP} requires explicit user approval before the MCP server executes the action.</>,
            <><b style={{ color: COLORS.text }}>Audit Logging:</b> Every MCP request, context retrieval, and tool execution is logged to our centralized SIEM for compliance and debugging.</>,
          ]} />
        </Card>
      </Section>

      {/* 6. USE CASES */}
      <Section
        n={6}
        title={`Example Use Cases in ${APP}`}
        kicker="Two end-to-end scenarios that show resources and tools working together."
      >
        <Card title="USE CASE A — INTELLIGENT CUSTOMER SUPPORT" accent={COLORS.sky}>
          <Bullets accent={COLORS.sky} items={[
            <><b style={{ color: COLORS.text }}>MCP Server 1 (Zendesk):</b> Exposes <i>Resources</i> (past ticket history) and <i>Tools</i> (update ticket status).</>,
            <><b style={{ color: COLORS.text }}>MCP Server 2 (Stripe):</b> Exposes <i>Resources</i> (billing status, subscription tier).</>,
            <><b style={{ color: COLORS.text }}>Result:</b> The AI can instantly answer "Why was my last charge declined?" by reading Stripe data, and then use the Zendesk tool to open a follow-up support ticket, all within one chat session.</>,
          ]} />
        </Card>

        <Card title="USE CASE B — AUTOMATED DEVOPS ASSISTANT" accent={COLORS.violet}>
          <Bullets accent={COLORS.violet} items={[
            <><b style={{ color: COLORS.text }}>MCP Server (GitHub):</b> Exposes <i>Tools</i> to read PRs, run CI checks, and merge code.</>,
            <><b style={{ color: COLORS.text }}>MCP Server (Datadog):</b> Exposes <i>Resources</i> for real-time error logs and metrics.</>,
            <><b style={{ color: COLORS.text }}>Result:</b> A developer can ask, "Why is the staging build failing?" The AI reads the Datadog logs, identifies the broken test, reads the corresponding GitHub PR, and suggests a code fix.</>,
          ]} />
        </Card>
      </Section>

      {/* 7. BEST PRACTICES & TROUBLESHOOTING */}
      <Section
        n={7}
        title="Best Practices & Troubleshooting"
        kicker="Design servers small, describe tools well, and expect slow external calls."
      >
        <Card title="BEST PRACTICES" accent={COLORS.emerald}>
          <Steps items={[
            <><b style={{ color: COLORS.text }}>Keep Servers Focused:</b> Follow the microservices philosophy. Build one MCP server for your CRM, another for your Database, rather than one massive "monolith" server.</>,
            <><b style={{ color: COLORS.text }}>Descriptive Naming:</b> LLMs rely on tool names and descriptions to know <i>when</i> to use them. Ensure your MCP tool descriptions are highly detailed and include edge cases.</>,
            <><b style={{ color: COLORS.text }}>Handle Timeouts Gracefully:</b> External API calls via MCP can be slow. Implement streaming responses in {APP} so the user knows the AI is "thinking" or "fetching data" while waiting for the MCP server to respond.</>,
          ]} />
        </Card>

        <Card title="TROUBLESHOOTING" accent={COLORS.rose}>
          <Table
            head={["Issue", "Fix"]}
            widths={["38%", "62%"]}
            rows={[
              ["LLM is not using the MCP tool", "Check the tool description in the MCP server. Is it clear what the tool does? Ensure the tool's inputSchema matches exactly what the LLM is expected to output."],
              ["Context window overflow", "The MCP server is returning too much data. Update the server's logic to paginate results or summarize large text files before exposing them as a Resource."],
              ["Connection dropped", "If using HTTP/SSE transports, ensure your load balancers and reverse proxies are configured to support long-lived, streaming connections."],
            ]}
          />
        </Card>
      </Section>

      {/* 8. NEXT STEPS */}
      <Section
        n={8}
        title="Next Steps for the Development Team"
        kicker="Audit, ship one internal server, then follow the spec."
      >
        <Card title="ACTION LIST" accent={COLORS.amber}>
          <Steps items={[
            <><b style={{ color: COLORS.text }}>Audit Current Integrations:</b> Identify which custom API connectors in {APP} can be refactored into standardized MCP servers.</>,
            <><b style={{ color: COLORS.text }}>Deploy Internal MCP Servers:</b> Start by building an internal MCP server for our most-used internal tool (e.g., internal wiki or proprietary database).</>,
            <><b style={{ color: COLORS.text }}>Join the Community:</b> Review the <a href="https://modelcontextprotocol.io" target="_blank" rel="noreferrer" style={{ color: "var(--ds-color-text-link)" }}>Official MCP Specification</a> and participate in the open-source community to stay updated on new transport protocols and security standards.</>,
          ]} />
        </Card>

        <div style={{ fontSize: 12, lineHeight: 1.7, color: COLORS.muted, borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }}>
          For technical support regarding MCP integration, reach out to the <b style={{ color: COLORS.text }}>{APP} AI Platform Team</b> on Slack at{" "}
          <span style={{ fontFamily: "var(--ds-font-family-mono)", color: COLORS.amber }}>#ai-mcp-integrations</span>.
        </div>
      </Section>

    </div>
  );
}

export default McpIntegrationGuide;
