"""
EHCx Onboarding Chatbot - Gradio App with Bedrock Agent Streaming

A streaming chatbot that connects to the Bedrock Agent for multi-tenant onboarding.

Usage:
    # Set environment variables
    export AGENT_ID="your-agent-id"
    export AGENT_ALIAS_ID="your-alias-id"
    
    # Run the app
    python app.py
"""
import gradio as gr
import boto3
import os
import uuid
from typing import Generator

# Configuration
AGENT_ID = os.environ.get("AGENT_ID", "")
AGENT_ALIAS_ID = os.environ.get("AGENT_ALIAS_ID", "")
DEFAULT_TENANT_ID = os.environ.get("DEFAULT_TENANT_ID", "demo-tenant")

# Initialize Bedrock client for direct streaming
bedrock_client = None
if AGENT_ID and AGENT_ALIAS_ID:
    try:
        bedrock_client = boto3.client("bedrock-agent-runtime")
        print(f"✅ Connected to Bedrock Agent: {AGENT_ID}")
    except Exception as e:
        print(f"Warning: Could not initialize Bedrock client: {e}")


def chat_with_agent(
    message: str, 
    history: list,
) -> Generator[str, None, None]:
    """
    Stream responses from Bedrock Agent.
    """
    session_id = str(uuid.uuid4())
    
    if not bedrock_client or not AGENT_ID or not AGENT_ALIAS_ID:
        yield "⚠️ No backend configured. Set AGENT_ID and AGENT_ALIAS_ID environment variables."
        return
    
    try:
        response = bedrock_client.invoke_agent(
            agentId=AGENT_ID,
            agentAliasId=AGENT_ALIAS_ID,
            sessionId=session_id,
            inputText=message,
            enableTrace=False,
            sessionState={
                "sessionAttributes": {
                    "TenantID": DEFAULT_TENANT_ID,
                },
                "promptSessionAttributes": {
                    "tenant_context": f"You are assisting tenant: {DEFAULT_TENANT_ID}"
                }
            }
        )
        
        # Stream the response chunks
        accumulated = ""
        for event in response.get("completion", []):
            if "chunk" in event:
                chunk_bytes = event["chunk"].get("bytes", b"")
                if chunk_bytes:
                    text = chunk_bytes.decode("utf-8")
                    accumulated += text
                    yield accumulated  # Gradio expects cumulative text
        
        if not accumulated:
            yield "I apologize, I couldn't generate a response. Please try again."
            
    except Exception as e:
        yield f"❌ Error communicating with agent: {str(e)}"


# Create simple ChatInterface compatible with Gradio 6.x
demo = gr.ChatInterface(
    fn=chat_with_agent,
    title="🏢 EHCx Onboarding Assistant",
    description="Welcome! I'm your AI assistant for setting up your contact center.",
    examples=[
        "Help me get started with onboarding",
        "What are the steps to set up my contact center?",
        "I want to update my business hours",
    ],
)


if __name__ == "__main__":
    # Check configuration
    if not AGENT_ID or not AGENT_ALIAS_ID:
        print("⚠️  Warning: No backend configured!")
        print("   Set AGENT_ID and AGENT_ALIAS_ID environment variables")
        print()
    
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False,
    )
