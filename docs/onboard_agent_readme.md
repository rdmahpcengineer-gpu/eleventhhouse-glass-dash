# EHCx Onboarding Agent

Multi-tenant AI Contact Center onboarding system powered by Amazon Bedrock.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Gradio Chatbot │────▶│   API Gateway   │────▶│   Lambda Proxy  │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                        ┌────────────────────────────────▼────────────────────────────────┐
                        │                    Amazon Bedrock Agent                          │
                        │  ┌──────────────────────────────────────────────────────────┐   │
                        │  │ "Universal Brain" (Claude 3.5 Sonnet)                    │   │
                        │  │ - Multi-tenant via TenantID session attributes           │   │
                        │  │ - Action Groups: GetBusinessInfo, OnboardTenant          │   │
                        │  └──────────────────────────────────────────────────────────┘   │
                        └────────────────────────────────────────────────────────────────┬─┘
                                                         │
                        ┌────────────────────────────────▼────────────────┐
                        │              Lambda Action Handler               │
                        │  - GetBusinessInfo(TenantID)                    │
                        │  - OnboardTenant(TenantID, details)             │
                        │  - GetOnboardingStatus(TenantID)                │
                        └────────────────────────────────┬────────────────┘
                                                         │
                        ┌────────────────────────────────▼────────────────┐
                        │                   DynamoDB                       │
                        │  Partition Key: TenantID | Sort Key: SK         │
                        └─────────────────────────────────────────────────┘
```

## Quick Start

### 1. Deploy Infrastructure

```bash
# Install dependencies
cd cdk
pip install -r requirements.txt

# Deploy to AWS
cdk deploy
```

### 2. Run Gradio Chatbot

```bash
# Install Gradio dependencies
cd gradio_app
pip install -r requirements.txt

# Set environment variables (from CDK outputs)
export AGENT_ID="your-agent-id"
export AGENT_ALIAS_ID="your-alias-id"

# Run the app
python app.py
```

Open http://localhost:7860 in your browser.

## Project Structure

```
EHCx_onboard_agent/
├── cdk/                         # AWS CDK infrastructure
│   ├── app.py                   # CDK app entry point
│   ├── ehcx_onboard_stack.py    # Main stack (Bedrock Agent, Lambda, DynamoDB)
│   ├── cdk.json                 # CDK configuration
│   └── requirements.txt         # CDK dependencies
├── lambdas/
│   ├── onboard_handler/         # Bedrock Agent action group
│   │   └── handler.py
│   └── chat_proxy/              # API Gateway backend
│       └── handler.py
├── gradio_app/
│   ├── app.py                   # Streaming chatbot
│   └── requirements.txt
├── .github/workflows/
│   └── deploy.yml               # CI/CD pipeline
└── onboard_summary.md           # Architecture documentation
```

## CI/CD Setup

1. Create GitHub OIDC provider in AWS IAM
2. Create IAM role with CDK deployment permissions
3. Add `AWS_ROLE_ARN` secret to GitHub repository
4. Push to `main` branch to trigger deployment

## Environment Variables

| Variable | Description |
|----------|-------------|
| `API_ENDPOINT` | API Gateway chat endpoint URL |
| `AGENT_ID` | Bedrock Agent ID (for direct access) |
| `AGENT_ALIAS_ID` | Bedrock Agent Alias ID |
| `DEFAULT_TENANT_ID` | Default tenant for demo purposes |
