/**
 * Swizzled DocItem/Footer
 * 在文档页脚注入 TechArticle JSON-LD（headline/description/dateModified/author），
 * 提升 AI/搜索引擎对文档内容的识别与新鲜度信号。
 * 其余逻辑保持 Docusaurus 原样。
 */

import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Head from '@docusaurus/Head';
import TagsListInline from '@theme/TagsListInline';

import EditMetaRow from '@theme/EditMetaRow';

function TechArticleJsonLd(): ReactNode {
  const {metadata} = useDoc();
  const {title, description, permalink, lastUpdatedAt, lastUpdatedBy} =
    metadata;

  // 仅当有可用字段时才注入，避免脏数据
  if (!title) {
    return null;
  }

  const siteUrl = 'https://memfit.ai';
  const absoluteUrl = permalink?.startsWith('http')
    ? permalink
    : `${siteUrl}${permalink ?? ''}`;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    ...(description ? {description} : {}),
    url: absoluteUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl,
    },
    image: 'https://memfit.ai/img/memfit-ai-concept.jpg',
    publisher: {
      '@type': 'Organization',
      name: 'Memfit AI',
      url: 'https://memfit.ai',
      logo: {
        '@type': 'ImageObject',
        url: 'https://memfit.ai/img/logo.png',
      },
    },
    // 作者使用组织实体（Yaklang 团队），而非个人 git handle
    author: {
      '@type': 'Organization',
      name: 'Yaklang Team',
      url: 'https://yaklang.com',
    },
  };

  if (lastUpdatedAt) {
    // lastUpdatedAt 由 Docusaurus 提供，单位为毫秒
    const iso = new Date(lastUpdatedAt).toISOString();
    schema.dateModified = iso;
    schema.datePublished = iso;
  }

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Head>
  );
}

export default function DocItemFooter(): ReactNode {
  const {metadata} = useDoc();
  const {editUrl, lastUpdatedAt, lastUpdatedBy, tags} = metadata;

  const canDisplayTagsRow = tags.length > 0;
  const canDisplayEditMetaRow = !!(editUrl || lastUpdatedAt || lastUpdatedBy);

  const canDisplayFooter = canDisplayTagsRow || canDisplayEditMetaRow;

  return (
    <>
      <TechArticleJsonLd />
      {canDisplayFooter && (
        <footer
          className={clsx(ThemeClassNames.docs.docFooter, 'docusaurus-mt-lg')}>
          {canDisplayTagsRow && (
            <div
              className={clsx(
                'row margin-top--sm',
                ThemeClassNames.docs.docFooterTagsRow,
              )}>
              <div className="col">
                <TagsListInline tags={tags} />
              </div>
            </div>
          )}
          {canDisplayEditMetaRow && (
            <EditMetaRow
              className={clsx(
                'margin-top--sm',
                ThemeClassNames.docs.docFooterEditMetaRow,
              )}
              editUrl={editUrl}
              lastUpdatedAt={lastUpdatedAt}
              lastUpdatedBy={lastUpdatedBy}
            />
          )}
        </footer>
      )}
    </>
  );
}
