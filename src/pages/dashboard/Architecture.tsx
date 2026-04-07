import React, { useEffect, useRef, useState } from 'react';

const ARCHITECTURE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
:root {
  --bg: #FAFAF8;
  --bg2: #F2F1ED;
  --bg3: #E8E7E3;
  --text: #1A1A18;
  --text2: #5A5A56;
  --text3: #8A8A84;
  --accent: #534AB7;
  --accent2: #7F77DD;
  --accent-bg: #EEEDFE;
  --teal: #0F6E56;
  --teal-bg: #E1F5EE;
  --teal2: #1D9E75;
  --coral: #D85A30;
  --coral-bg: #FAECE7;
  --amber: #BA7517;
  --amber-bg: #FAEEDA;
  --blue: #185FA5;
  --blue-bg: #E6F1FB;
  --red: #A32D2D;
  --red-bg: #FCEBEB;
  --pink: #993556;
  --pink-bg: #FBEAF0;
  --green: #3B6D11;
  --green-bg: #EAF3DE;
  --border: rgba(0,0,0,0.08);
  --border2: rgba(0,0,0,0.14);
  --radius: 12px;
  --radius-sm: 8px;
  --radius-xs: 5px;
  --font: 'IBM Plex Sans', -apple-system, sans-serif;
  --mono: 'IBM Plex Mono', 'SF Mono', monospace;
  --display: 'Fraunces', Georgia, serif;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #141413; --bg2: #1E1E1C; --bg3: #2A2A28;
    --text: #E8E7E3; --text2: #A8A8A2; --text3: #6E6E68;
    --accent: #AFA9EC; --accent2: #CECBF6; --accent-bg: #26215C;
    --teal: #5DCAA5; --teal-bg: #04342C; --teal2: #9FE1CB;
    --coral: #F0997B; --coral-bg: #4A1B0C;
    --amber: #FAC775; --amber-bg: #412402;
    --blue: #85B7EB; --blue-bg: #042C53;
    --red: #F09595; --red-bg: #501313;
    --pink: #ED93B1; --pink-bg: #4B1528;
    --green: #C0DD97; --green-bg: #173404;
    --border: rgba(255,255,255,0.08); --border2: rgba(255,255,255,0.14);
  }
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: var(--font); background: var(--bg); color: var(--text); line-height: 1.7; font-size: 15px; -webkit-font-smoothing: antialiased; }
.container { max-width: 1080px; margin: 0 auto; padding: 0 32px; }
.hero { padding: 48px 0 40px; border-bottom: 1px solid var(--border); }
.hero-eyebrow { font-family: var(--mono); font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); margin-bottom: 16px; }
.hero h1 { font-family: var(--display); font-size: clamp(36px, 5vw, 56px); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 20px; }
.hero h1 span { color: var(--accent); }
.hero-sub { font-size: 18px; color: var(--text2); max-width: 640px; line-height: 1.6; }
.hero-meta { display: flex; gap: 24px; margin-top: 28px; flex-wrap: wrap; }
.hero-meta-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text3); font-family: var(--mono); }
.hero-meta-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.toc { position: sticky; top: 0; z-index: 100; background: var(--bg); border-bottom: 1px solid var(--border); padding: 12px 0; overflow-x: auto; }
.toc-inner { display: flex; gap: 4px; max-width: 1080px; margin: 0 auto; padding: 0 32px; }
.toc a { font-size: 12px; font-family: var(--mono); color: var(--text3); text-decoration: none; padding: 6px 12px; border-radius: 20px; white-space: nowrap; transition: all 0.2s; }
.toc a:hover { color: var(--accent); background: var(--accent-bg); }
section { padding: 64px 0; border-bottom: 1px solid var(--border); }
section:last-child { border-bottom: none; }
.section-label { font-family: var(--mono); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
h2 { font-family: var(--display); font-size: 32px; font-weight: 500; letter-spacing: -0.01em; margin-bottom: 16px; line-height: 1.2; }
h3 { font-size: 20px; font-weight: 600; margin: 40px 0 12px; letter-spacing: -0.01em; }
h4 { font-size: 15px; font-weight: 600; margin: 28px 0 8px; color: var(--text2); }
p { margin-bottom: 16px; color: var(--text2); }
p strong { color: var(--text); font-weight: 600; }
.diagram-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 32px; margin: 32px 0; overflow-x: auto; }
.diagram-card svg { width: 100%; height: auto; display: block; }
.diagram-caption { font-size: 12px; font-family: var(--mono); color: var(--text3); margin-top: 16px; text-align: center; }
.layer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 24px 0; }
@media (max-width: 720px) { .layer-grid { grid-template-columns: 1fr; } }
.layer-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; position: relative; overflow: hidden; }
.layer-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; }
.layer-card h4 { margin-top: 0; color: var(--text); font-size: 16px; }
.layer-card p { font-size: 14px; margin-bottom: 0; }
.layer-card .lc-tag { display: inline-block; font-size: 11px; font-family: var(--mono); padding: 2px 8px; border-radius: 10px; margin-top: 12px; }
.lc-purple::before { background: var(--accent); } .lc-purple .lc-tag { background: var(--accent-bg); color: var(--accent); }
.lc-teal::before { background: var(--teal); } .lc-teal .lc-tag { background: var(--teal-bg); color: var(--teal); }
.lc-coral::before { background: var(--coral); } .lc-coral .lc-tag { background: var(--coral-bg); color: var(--coral); }
.lc-amber::before { background: var(--amber); } .lc-amber .lc-tag { background: var(--amber-bg); color: var(--amber); }
.lc-blue::before { background: var(--blue); } .lc-blue .lc-tag { background: var(--blue-bg); color: var(--blue); }
.steps { margin: 24px 0; }
.step { display: flex; gap: 20px; padding: 20px 0; border-bottom: 1px solid var(--border); }
.step:last-child { border-bottom: none; }
.step-num { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: 14px; font-weight: 600; flex-shrink: 0; }
.step-content { flex: 1; }
.step-content h4 { margin-top: 0; }
.step-content p { font-size: 14px; margin-bottom: 0; }
.table-wrap { overflow-x: auto; margin: 24px 0; border: 1px solid var(--border); border-radius: var(--radius); }
table { width: 100%; border-collapse: collapse; font-size: 13px; font-family: var(--mono); }
th { text-align: left; padding: 12px 16px; background: var(--bg3); font-weight: 600; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: var(--text3); border-bottom: 1px solid var(--border2); }
td { padding: 10px 16px; border-bottom: 1px solid var(--border); color: var(--text2); }
tr:last-child td { border-bottom: none; }
td code { background: var(--bg3); padding: 2px 6px; border-radius: 4px; font-size: 12px; color: var(--accent); }
.callout { border-radius: var(--radius); padding: 20px 24px; margin: 24px 0; display: flex; gap: 14px; font-size: 14px; }
.callout-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
.callout p { margin-bottom: 0; }
.callout-info { background: var(--blue-bg); border: 1px solid rgba(24,95,165,0.15); }
.callout-info .callout-icon { color: var(--blue); }
.callout-warn { background: var(--amber-bg); border: 1px solid rgba(186,117,23,0.15); }
.callout-warn .callout-icon { color: var(--amber); }
.callout-key { background: var(--accent-bg); border: 1px solid rgba(83,74,183,0.15); }
.callout-key .callout-icon { color: var(--accent); }
.pillars { display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0; }
.pillar-badge { padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; border: 1px solid var(--border); }
.flow-strip { display: flex; align-items: center; gap: 0; margin: 24px 0; overflow-x: auto; padding: 8px 0; }
.flow-node { padding: 10px 16px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; white-space: nowrap; flex-shrink: 0; }
.flow-arrow { color: var(--text3); font-size: 18px; padding: 0 4px; flex-shrink: 0; }
.file-tree { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; margin: 24px 0; font-family: var(--mono); font-size: 13px; line-height: 2; color: var(--text2); overflow-x: auto; white-space: pre; }
.file-tree .dir { color: var(--accent); font-weight: 500; }
.file-tree .built { color: var(--teal); }
.file-tree .stub { color: var(--text3); }
.seq-svg text { font-family: 'IBM Plex Sans', sans-serif; }
.seq-actor { fill: var(--bg2); stroke: var(--border2); stroke-width: 1; }
.seq-line { stroke: var(--border2); stroke-width: 1; stroke-dasharray: 4 3; }
.seq-msg { stroke: var(--text3); stroke-width: 1; fill: none; }
.seq-msg-solid { stroke: var(--text2); stroke-width: 1.5; }
.seq-self { stroke: var(--accent); stroke-width: 1; fill: none; }
.seq-note { fill: var(--accent-bg); stroke: var(--accent); stroke-width: 0.5; rx: 4; }
.seq-label { fill: var(--text2); font-size: 11px; }
.seq-actor-label { fill: var(--text); font-size: 12px; font-weight: 600; }
.seq-note-text { fill: var(--accent); font-size: 10px; font-weight: 500; }
</style>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,700&display=swap" rel="stylesheet">
</head>
<body></body>
</html>`;

// The body content is injected separately to avoid template literal issues with backticks in SVG
const BODY_CONTENT = `
<header class="hero">
<div class="container">
  <div class="hero-eyebrow">Architecture documentation</div>
  <h1>EHCx <span>v2</span></h1>
  <p class="hero-sub">Zero-touch CCaaS platform. GPU-native intelligence core, five-agent pipeline with deterministic gating, protocol bridge abstraction deploying to AWS Connect via MCP and Google CX via A2A.</p>
  <div class="hero-meta">
    <div class="hero-meta-item"><div class="hero-meta-dot" style="background:var(--accent)"></div>Phase 1 — Bedrock-native</div>
    <div class="hero-meta-item"><div class="hero-meta-dot" style="background:var(--teal)"></div>MCP protocol bridge</div>
    <div class="hero-meta-item"><div class="hero-meta-dot" style="background:var(--amber)"></div>DynamoDB single-table</div>
    <div class="hero-meta-item"><div class="hero-meta-dot" style="background:var(--coral)"></div>Flywheel compounding</div>
  </div>
