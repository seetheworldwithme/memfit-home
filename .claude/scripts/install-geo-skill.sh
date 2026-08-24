#!/usr/bin/env bash
# ============================================================
# 项目内安装 geo-seo-claude skill（不污染全局 ~/.claude）
#
# 将 /Volumes/coding/application/geo-seo-claude 的 GEO 审计 skill
# 安装到本项目 .claude/ 下，使 /geo audit 等命令在本项目可用。
#
# 用法:  bash .claude/scripts/install-geo-skill.sh
# ============================================================
set -euo pipefail

PROJ_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
GEO_SRC="${GEO_SRC:-/Volumes/coding/application/geo-seo-claude}"

if [ ! -f "$GEO_SRC/geo/SKILL.md" ]; then
  echo "✗ 找不到 geo 源: $GEO_SRC/geo/SKILL.md" >&2
  echo "  请设置 GEO_SRC 指向 geo-seo-claude 仓库根目录" >&2
  exit 1
fi

CLAUDE_DIR="$PROJ_DIR/.claude"
SKILLS_DIR="$CLAUDE_DIR/skills"
AGENTS_DIR="$CLAUDE_DIR/agents"
INSTALL_DIR="$SKILLS_DIR/geo"
VENV_DIR="$INSTALL_DIR/.venv"
VENV_PY="$VENV_DIR/bin/python3"
# 写入 markdown 的解释器路径（绝对路径，保证 Bash 在任意 CWD 都能跑）
VENV_MD_PY="$VENV_PY"

echo "→ 项目目录: $PROJ_DIR"
echo "→ skill 源: $GEO_SRC"
echo "→ 安装到:   $INSTALL_DIR"

mkdir -p "$SKILLS_DIR" "$AGENTS_DIR" "$INSTALL_DIR/scripts" "$INSTALL_DIR/schema"

# 主 skill
cp -r "$GEO_SRC/geo/"* "$INSTALL_DIR/"

# 子 skills
for skill_dir in "$GEO_SRC/skills"/*/; do
  [ -d "$skill_dir" ] || continue
  name=$(basename "$skill_dir")
  mkdir -p "$SKILLS_DIR/$name"
  cp -r "$skill_dir"* "$SKILLS_DIR/$name/"
done

# agents
for agent_file in "$GEO_SRC/agents/"*.md; do
  [ -f "$agent_file" ] && cp "$agent_file" "$AGENTS_DIR/"
done

# scripts / schema
[ -d "$GEO_SRC/scripts" ] && cp -r "$GEO_SRC/scripts/"* "$INSTALL_DIR/scripts/"
[ -d "$GEO_SRC/schema" ]  && cp -r "$GEO_SRC/schema/"*  "$INSTALL_DIR/schema/"

# 选择可用的最高版本 Python（playwright 需 3.9+，优先 3.13/3.11）
PY_BIN="python3"
for cand in python3.13 python3.12 python3.11 python3.10 python3.9; do
  if command -v "$cand" >/dev/null 2>&1; then PY_BIN="$cand"; break; fi
done
echo "→ 使用 Python: $PY_BIN ($($PY_BIN --version 2>&1))"

# venv
echo "→ 创建隔离 venv: $VENV_DIR"
rm -rf "$VENV_DIR"
if command -v uv >/dev/null 2>&1; then
  uv venv "$VENV_DIR" --python "$PY_BIN" --quiet
  uv pip install --python "$VENV_PY" -r "$GEO_SRC/requirements.txt" --quiet
else
  "$PY_BIN" -m venv "$VENV_DIR"
  "$VENV_PY" -m pip install --upgrade pip --quiet
  "$VENV_PY" -m pip install -r "$GEO_SRC/requirements.txt" --quiet
fi

# 复制 requirements 作参考
cp "$GEO_SRC/requirements.txt" "$INSTALL_DIR/" 2>/dev/null || true

# 改写脚本 shebang 到 venv
for f in "$INSTALL_DIR/scripts/"*.py; do
  [ -f "$f" ] || continue
  sed -i.bak "1s|^#!.*|#!$VENV_PY|" "$f" && rm -f "${f}.bak"
  chmod +x "$f"
done

# 改写 skill / agent markdown 中的 python 路径引用到项目内 venv
patch_md() {
  local f="$1"
  sed -i.bak "s|~/\.claude/skills/geo|$INSTALL_DIR|g" "$f"
  sed -i.bak "s|python3 -c |$VENV_MD_PY -c |g" "$f"
  sed -i.bak "s|python3 -m |$VENV_MD_PY -m |g" "$f"
  rm -f "${f}.bak"
}
for f in "$INSTALL_DIR/SKILL.md" "$SKILLS_DIR"/geo-*/SKILL.md "$AGENTS_DIR"/geo-*.md; do
  [ -f "$f" ] && patch_md "$f"
done

echo ""
echo "✓ 安装完成"
echo "  venv:      $VENV_DIR"
echo "  验证:      $VENV_PY -c 'import requests, bs4; print(\"ok\")'"
echo "  使用:      在本项目内运行 /geo audit http://localhost:3333"
