/**
 * Swizzled Mermaid（GEO 增强）
 * theme-mermaid 的 SVG 完全由客户端渲染——SSR/无 JS 的 AI 爬虫
 * （GPTBot/PerplexityBot/ClaudeBot 等不执行 JS）在静态 HTML 中完全读不到图内容。
 * 这里用 <noscript> 在静态 HTML 保留图源文本（mermaid DSL 本身可被 AI 解析），
 * JS 用户零视觉影响。
 */

import React, {type ReactNode} from 'react';
import MermaidOriginal from '@theme-original/Mermaid';

export default function Mermaid(props: {
  value: string;
  className?: string;
}): ReactNode {
  return (
    <>
      <MermaidOriginal {...props} />
      <noscript>
        <pre className="mermaid-source">{props.value}</pre>
      </noscript>
    </>
  );
}