</div>
</header>

<nav class="toc">
<div class="toc-inner">
  <a href="#overview">Overview</a>
  <a href="#layers">Six layers</a>
  <a href="#pipeline">Agent pipeline</a>
  <a href="#bridge">Protocol bridge</a>
  <a href="#deploy-seq">Deploy sequence</a>
  <a href="#spec">TenantFlowSpec</a>
  <a href="#dynamo">DynamoDB design</a>
  <a href="#flywheel">Flywheel</a>
  <a href="#harness">Harness engineering</a>
  <a href="#files">File structure</a>
</div>
</nav>

<main class="container">
<section id="overview">
<div class="section-label">01 — System overview</div>
<h2>Architecture at a glance</h2>
<p>EHCx v2 is a <strong>six-layer system</strong> that transforms a natural language conversation with a tenant into a fully provisioned, production-ready contact center — without human intervention. The intelligence core generates platform-agnostic flow specifications, a five-agent pipeline validates and gates them, and the protocol bridge deploys them to the target platform through industry-standard protocols.</p>
<div class="callout callout-key">
  <div class="callout-icon">◆</div>
  <div><p><strong>Key insight:</strong> MCP and A2A aren't adapters bolted on after the fact — they are the primary integration surface. Adding a new platform (Twilio, Genesys) means adding a new adapter in the protocol bridge. The intelligence core doesn't change.</p></div>
