# AI Coding Agent System Architecture

## Overview

This project implements an **AI-powered coding agent** capable of generating and modifying a Next.js application dynamically based on user prompts.

The system integrates several components:

* **Next.js App Router** → Frontend + API routes
* **tRPC** → Typesafe client-server communication
* **Inngest** → Event-driven workflow orchestration
* **AgentKit** → AI agent logic
* **OpenAI GPT-4.1** → Reasoning engine
* **E2B Sandbox** → Secure code execution environment
* **Docker Template** → Containerized Next.js environment

The AI **does not run inside Docker**, but it **controls the Docker sandbox through tools**.

---

# High-Level System Flow

User Prompt
↓
React UI
↓
tRPC Mutation
↓
Next.js Server
↓
Inngest Event
↓
Inngest Workflow Function
↓
Sandbox Creation (E2B / Docker)
↓
Agent Network Execution
↓
LLM Reasoning
↓
Tool Execution
↓
Docker Container (Next.js App)
↓
Preview URL Returned to Frontend

---

# Detailed Execution Flow

## Step 1 — User submits prompt

User enters:

```
create a landing page
```

The frontend calls a **tRPC mutation**.

Example:

```ts
trpc.generateApp.mutate({
  prompt: "create a landing page"
});
```

---

# Step 2 — tRPC request reaches the server

The tRPC router receives the request.

Example:

```ts
generateApp: publicProcedure
  .input(z.object({ prompt: z.string() }))
  .mutation(async ({ input }) => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        value: input.prompt
      }
    });
  })
```

tRPC does two important things:

1. validates the input
2. forwards the request to the Inngest event system

---

# Step 3 — Inngest event is published

The server sends the event:

```
test/hello.world
```

Payload:

```
{
  value: "create a landing page"
}
```

The **Inngest dev server** receives this event.

Command running locally:

```
npx inngest dev -u http://localhost:3000/api/inngest
```

---

# Step 4 — Inngest identifies the matching workflow

The event matches this function:

```ts
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
```

Inngest begins executing the workflow.

---

# Step 5 — Workflow execution begins

The handler receives:

```
event.data.value = "create a landing page"
```

Execution context also contains:

```
step
event
run metadata
```

---

# Step 6 — Sandbox creation

The first step executes:

```ts
const sandbox = await Sandbox.create("my-app-02");
```

This triggers the **E2B API**.

E2B performs the following:

1. Locates template **my-app-02**
2. Starts container
3. Initializes filesystem
4. Starts internal services
5. Returns sandbox ID

Internally this is similar to:

```
docker run my-app-02
```

The sandbox now contains:

```
Next.js project
Node runtime
dependencies
filesystem
```

---

# Step 7 — Sandbox ID is stored

Example returned value:

```
sandboxId = sbx_92af3
```

This ID is used to communicate with the container.

---

# Step 8 — AI agent is initialized

The coding agent is created using AgentKit.

```ts
const codeAgent = createAgent(...)
```

Agent configuration includes:

```
LLM model
system prompt
tools
lifecycle hooks
```

System prompt defines behavior:

```
You are an expert Next.js developer.
```

---

# Step 9 — Agent network is initialized

A network loop is created:

```ts
const network = createNetwork(...)
```

Configuration:

```
agents = [codeAgent]
maxIter = 15
router = decision logic
```

This network allows **multi-step autonomous reasoning**.

---

# Step 10 — Network execution begins

The workflow runs:

```
network.run("create a landing page")
```

The prompt is sent to the LLM.

---

# Step 11 — LLM reasoning

The LLM receives:

```
system prompt
user prompt
tool definitions
current state
```

The model decides actions.

Example internal reasoning:

```
Goal: create landing page

Steps:
1. inspect project structure
2. create hero section
3. update app/page.tsx
```

---

# Step 12 — Tool selection

The LLM chooses a tool.

Example:

```
readFiles(["app/page.tsx"])
```

---

# Step 13 — Tool handler executes

The tool handler runs on the **Node.js server**.

Example handler:

```
sandbox.files.read(path)
```

E2B then retrieves the file from the container filesystem.

---

# Step 14 — File contents returned

Example response:

```
export default function Page() { ... }
```

This is returned to the LLM.

---

# Step 15 — LLM generates new code

The model generates updated code.

Example:

```
Hero component
CTA section
Features section
Footer
```

---

# Step 16 — File creation tool is called

Tool call:

```
createOrUpdateFiles
```

Payload:

```
app/page.tsx
components/Hero.tsx
```

---

# Step 17 — Files written to sandbox

Handler runs:

```
sandbox.files.write(path, content)
```

These files are written inside the Docker container filesystem.

---

# Step 18 — Terminal commands may run

If needed the AI executes terminal commands.

Example tool call:

```
terminal("npm install")
```

Handler executes:

```
sandbox.commands.run("npm install")
```

