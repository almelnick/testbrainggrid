#!/usr/bin/env python3
"""
Orchestrate multi-agent financial workflows using Claude Managed Agents.

Usage:
    python orchestrate.py --workflow pitch --company "Acme Corp" --deal-type sell-side
    python orchestrate.py --workflow earnings-review --ticker ACME
    python orchestrate.py --workflow month-end-close --period 2025-04
"""

import argparse
import json
import os
import sys
import anthropic

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])


def load_agent_id(agent_name: str) -> str:
    """Load managed agent ID from cookbook."""
    import yaml
    from pathlib import Path
    cookbook = Path(__file__).parent.parent / "managed-agent-cookbooks" / f"{agent_name}.yaml"
    with open(cookbook) as f:
        config = yaml.safe_load(f)
    agent_id = config.get("managed_agent_id", "")
    if not agent_id:
        raise ValueError(f"Agent '{agent_name}' has no managed_agent_id. Run deploy-managed-agent.sh first.")
    return agent_id


def run_agent(agent_name: str, message: str) -> str:
    """Run a single managed agent and return its text response."""
    agent_id = load_agent_id(agent_name)
    response = client.beta.agents.sessions.create_and_run(
        agent_id=agent_id,
        input={"role": "user", "content": message},
        betas=["managed-agents-2025-04-01"],
    )
    return response.output_text


def workflow_pitch(company: str, deal_type: str) -> None:
    """Run the pitch preparation workflow."""
    print(f"\n=== Pitch Workflow: {company} ({deal_type}) ===\n")

    print("[1/2] Running market research...")
    market_summary = run_agent(
        "market-researcher",
        f"Produce a market research summary for {company}. Deal type: {deal_type}."
    )
    print(market_summary)

    print("\n[2/2] Building pitch book...")
    pitch = run_agent(
        "pitch-agent",
        f"Build a pitch book for {company}. Deal type: {deal_type}.\n\nMarket context:\n{market_summary}"
    )
    print(pitch)


def workflow_earnings_review(ticker: str) -> None:
    """Run the earnings review workflow."""
    print(f"\n=== Earnings Review Workflow: {ticker} ===\n")
    result = run_agent(
        "earnings-reviewer",
        f"Analyze the most recent earnings release for {ticker} and produce a research note."
    )
    print(result)


def workflow_month_end_close(period: str) -> None:
    """Run the month-end close workflow."""
    print(f"\n=== Month-End Close Workflow: {period} ===\n")
    result = run_agent(
        "month-end-closer",
        f"Run the month-end close checklist for period {period}. Produce accrual schedules and variance commentary."
    )
    print(result)


def main():
    parser = argparse.ArgumentParser(description="Orchestrate financial services agent workflows")
    parser.add_argument("--workflow", required=True, choices=["pitch", "earnings-review", "month-end-close"])
    parser.add_argument("--company", help="Company name (for pitch workflow)")
    parser.add_argument("--deal-type", default="sell-side", help="Deal type (for pitch workflow)")
    parser.add_argument("--ticker", help="Ticker symbol (for earnings-review workflow)")
    parser.add_argument("--period", help="Period (YYYY-MM) for month-end-close workflow")
    args = parser.parse_args()

    if args.workflow == "pitch":
        if not args.company:
            parser.error("--company required for pitch workflow")
        workflow_pitch(args.company, args.deal_type)
    elif args.workflow == "earnings-review":
        if not args.ticker:
            parser.error("--ticker required for earnings-review workflow")
        workflow_earnings_review(args.ticker)
    elif args.workflow == "month-end-close":
        if not args.period:
            parser.error("--period required for month-end-close workflow")
        workflow_month_end_close(args.period)


if __name__ == "__main__":
    main()