</div>
</section>

<section id="layers">
<div class="section-label">02 — Layer breakdown</div>
<h2>Six layers, top to bottom</h2>
<p>Each layer has a single responsibility. Data flows downward through the system; the flywheel loops back from the bottom to the top.</p>
<div class="layer-grid">
  <div class="layer-card lc-teal"><h4>L1 — Onboarding surface</h4><p>WebSocket/gRPC endpoint handling chat and voice. Emotion AI detects sentiment in real-time. The <strong>Intake agent</strong> runs industry detection here — writing a free-form industry string and tags from the conversation, not from any hardcoded list.</p><span class="lc-tag">WebSocket · gRPC · NeMo Riva ASR</span></div>
  <div class="layer-card lc-purple"><h4>L2 — GPU intelligence core</h4><p>NeMo RLVR-trained flow generation engine emits <strong>TenantFlowSpec</strong> — the canonical IR. vLLM/Dynamo handles disaggregated prefill/decode. Per-tenant LoRA adapters make each tenant's flows better over time without retraining the base model.</p><span class="lc-tag">NeMo · vLLM · Dynamo · EKS + NIM Operator</span></div>
  <div class="layer-card lc-blue"><h4>L3 — Five-agent pipeline</h4><p>LangGraph-orchestrated DAG with checkpointing. Each agent has a single job. The Opus Judge is a <strong>deterministic gate</strong> — it doesn't suggest improvements, it passes or fails. Failures loop back to the Architect via the Ralph Wiggum pattern (fresh context, no rot).</p><span class="lc-tag">LangGraph · checkpointing · separate evaluator</span></div>
  <div class="layer-card lc-teal"><h4>L4 — Protocol bridge</h4><p>Routes approved specs to the correct platform adapter. Phase 1 ships <strong>AWSConnectAdapter</strong> (MCP → AgentCore Gateway). Phase 2 adds GoogleCXAdapter (A2A → Dialogflow CX). Adding Twilio or Genesys = one new adapter, same spec.</p><span class="lc-tag">MCP · A2A · platform-agnostic</span></div>
  <div class="layer-card lc-coral"><h4>L5 — Platform targets</h4><p>Receives fully validated, platform-native configuration. AWS Connect gets Flow Language JSON + Lex bots + Lambda deployments. Google CX gets Dialogflow agents + fulfillment webhooks. The adapter handles all platform-specific translation.</p><span class="lc-tag">Connect Flow Language v2019-10-30 · Dialogflow CX</span></div>
  <div class="layer-card lc-amber"><h4>L6 — DynamoDB data plane</h4><p>Single-table design partitioned by tenant. Every deployment writes a flywheel event. DynamoDB Streams fires a Lambda that transforms events into cross-tenant pattern indexes and selects high-signal data for LoRA retraining. <strong>One database in the critical path.</strong></p><span class="lc-tag">Single-table · Streams · per-tenant KMS</span></div>