Inside Docker container:

```
npm install
```

runs.

---

# Step 19 — Lifecycle hook runs

After each response:

```
onResponse(...)
```

The system checks if the message contains:

```
<task_summary>
```

If found:

```
network.state.data.summary = message
```

---

# Step 20 — Router decides next step

Router checks summary.

```
if summary exists → stop
else → run agent again
```

This loop continues until the task is complete.

---

# Step 21 — Network returns result

Result contains:

```
generated files
summary
network state
```

---

# Step 22 — Preview URL generated

The workflow retrieves the sandbox URL.

```
sandbox.getHost(3000)
```

Example:

```
https://3000-sbx92af3.e2b.app
```

Port 3000 maps to the Next.js server inside the container.

---

# Step 23 — Workflow returns response

Final return value:

```
{
 url,
 files,
 summary
}
```

---

# Step 24 — tRPC returns result to frontend

The tRPC mutation resolves and returns the preview URL.

Frontend receives:

```
preview URL
generated files
summary
```

---

# Step 25 — Frontend displays preview

The browser loads:

```
sandboxUrl
```

The generated landing page appears.

---

# Key Concept

AI reasoning occurs **outside Docker**.

Docker is used only for:

* code execution
* running terminal commands
* hosting the Next.js app

The bridge between AI and Docker is:

```
sandbox.commands.run()
sandbox.files.write()
sandbox.files.read()
```

These operations allow the AI to safely control the development environment.


## AI → Tool → Handler → Sandbox Flow






















This section explains **how the AI actually modifies code in the sandbox environment** using tools.

---

# 1. AI reasoning step

When the agent runs:

```ts
const result = await codeAgent.run(prompt);
```

the prompt is sent to the LLM (for example **OpenAI GPT-4.1**).

The model receives:

* system prompt
* user prompt
* available tools
* current agent state (`network.state.data`)
* previous tool outputs

Example prompt:

```
create a landing page
```

The model reasons internally:

```
Landing page should modify the homepage.
In Next.js the homepage is app/page.tsx.
I should call the createOrUpdateFiles tool.
```

Instead of returning text, the model produces a **tool call**.

Example LLM output:

```json
{
  "tool": "createOrUpdateFiles",
  "arguments": {
    "files": [
      {
        "path": "app/page.tsx",
        "content": "<AI generated landing page code>"
      }
    ]
  }
}
```

Important:

The AI already determines:

* which tool to use
* which file path to modify
* the code that should be written

---

# 2. AgentKit intercepts the tool call

The agent framework detects that the response contains a **tool call**.

Instead of returning the response to the user, it executes the corresponding tool handler.

Conceptually this becomes:

```
createOrUpdateFiles.handler({
  files: [...]
})
```

---

# 3. Tool handler receives the AI instructions

Your handler receives exactly what the AI generated.

```ts
handler: async ({ files }, { step, network }) => {
```

Example value of `files`:

```ts
[
  {
    path: "app/page.tsx",
    content: "<AI generated landing page code>"
  }
]
```

At this stage:

```
AI decision is finished
backend execution begins
```

---

# 4. Handler writes files into the sandbox

Inside the handler the following code executes:

```ts
for (const file of files) {
  await sandbox.files.write(file.path, file.content);
}
```

This is the line that **actually changes the code**.

Execution flow:

```
Node.js backend
      ↓
E2B sandbox API
      ↓
sandbox container filesystem
      ↓
file is written/overwritten
```

Conceptually similar to running inside the container:

```
echo "<AI generated code>" > app/page.tsx
```

---

# 5. Docker sandbox updates the project

The sandbox runs a container containing the Next.js project.

After the write operation:

```
app/page.tsx
```

now contains the **AI-generated code**.

The Next.js application inside the container reflects the updated changes.

---

# 6. Agent state is updated

The handler updates agent memory:

```ts
updatedFiles[file.path] = file.content
network.state.data.files = updatedFiles
```

This allows the agent to remember:

* which files exist
* their latest contents

The state is used in future reasoning steps.

---

# 7. Agent loop continues

After the handler finishes:

1. The tool result is returned to the agent
2. The LLM receives updated context
3. The LLM decides the next action

Possible next steps:

```
create additional components
install dependencies
run dev server
```

This continues until the router detects a completion summary.

---

# Key Concept

The AI **never directly modifies files**.

Instead the system works like this:

```
AI generates instructions
      ↓
Agent framework interprets instructions
      ↓
Tool handler executes the action
      ↓
Sandbox environment performs the change
```

---

# Responsibilities

**AI**

* decides which tool to use
* chooses file paths
* generates code

**Backend / Tool Handlers**

* execute file writes
* run terminal commands
* update sandbox state
* maintain agent memory

---

# One-line summary

The AI **generates the code and instructions**, and the **tool handler writes that code into the sandbox container**, which updates the Next.js project.
