/**
 * Swizzled DocBreadcrumbs/StructuredData（GEO 增强）
 * 在 Docusaurus 默认输出的 BreadcrumbList JSON-LD 基础上：
 * 1. 前置「首页」层级（原单级面包屑无导航语义，多级更利于 AIO/Bing 抽取）
 * 2. item URL 统一尾斜杠（与 canonical / trailingSlash 配置一致）
 * 3. 末级 name 用当前文档标题（修复 en 构建沿中文侧栏标签的问题）
 */

import React, {type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import {useBreadcrumbsStructuredData, useDoc} from '@docusaurus/plugin-content-docs/client';
import type {PropSidebarBreadcrumbsItem} from '@docusaurus/plugin-content-docs';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type ListItem = {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
};

export default function DocBreadcrumbsStructuredData(props: {
  breadcrumbs: PropSidebarBreadcrumbsItem[];
}): ReactNode {
  const {siteConfig, i18n} = useDocusaurusContext();
  const isEn = i18n.currentLocale === 'en';
  const {metadata: docMetadata} = useDoc();

  const structuredData = useBreadcrumbsStructuredData({
    breadcrumbs: props.breadcrumbs,
  });

  const withSlash = (u: string) => (u.endsWith('/') ? `${u}` : `${u}/`);
  const originItems = structuredData.itemListElement as ListItem[];

  const homeItem: ListItem = {
    '@type': 'ListItem',
    position: 1,
    name: isEn ? 'Home' : '首页',
    item: withSlash(siteConfig.url),
  };

  const rest: ListItem[] = originItems.map((item, i) => ({
    '@type': 'ListItem' as const,
    position: i + 2,
    name:
      i === originItems.length - 1
        ? (docMetadata.title ?? item.name)
        : item.name,
    item: withSlash(item.item),
  }));

  const patched = {
    ...structuredData,
    itemListElement: [homeItem, ...rest],
  };

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(patched)}</script>
    </Head>
  );
}
