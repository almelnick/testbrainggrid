#!/usr/bin/env python3
"""
Validate the repository structure: check all plugin.yaml and agent.yaml files
are well-formed, all referenced skills exist, and all MCP connectors in .mcp.json
are referenced consistently.
"""

import json
import sys
import yaml
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
ERRORS: list[str] = []
WARNINGS: list[str] = []


def err(msg: str) -> None:
    ERRORS.append(msg)
    print(f"  ERROR: {msg}")


def warn(msg: str) -> None:
    WARNINGS.append(msg)
    print(f"  WARN:  {msg}")


def ok(msg: str) -> None:
    print(f"  OK:    {msg}")


def load_yaml(path: Path) -> dict | None:
    try:
        with open(path) as f:
            return yaml.safe_load(f)
    except Exception as e:
        err(f"Failed to parse {path}: {e}")
        return None


def check_mcp_json() -> set[str]:
    print("\n[1] Checking .mcp.json...")
    mcp_path = REPO_ROOT / ".mcp.json"
    if not mcp_path.exists():
        err(".mcp.json not found")
        return set()
    with open(mcp_path) as f:
        mcp = json.load(f)
    connectors = set(mcp.get("mcpServers", {}).keys())
    ok(f"Found {len(connectors)} MCP connectors: {sorted(connectors)}")
    return connectors


def check_vertical_plugins(mcp_connectors: set[str]) -> dict[str, set[str]]:
    print("\n[2] Checking vertical plugins...")
    available_skills: dict[str, set[str]] = {}
    vp_dir = REPO_ROOT / "plugins" / "vertical-plugins"
    if not vp_dir.exists():
        err(f"Directory not found: {vp_dir}")
        return available_skills

    for plugin_dir in sorted(vp_dir.iterdir()):
        if not plugin_dir.is_dir():
            continue
        plugin_yaml = plugin_dir / "plugin.yaml"
        if not plugin_yaml.exists():
            err(f"Missing plugin.yaml in {plugin_dir.name}")
            continue
        plugin = load_yaml(plugin_yaml)
        if not plugin:
            continue

        name = plugin.get("name", plugin_dir.name)
        skills = set(plugin.get("skills", []))
        available_skills[name] = skills

        skills_dir = plugin_dir / "skills"
        for skill in skills:
            skill_file = skills_dir / f"{skill}.md"
            if not skill_file.exists():
                warn(f"[{name}] Skill file missing: skills/{skill}.md")

        for connector in plugin.get("connectors", []):
            if connector and connector not in mcp_connectors:
                warn(f"[{name}] Connector '{connector}' not in .mcp.json")

        ok(f"{name}: {len(skills)} skills, {len(plugin.get('connectors', []))} connectors")

    return available_skills


def check_agent_plugins(available_skills: dict[str, set[str]], mcp_connectors: set[str]) -> None:
    print("\n[3] Checking agent plugins...")
    ap_dir = REPO_ROOT / "plugins" / "agent-plugins"
    if not ap_dir.exists():
        err(f"Directory not found: {ap_dir}")
        return

    for agent_dir in sorted(ap_dir.iterdir()):
        if not agent_dir.is_dir():
            continue
        agent_yaml = agent_dir / "agent.yaml"
        if not agent_yaml.exists():
            err(f"Missing agent.yaml in {agent_dir.name}")
            continue
        agent = load_yaml(agent_yaml)
        if not agent:
            continue

        name = agent.get("name", agent_dir.name)

        system_prompt_ref = agent.get("system_prompt", "")
        if system_prompt_ref:
            sp_path = agent_dir / system_prompt_ref
            if not sp_path.exists():
                err(f"[{name}] System prompt not found: {system_prompt_ref}")

        for tool_ref in agent.get("tools", []):
            parts = tool_ref.split(".")
            if len(parts) != 2:
                err(f"[{name}] Bad tool ref: '{tool_ref}'")
                continue
            plugin_name, skill_name = parts
            if plugin_name not in available_skills:
                err(f"[{name}] Plugin '{plugin_name}' not found")
            elif skill_name not in available_skills[plugin_name]:
                err(f"[{name}] Skill '{skill_name}' not in plugin '{plugin_name}'")

        for connector in agent.get("connectors", []):
            if connector and connector not in mcp_connectors:
                warn(f"[{name}] Connector '{connector}' not in .mcp.json")

        ok(f"{name}: {len(agent.get('tools', []))} tools, {len(agent.get('connectors', []))} connectors")


def check_cookbooks() -> None:
    print("\n[4] Checking managed-agent-cookbooks...")
    cb_dir = REPO_ROOT / "managed-agent-cookbooks"
    if not cb_dir.exists():
        warn("managed-agent-cookbooks/ directory not found")
        return
    for cb_file in sorted(cb_dir.glob("*.yaml")):
        cb = load_yaml(cb_file)
        if not cb:
            continue
        sp_ref = cb.get("system_prompt_file", "")
        if sp_ref:
            sp_path = (cb_dir / sp_ref).resolve()
            if not sp_path.exists():
                err(f"[{cb_file.name}] System prompt not found: {sp_ref}")
        ok(f"{cb_file.stem}: model={cb.get('model')}, timeout={cb.get('deployment', {}).get('timeout_seconds')}s")


def main():
    print("=" * 60)
    print("Financial Services Plugins — Repository Validation")
    print("=" * 60)

    mcp_connectors = check_mcp_json()
    available_skills = check_vertical_plugins(mcp_connectors)
    check_agent_plugins(available_skills, mcp_connectors)
    check_cookbooks()

    print("\n" + "=" * 60)
    if ERRORS:
        print(f"FAILED: {len(ERRORS)} error(s), {len(WARNINGS)} warning(s)")
        sys.exit(1)
    elif WARNINGS:
        print(f"PASSED with warnings: {len(WARNINGS)} warning(s)")
    else:
        print("PASSED: All checks passed.")


if __name__ == "__main__":
    main()