</div>
</section>

<section id="pipeline">
<div class="section-label">03 — Agent pipeline</div>
<h2>Five-agent pipeline</h2>
<p>Built on Boris Cherny's methodology: separate generator from evaluator, use the Opus Judge as a deterministic gate, and treat agent mistakes as harness gaps — not model failures.</p>
<div class="flow-strip">
  <div class="flow-node" style="background:var(--teal-bg);color:var(--teal)">Intake</div>
  <div class="flow-arrow">→</div>
  <div class="flow-node" style="background:var(--accent-bg);color:var(--accent)">Architect</div>
  <div class="flow-arrow">→</div>
  <div class="flow-node" style="background:var(--coral-bg);color:var(--coral)">Executor</div>
  <div class="flow-arrow">→</div>
  <div class="flow-node" style="background:var(--blue-bg);color:var(--blue)">Verifier</div>
  <div class="flow-arrow">→</div>
  <div class="flow-node" style="background:var(--red-bg);color:var(--red);border:1px solid var(--red)">Opus Judge</div>
</div>
<div class="layer-grid">
  <div class="layer-card lc-teal"><h4>Intake agent</h4><p>Parses natural language requirements into structured intent. <strong>Owns industry detection</strong> — writes free-form industry string and industry_tags from conversation analysis. No hardcoded taxonomy.</p><span class="lc-tag">Agent 1 · NLP → structured</span></div>
  <div class="layer-card lc-purple"><h4>Architect agent</h4><p>Transforms intent into a TenantFlowSpec draft. Searches the <strong>playbook library</strong> by similarity to the detected industry (not enum match). Attaches FlowGraph, QueueSpecs, BotSpecs, and RoutingProfiles.</p><span class="lc-tag">Agent 2 · playbook search · spec draft</span></div>
  <div class="layer-card lc-coral"><h4>Executor agent</h4><p>Compiles the draft spec using ConnectFlowCompiler. Validates the output against Connect Flow Language v2019-10-30 schema. Cross-references all queue IDs, bot associations, and routing profiles.</p><span class="lc-tag">Agent 3 · compile · validate</span></div>
  <div class="layer-card lc-blue"><h4>Verifier agent</h4><p>Runs deeper verification: simulates flow traversal (happy path + error paths), checks compliance tags (HIPAA, PCI-DSS, SOC2 against the industry), and validates edge case handling.</p><span class="lc-tag">Agent 4 · simulate · compliance</span></div>
