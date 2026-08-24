import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
// Updated for i18n support

const config: Config = {
  title: 'Memfit AI',
  tagline: 'Memfit AI 的官方网站',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: false, // Reverting to stable behavior
  },

  // Set the production url of your site here
  url: 'https://memfit.ai',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'yaklang', // Usually your GitHub org/user name.
  projectName: 'memfit-home', // Usually your repo name.

  onBrokenLinks: 'throw',

  // 统一尾斜杠：canonical / sitemap / 站内链接与最终服务的 URL 一致，
  // 避免 canonical 指向会被 301 重定向的无斜杠变体（GEO：AI 爬虫少一跳）
  trailingSlash: true,

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
    localeConfigs: {
      'zh-Hans': {
        label: '简体中文',
        htmlLang: 'zh-CN',
      },
      en: {
        label: 'English',
        htmlLang: 'en-US',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/yaklang/memfit-home/tree/main/docs/',
          // 展示文档最后更新时间与作者（基于 git 历史，用于内容新鲜度 E-E-A-T）
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/memfit-ai-concept.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Memfit AI',
      logo: {
        alt: 'Memfit AI Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'productSidebar',
          position: 'left',
          label: '技术架构',
        },
        {
          type: 'docSidebar',
          sidebarId: 'helpSidebar',
          position: 'left',
          label: '使用手册',
        },
        {
          type: 'docSidebar',
          sidebarId: 'developerSidebar',
          position: 'left',
          label: '开发者指南',
        },
        {
          to: '/downloads',
          position: 'left',
          label: '下载',
        },
        {
          type: 'localeDropdown',
          position: 'right',
          dropdownItemsAfter: [],
          dropdownItemsBefore: [],
        },
        {
          href: 'https://github.com/yaklang/memfit-home',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '技术架构',
          items: [
            {
              label: '概览',
              to: '/docs/product/overview',
            },
            {
              label: '架构设计',
              to: '/docs/product/architecture/recursive-dual-engine',
            },
            {
              label: '核心功能',
              to: '/docs/product/features/coordinator',
            },
          ],
        },
        {
          title: '使用手册',
          items: [
            {
              label: '快速开始',
              to: '/docs/help/quick-start/installation',
            },
            {
              label: '教程',
              to: '/docs/help/tutorials/ai-agent',
            },
            {
              label: '开发者指南',
              to: '/docs/help/focus-mode-dev/',
            },
          ],
        },
        {
          title: '社区',
          items: [
            {
              label: 'Yaklang',
              href: 'https://yaklang.com',
            },
            {
              label: 'SSA',
              href: 'https://ssa.to',
            },
          ],
        },
        {
          title: '更多',
          items: [
            {
              label: '关于',
              to: '/about',
            },
            {
              label: '隐私政策',
              to: '/privacy-policy',
            },
            {
              label: '使用条款',
              to: '/terms',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/yaklang/memfit-home',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Memfit AI. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
