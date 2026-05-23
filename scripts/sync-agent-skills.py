#!/usr/bin/env python3
"""
Sync skill definitions from vertical-plugin directories into agent-plugin skill references.
Validates that all skills referenced in agent.yaml files exist in the vertical plugins.
"""

import os
import sys
import yaml
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
VERTICAL_PLUGINS_DIR = REPO_ROOT / "plugins" / "vertical-plugins"
AGENT_PLUGINS_DIR = REPO_ROOT / "plugins" / "agent-plugins"


def load_yaml(path: Path) -> dict:
    with open(path) as f:
        return yaml.safe_load(f)


def collect_available_skills() -> dict[str, set[str]]:
    """Return mapping of plugin_name -> set of skill names."""
    available = {}
    for plugin_dir in VERTICAL_PLUGINS_DIR.iterdir():
        if not plugin_dir.is_dir():
            continue
        plugin_yaml = plugin_dir / "plugin.yaml"
        if not plugin_yaml.exists():
            continue
        plugin = load_yaml(plugin_yaml)
        available[plugin["name"]] = set(plugin.get("skills", []))
    return available


def validate_agent_skills(available_skills: dict[str, set[str]]) -> list[str]:
    """Check each agent's tool references against available skills. Return list of errors."""
    errors = []
    for agent_dir in AGENT_PLUGINS_DIR.iterdir():
        if not agent_dir.is_dir():
            continue
        agent_yaml = agent_dir / "agent.yaml"
        if not agent_yaml.exists():
            continue
        agent = load_yaml(agent_yaml)
        for tool_ref in agent.get("tools", []):
            parts = tool_ref.split(".")
            if len(parts) != 2:
                errors.append(f"[{agent['name']}] Invalid tool ref format: '{tool_ref}' (expected 'plugin.skill')")
                continue
            plugin_name, skill_name = parts
            if plugin_name not in available_skills:
                errors.append(f"[{agent['name']}] Plugin not found: '{plugin_name}'")
            elif skill_name not in available_skills[plugin_name]:
                errors.append(
                    f"[{agent['name']}] Skill '{skill_name}' not found in plugin '{plugin_name}'. "
                    f"Available: {sorted(available_skills[plugin_name])}"
                )
    return errors


def main():
    print("Collecting available skills from vertical plugins...")
    available = collect_available_skills()
    for plugin, skills in sorted(available.items()):
        print(f"  {plugin}: {sorted(skills)}")

    print("\nValidating agent skill references...")
    errors = validate_agent_skills(available)

    if errors:
        print(f"\n{len(errors)} error(s) found:")
        for err in errors:
            print(f"  ERROR: {err}")
        sys.exit(1)
    else:
        print("All agent skill references are valid.")


if __name__ == "__main__":
    main()
