import React, {useEffect, useState, type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import DownloadIcon from '@site/src/components/DownloadIcon';
import Head from '@docusaurus/Head';
import styles from './downloads.module.css';

const OSS_BASE_URL = 'https://oss-qn.yaklang.com';
const VERSION_URL = `${OSS_BASE_URL}/memfit/latest/yakit-version.txt`;

interface DownloadItem {
  name: {
    en: string;
    'zh-Hans': string;
  };
  platform: string;
  arch: string;
  extension: string;
}

const DOWNLOAD_ITEMS: DownloadItem[] = [
  {name: {en: 'macOS (Apple Silicon)', 'zh-Hans': 'macOS (Apple Silicon)'}, platform: 'darwin', arch: 'arm64', extension: 'dmg'},
  {name: {en: 'macOS (Intel)', 'zh-Hans': 'macOS (Intel)'}, platform: 'darwin', arch: 'x64', extension: 'dmg'},
  {name: {en: 'macOS (Legacy Apple Silicon)', 'zh-Hans': 'macOS (Legacy Apple Silicon)'}, platform: 'darwin-legacy', arch: 'arm64', extension: 'dmg'},
  {name: {en: 'macOS (Legacy Intel)', 'zh-Hans': 'macOS (Legacy Intel)'}, platform: 'darwin-legacy', arch: 'x64', extension: 'dmg'},
  {name: {en: 'Linux (AMD64)', 'zh-Hans': 'Linux (AMD64)'}, platform: 'linux', arch: 'amd64', extension: 'AppImage'},
  {name: {en: 'Linux (ARM64)', 'zh-Hans': 'Linux (ARM64)'}, platform: 'linux', arch: 'arm64', extension: 'AppImage'},
  {name: {en: 'Linux (Legacy AMD64)', 'zh-Hans': 'Linux (Legacy AMD64)'}, platform: 'linux-legacy', arch: 'amd64', extension: 'AppImage'},
  {name: {en: 'Linux (Legacy ARM64)', 'zh-Hans': 'Linux (Legacy ARM64)'}, platform: 'linux-legacy', arch: 'arm64', extension: 'AppImage'},
  {name: {en: 'Windows (AMD64)', 'zh-Hans': 'Windows (AMD64)'}, platform: 'windows', arch: 'amd64', extension: 'exe'},
  {name: {en: 'Windows (Legacy AMD64)', 'zh-Hans': 'Windows (Legacy AMD64)'}, platform: 'windows-legacy', arch: 'amd64', extension: 'exe'},
];

const TRANSLATIONS = {
  en: {
    title: 'Download Memfit AI',
    currentVersion: 'Current version',
    platform: 'Platform',
    architecture: 'Architecture',
    download: 'Download',
    loading: 'Loading version information...',
    error: 'Failed to load version information',
  },
  'zh-Hans': {
    title: '下载 Memfit AI',
    currentVersion: '当前版本',
    platform: '平台',
    architecture: '架构',
    download: '下载',
    loading: '正在加载版本信息...',
    error: '加载版本信息失败',
  },
};

export default function DownloadsPage(): ReactNode {
  const {i18n} = useDocusaurusContext();
  const locale = i18n.currentLocale as 'en' | 'zh-Hans';
  const t = TRANSLATIONS[locale] || TRANSLATIONS.en;
  
  const [version, setVersion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        setLoading(true);
        const timestamp = Date.now();
        const response = await fetch(`${VERSION_URL}?t=${timestamp}`, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Failed to fetch version: ${response.status}`);
        }
        const versionText = await response.text();
        const trimmedVersion = versionText.trim();
        setVersion(trimmedVersion);
        setError('');
      } catch (err) {
        console.error('Failed to fetch version:', err);
        setError(t.error);
        // Fallback to a default version if fetch fails
        setVersion('1.0.0-1212');
      } finally {
        setLoading(false);
      }
    };

    fetchVersion();
  }, [t.error]);

  const getDownloadUrl = (item: DownloadItem): string => {
    if (!version) return '#';
    return `${OSS_BASE_URL}/memfit/${version}/MemfitAI-${version}-${item.platform}-${item.arch}.${item.extension}`;
  };

  // 下载页结构化数据：SoftwareApplication + Offer（GEO：Bing/AI 平台对该页此前 0 schema）
  const canonicalUrl = `https://memfit.ai${locale === 'en' ? '/en' : ''}/downloads/`;
  const downloadSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Memfit AI',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'macOS, Windows, Linux',
    image: 'https://memfit.ai/img/memfit-ai-concept.jpg',
    url: canonicalUrl,
    downloadUrl: canonicalUrl,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <Layout
      title={t.title}
      description={
        locale === 'zh-Hans'
          ? '下载 Memfit AI 客户端：macOS（Apple Silicon/Intel）、Windows 与 Linux 安装包（.dmg/.exe/.AppImage），免费开源，含当前版本号。'
          : 'Download the Memfit AI client for macOS (Apple Silicon/Intel), Windows, and Linux (.dmg/.exe/.AppImage). Free and open source, with the current version.'
      }>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(downloadSchema)}
        </script>
      </Head>
      <div className={styles.container}>
        {/* 无 JS / 有限 JS 执行的 AI 爬虫（如 Perplexity）的静态兜底 */}
        <noscript>
          {locale === 'zh-Hans'
            ? 'Memfit AI 客户端支持 macOS（Apple Silicon/Intel）、Windows 与 Linux，提供 .dmg / .exe / .AppImage 安装包，可从本页免费下载。'
            : 'The Memfit AI client supports macOS (Apple Silicon/Intel), Windows, and Linux, with .dmg / .exe / .AppImage installers available for free download from this page.'}
        </noscript>
        <div className={styles.header}>
          <Heading as="h1" className={styles.title}>
            {t.title}
          </Heading>
          {loading ? (
            <p className={styles.loading}>{t.loading}</p>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : version ? (
            <p className={styles.version}>
              {t.currentVersion}: <strong>{version}</strong>
            </p>
          ) : null}
        </div>

        {version && (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t.platform}</th>
                  <th>{t.architecture}</th>
                  <th>{t.download}</th>
                </tr>
              </thead>
              <tbody>
                {DOWNLOAD_ITEMS.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name[locale] || item.name.en}</td>
                    <td>
                      <code className={styles.code}>
                        {item.platform}-{item.arch}
                      </code>
                    </td>
                    <td>
                      <a
                        href={getDownloadUrl(item)}
                        className={styles.downloadLink}
                        download
                      >
                        <span className={styles.downloadText}>{t.download}</span>
                        <DownloadIcon className={styles.downloadIcon} width={16} height={16} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