</div>
<div class="callout callout-warn">
  <div class="callout-icon">⚠</div>
  <div><p><strong>The Opus Judge is a separate model.</strong> Claude Opus 4 judges, Claude Sonnet 4 generates. Different models prevent self-grading. The judge is deterministic: PASS deploys, FAIL returns to Architect with a rejection reason, RETRY gives the Verifier one more attempt.</p></div>
</div>
</section>

<section id="bridge">
<div class="section-label">04 — Protocol bridge</div>
<h2>Protocol bridge layer</h2>
<p>Two protocols, two integration paths. MCP is the internal tool orchestration layer — EHCx agents calling AWS/Google APIs as tools. A2A is the external collaboration layer — agents negotiating with customer-side or partner agents.</p>
</section>

<section id="deploy-seq">
<div class="section-label">05 — Deployment sequence</div>
<h2>Seven-step deployment</h2>
<p>When the Opus Judge approves a spec, the AWSConnectAdapter executes this sequence. On any step failure, resources are deleted in reverse order automatically.</p>
<div class="steps">
  <div class="step"><div class="step-num" style="background:var(--accent-bg);color:var(--accent)">1</div><div class="step-content"><h4>Schema validation</h4><p>ConnectFlowCompiler.compile() translates the canonical spec into Connect Flow Language JSON. Validates against the v2019-10-30 schema.</p></div></div>
  <div class="step"><div class="step-num" style="background:var(--teal-bg);color:var(--teal)">2</div><div class="step-content"><h4>MCP tool discovery</h4><p>Calls tools/list on the AgentCore Gateway. Confirms all six required tools are available. Fails fast if any are missing.</p></div></div>
  <div class="step"><div class="step-num" style="background:var(--coral-bg);color:var(--coral)">3</div><div class="step-content"><h4>Flow creation</h4><p>tools/call → connect_create_contact_flow with compiled Flow Language JSON. Tags the resource with ehcx_tenant and ehcx_spec_id.</p></div></div>
  <div class="step"><div class="step-num" style="background:var(--blue-bg);color:var(--blue)">4</div><div class="step-content"><h4>Queue provisioning (parallel)</h4><p>asyncio.gather() creates all queues simultaneously. If any queue fails, the entire step fails and triggers rollback.</p></div></div>
  <div class="step"><div class="step-num" style="background:var(--pink-bg);color:var(--pink)">5</div><div class="step-content"><h4>Bot association</h4><p>Associates Lex v2 bots or Bedrock Agents with the flow. Skipped if no bots in spec.</p></div></div>
  <div class="step"><div class="step-num" style="background:var(--green-bg);color:var(--green)">6</div><div class="step-content"><h4>Verification</h4><p>connect_describe_contact_flow confirms the deployed flow is in ACTIVE state. If verification fails, the entire deployment is rolled back.</p></div></div>
  <div class="step"><div class="step-num" style="background:var(--amber-bg);color:var(--amber)">7</div><div class="step-content"><h4>Flywheel registration</h4><p>Writes a deployment event to DynamoDB. DynamoDB Streams picks this up for the flywheel pipeline.</p></div></div>
</div>
<div class="callout callout-info">
  <div class="callout-icon">ℹ</div>
  <div><p><strong>Rollback nuance:</strong> Connect doesn't support queue deletion. On rollback, contact flows are deleted but queues are marked for manual cleanup.</p></div>
</div>
</section>

<section id="spec">
<div class="section-label">06 — Canonical spec</div>
<h2>TenantFlowSpec</h2>
<p>The single source of truth between the intelligence core and the protocol bridge. Every flow the NeMo engine generates gets expressed as this spec. Adapters never see raw model output.</p>
</section>

