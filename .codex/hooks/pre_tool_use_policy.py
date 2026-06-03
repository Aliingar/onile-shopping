#!/usr/bin/env python3
"""Warn before risky shell commands.

This hook is intentionally warning-first. It emits a systemMessage when a
command looks dangerous, but exits with 0 so false positives do not block work.
"""

from __future__ import annotations

import json
import re
import sys
from typing import Any


READ_COMMANDS = r"(cat|type|get-content|gc)"
DISPLAY_COMMANDS = r"(cat|type|get-content|gc|echo|write-output|printenv|env|set|rg|select-string)"

RULES: list[tuple[str, str, str]] = [
    ("high", r"\bgit\s+reset\s+--hard\b", "git reset --hard は作業内容を失う危険があります。"),
    ("high", r"\bgit\s+clean\s+-[a-z]*f[a-z]*d[a-z]*\b|\bgit\s+clean\s+-[a-z]*d[a-z]*f[a-z]*\b", "git clean -fd は未追跡ファイルを削除する危険があります。"),
    ("high", r"\bgit\s+push\b(?=.*(?:--force|-f\b))", "force push はリモート履歴を書き換える危険があります。"),
    ("high", r"\brm\s+-[a-z]*r[a-z]*f[a-z]*\b|\brm\s+-[a-z]*f[a-z]*r[a-z]*\b", "rm -rf は大量削除につながる危険があります。"),
    ("high", r"\bdel\s+/s\b", "del /s は広範囲のファイル削除につながる危険があります。"),
    ("high", r"\brmdir\s+/s\b", "rmdir /s はディレクトリ削除につながる危険があります。"),
    ("high", r"\bdrop\s+table\b", "DROP TABLE はテーブルを削除する破壊的SQLです。"),
    ("high", r"\bdrop\s+database\b", "DROP DATABASE はDBを削除する破壊的SQLです。"),
    ("high", r"\btruncate\b", "TRUNCATE はテーブル内データを削除する破壊的SQLです。"),
    ("high", r"\bdelete\s+from\b", "DELETE FROM はデータ削除につながるSQLです。"),
    ("high", r"\balter\s+table\b", "ALTER TABLE はDB構造を変える可能性があります。"),
    ("high", rf"\b{READ_COMMANDS}\b.*(?:^|\s|['\"])\.env(?:\b|['\"]|$)", ".env を表示しようとしている可能性があります。秘密情報を開かないでください。"),
    ("medium", rf"\b{DISPLAY_COMMANDS}\b.*\b(api[_-]?key|password|token|secret)\b", "API_KEY、PASSWORD、TOKEN、SECRET などを表示しそうなコマンドです。"),
]


def _extract_command(payload: Any) -> str:
    if isinstance(payload, str):
        return payload
    if not isinstance(payload, dict):
        return ""

    for key in ("command", "cmd"):
        value = payload.get(key)
        if isinstance(value, str):
            return value

    for key in ("tool_input", "arguments", "parameters", "input"):
        value = payload.get(key)
        command = _extract_command(value)
        if command:
            return command

    return ""


def _load_payload() -> Any:
    raw = sys.stdin.read()
    if not raw.strip():
        return {}
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {"command": raw}


def _find_warnings(command: str) -> list[tuple[str, str]]:
    found: list[tuple[str, str]] = []
    for severity, pattern, message in RULES:
        if re.search(pattern, command, flags=re.IGNORECASE | re.DOTALL):
            found.append((severity, message))
    return found


def main() -> int:
    payload = _load_payload()
    command = _extract_command(payload)
    if not command:
        return 0

    warnings = _find_warnings(command)
    if not warnings:
        return 0

    high = [message for severity, message in warnings if severity == "high"]
    medium = [message for severity, message in warnings if severity != "high"]
    lines = []
    if high:
        lines.append("強い警告: 危険度の高い操作が検出されました。実行前に必ず人間が確認してください。")
        lines.extend(f"- {message}" for message in high)
    if medium:
        lines.append("警告: 秘密情報を表示する可能性がある操作が検出されました。")
        lines.extend(f"- {message}" for message in medium)

    print(json.dumps({"systemMessage": "\n".join(lines), "block": False}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
