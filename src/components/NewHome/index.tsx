/*
 * @Author: HJH 75428400+hjhke@users.noreply.github.com
 * @Date: 2026-01-15 14:24:48
 * @LastEditors: HJH 75428400+hjhke@users.noreply.github.com
 * @LastEditTime: 2026-01-23 16:19:19
 * @FilePath: \memfit-home\src\components\NewHome\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useState, useCallback, type ReactNode } from "react";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { PageMetadata } from "@docusaurus/theme-common";
import Head from "@docusaurus/Head";
import { CONTENT, type Locale } from "./locales";
import { ThemeContext, type Theme } from "./context/ThemeContext";
import {
  Header,
  HeroSection,
  WhatIsSection,
  ProblemSection,
  ArchitectureSection,
  FeatureSection,
  NavigationBar,
  Footer,
} from "./components";

const resolveLocaleFromPathname = (pathname?: string, currentLocale?: string): Locale => {
  if (pathname === "/en" || pathname?.startsWith("/en/")) {
    return "en";
  }

  return currentLocale === "en" ? "en" : "zh-Hans";
};

export const NewHome = (): ReactNode => {
  const { i18n } = useDocusaurusContext();
  const location = useLocation();
  const [locale, setLocale] = useState<Locale>(() =>
    resolveLocaleFromPathname(location.pathname, i18n.currentLocale)
  );
  const [theme, setTheme] = useState<Theme>(() => {
    // 从 sessionStorage 读取主题，默认为 light
    if (typeof window !== 'undefined') {
      const savedTheme = sessionStorage.getItem('theme');
      return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    setLocale(resolveLocaleFromPathname(location.pathname, i18n.currentLocale));
  }, [location.pathname, i18n.currentLocale]);

  const handleToggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "en" ? "zh-Hans" : "en"));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      // 保存到 sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('theme', newTheme);
      }
      return newTheme;
    });
  }, []);

  const content = CONTENT[locale];

  // 按语言输出首页 meta（此前 /en/ 首页 title/description 为中文，en-US hreflang 形同虚设）
  const isEn = locale === "en";
  const metaTitle = isEn
    ? "Open-Source Cybersecurity AI Agent Orchestration Framework | Yaklang Ecosystem"
    : "Yaklang 生态开源网络安全 AI Agent 编排框架";
  const metaDescription = isEn
    ? "Memfit AI is the open-source cybersecurity AI Agent orchestration framework of the Yaklang ecosystem, built on a recursive dual-engine (ReAct + Plan) architecture for security automation and code auditing."
    : "Memfit AI 是 Yaklang 生态的开源网络安全 AI Agent 编排框架，采用递归式双引擎（ReAct+Plan）架构，让 AI 拥有看得见的行动力。提供记忆/RAG、工具/Forges、自旋检测等能力，面向安全自动化与代码审计场景。";
  const twitterTitle = `${metaTitle} | Memfit AI`;

  // 首页结构化数据：Organization + SoftwareApplication，提升 AI 实体识别与可发现性
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Memfit AI",
    url: "https://memfit.ai/",
    logo: "https://memfit.ai/img/logo.png",
    description:
      "Yaklang 生态的开源网络安全 AI Agent 编排框架，递归式双引擎（ReAct+Plan）让 AI 拥有看得见的行动力。",
    sameAs: [
      // 组织页是实体身份信号；yaklang.com 属父组织实体，
      // 父子关系已由 parentOrganization 表达，不再混入自身 sameAs
      "https://github.com/yaklang",
    ],
  };
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Memfit AI",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Windows, Linux",
    image: "https://memfit.ai/img/memfit-ai-concept.jpg",
    url: "https://memfit.ai/",
    downloadUrl: "https://memfit.ai/downloads/",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };
  // WebSite 实体 + SearchAction（无后端搜索，用 Google site: 站搜模板，合规替代 sitelinks search box）
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Memfit AI",
    url: "https://memfit.ai",
    inLanguage: ["zh-CN", "en-US"],
    publisher: {
      "@type": "Organization",
      name: "Memfit AI",
      url: "https://memfit.ai",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.google.com/search?q=site:memfit.ai+{search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <PageMetadata title={metaTitle} description={metaDescription} />
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(softwareSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
        {/* 补齐 og:type 与 twitter 卡片元数据（GEO：AI 平台对 OG/Twitter 完整性的解析信号） */}
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={twitterTitle} />
        <meta name="twitter:description" content={metaDescription} />
      </Head>
      <Header locale={locale} onToggleLocale={handleToggleLocale} />
      <div className={`${theme === "light" ? "bg-white theme-light" : "bg-[#171717] theme-dark"}`}>
        <main className="pt-[72px] desktop:pt-[56px] overflow-x-hidden">
          <HeroSection locale={locale} />
          <WhatIsSection locale={locale} />
          <ProblemSection locale={locale} />
          <ArchitectureSection locale={locale} />
          <NavigationBar locale={locale} allSections={content.sections}/>
            {content.sections.map((section, idx) => {
              const isLast = idx === content.sections.length - 1;
              return (
                <div
                  key={section.id}
                  className={`sticky-container desktop:hidden ${isLast ? 'h-auto' : 'h-auto desktop:h-[100vh]'}`}
                  style={{
                    position: 'relative',
                    marginBottom: 0
                  }}
                >
                  <FeatureSection 
                    section={section} 
                    index={idx} 
                    totalSections={content.sections.length}
                    allSections={content.sections}
                  />
                </div>
              );
            })}
        <Footer locale={locale} />
      </main>
    </div>
    </ThemeContext.Provider>
  );
};

export default NewHome;