<section id="dynamo">
<div class="section-label">07 — Data plane</div>
<h2>DynamoDB single-table design</h2>
<p>One table, one critical path. Pool-the-compute / silo-the-data: all tenants share the table, but IAM condition keys on PK prefix enforce row-level isolation.</p>
<div class="table-wrap">
<table>
  <thead><tr><th>Entity</th><th>PK</th><th>SK</th><th>GSI1PK</th><th>GSI1SK</th></tr></thead>
  <tbody>
    <tr><td>Tenant config</td><td><code>TENANT#id</code></td><td><code>META</code></td><td><code>PLATFORM#aws_connect</code></td><td><code>INDUSTRY#str</code></td></tr>
    <tr><td>Flow spec</td><td><code>TENANT#id</code></td><td><code>SPEC#ts#specId</code></td><td><code>STATUS#validated</code></td><td><code>SPEC#ts</code></td></tr>
    <tr><td>Deployment event</td><td><code>TENANT#id</code></td><td><code>DEPLOY#ts#specId</code></td><td><code>PLATFORM#aws_connect</code></td><td><code>INDUSTRY#str#ts</code></td></tr>
    <tr><td>Queue mapping</td><td><code>TENANT#id</code></td><td><code>QUEUE#queueId</code></td><td>—</td><td>—</td></tr>
    <tr><td>Bot association</td><td><code>TENANT#id</code></td><td><code>BOT#botId</code></td><td>—</td><td>—</td></tr>
    <tr><td>Playbook</td><td><code>PLAYBOOK#id</code></td><td><code>META</code></td><td><code>INDUSTRY#str</code></td><td><code>PLAYBOOK#usage</code></td></tr>
    <tr><td>Pipeline run</td><td><code>TENANT#id</code></td><td><code>RUN#ts#runId</code></td><td><code>STATUS#judge_approved</code></td><td><code>RUN#ts</code></td></tr>
  </tbody>
</table>
</div>
<div class="callout callout-key">
  <div class="callout-icon">◆</div>
  <div><p><strong>Why not ArangoDB?</strong> The graph queries for cross-tenant pattern detection aren't a Phase 1 concern. DynamoDB Streams can replicate flywheel events into a graph store later as a read-side projection.</p></div>
</div>
</section>

<section id="flywheel">
<div class="section-label">08 — Flywheel</div>
<h2>Data flywheel</h2>
<p>Every successful deployment makes the next one faster. This is the investor story — a compounding playbook library that scales without additional ops overhead.</p>
</section>

<section id="harness">
<div class="section-label">09 — Harness engineering</div>
<h2>Harness engineering pillars</h2>
<p>The bottleneck is not the model — it's the system around it. Harness engineering is the discipline of designing constraints, feedback loops, and operating environments around AI agents.</p>
<div class="pillars">
  <div class="pillar-badge" style="background:var(--accent-bg);color:var(--accent)">Tool orchestration</div>
  <div class="pillar-badge" style="background:var(--teal-bg);color:var(--teal)">Guardrails</div>
  <div class="pillar-badge" style="background:var(--amber-bg);color:var(--amber)">Feedback loops</div>
  <div class="pillar-badge" style="background:var(--blue-bg);color:var(--blue)">Observability</div>
  <div class="pillar-badge" style="background:var(--coral-bg);color:var(--coral)">Human-in-loop checkpoints</div>
</div>
<div class="layer-grid">
  <div class="layer-card lc-purple"><h4>Tool orchestration</h4><p>Simple tools over custom tools. LangGraph manages tool availability per agent — the Verifier can't call deploy tools, the Executor can't call judge tools.</p></div>
  <div class="layer-card lc-teal"><h4>Guardrails</h4><p>Permissions boundaries per agent. Loop detection middleware catches infinite revision cycles. PreCompletionChecklist middleware enforces output structure.</p></div>
  <div class="layer-card lc-amber"><h4>Feedback loops</h4><p>The GAN-inspired pattern: generator (Sonnet 4) produces, evaluator (Opus 4) judges. Each Ralph Wiggum iteration uses fresh context — filesystem as memory, git commits between rounds.</p></div>
  <div class="layer-card lc-blue"><h4>Observability</h4><p>Every agent action traced with token counts, latency, and tool call logs. CloudWatch dashboards per tenant. X-Ray distributed tracing across the full pipeline.</p></div>
</div>
<div class="callout callout-info">
  <div class="callout-icon">ℹ</div>
  <div><p><strong>Harness rule #8:</strong> Treat agent mistakes as harness gaps, not model failures. If the Executor produces invalid JSON, the fix is in the compilation pipeline, not in the prompt.</p></div>
</div>
</section>

<section id="files">
<div class="section-label">10 — Repository</div>
<h2>File structure</h2>
<p>Phase 1 repository layout. Green = built, gray = stub.</p>
<div class="file-tree"><span class="dir">ehcx-protocol-bridge/</span>
├── CLAUDE.md
├── RULES.md
├── AGENTS.md
├── pyproject.toml
│
├── <span class="dir">src/</span>
│   ├── <span class="dir">specs/</span>
│   │   ├── <span class="built">tenant_flow_spec.py        ✓ BUILT</span>
│   │   ├── validators.py
│   │   └── <span class="dir">fixtures/</span>
│   │
│   ├── <span class="dir">compiler/</span>
│   │   ├── base.py
│   │   ├── connect_compiler.py
│   │   └── cx_compiler.py
│   │
│   ├── <span class="dir">adapters/</span>
│   │   ├── base.py
│   │   ├── <span class="built">aws_connect_adapter.py     ✓ BUILT</span>
│   │   ├── google_cx_adapter.py
│   │   └── mcp_gateway_client.py
│   │
│   ├── <span class="dir">bridge/</span>
│   │   ├── router.py
│   │   ├── rollback.py
│   │   └── circuit_breaker.py
│   │
│   ├── <span class="dir">pipeline/</span>
│   │   ├── graph.py
│   │   ├── state.py
│   │   ├── <span class="dir">agents/</span>
│   │   │   ├── intake.py
│   │   │   ├── architect.py
│   │   │   ├── executor.py
│   │   │   ├── verifier.py
│   │   │   └── judge.py
│   │   └── <span class="dir">hooks/</span>
│   │       ├── pre_completion.py
│   │       └── loop_detection.py
│   │
│   ├── <span class="dir">flywheel/</span>
│   │   ├── dynamo_writer.py
│   │   ├── stream_handler.py
│   │   ├── patterns.py
│   │   └── training_selector.py
│   │
│   ├── <span class="dir">tenants/</span>
│   │   ├── manager.py
│   │   ├── isolation.py
│   │   └── dynamo_schema.py
│   │
│   └── <span class="dir">infra/</span>
│       ├── cdk_app.py
│       ├── <span class="dir">stacks/</span>
│       └── <span class="dir">constructs/</span>
│
├── <span class="dir">tests/</span>
├── <span class="dir">agents/</span>
├── <span class="dir">skills/</span>
├── <span class="dir">playbooks/</span>
└── <span class="dir">docs/</span></div>
</section>
</main>

<footer style="border-top:1px solid var(--border);padding:40px 0;text-align:center">
  <p style="font-family:var(--mono);font-size:11px;color:var(--text3);letter-spacing:1px">ELEVENTH HOUSE AI — EHCx v2 ARCHITECTURE DOCUMENTATION — PHASE 1</p>
</footer>
`;

const Architecture: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(800);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      // Parse the shell HTML to get styles
      const parser = new DOMParser();
      const shell = parser.parseFromString(ARCHITECTURE_HTML, 'text/html');

      // Write the full document
      doc.open();
      doc.write('<!DOCTYPE html><html lang="en"><head>');
      doc.write('<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">');

      // Copy styles
      shell.querySelectorAll('style, link').forEach(el => {
        doc.write(el.outerHTML);
      });

      doc.write('</head><body>');
      doc.write(BODY_CONTENT);
      doc.write('</body></html>');
      doc.close();

      // Auto-resize iframe to fit content
      const resizeIframe = () => {
        if (doc.body) {
          const height = doc.documentElement.scrollHeight || doc.body.scrollHeight;
          if (height > 0) setIframeHeight(height + 32);
        }
      };

      // Resize after content renders and fonts load
      setTimeout(resizeIframe, 100);
      setTimeout(resizeIframe, 500);
      setTimeout(resizeIframe, 1500);
    };

    iframe.addEventListener('load', handleLoad);
    // Trigger initial load
    handleLoad();

    return () => iframe.removeEventListener('load', handleLoad);
  }, []);

  return (
    <div className="w-full">
      <iframe
        ref={iframeRef}
        title="EHCx v2 Architecture Documentation"
        className="w-full border-0 rounded-xl bg-white"
        style={{ height: `${iframeHeight}px` }}
        sandbox="allow-same-origin"
      />
    </div>
  );
};

export default Architecture;
