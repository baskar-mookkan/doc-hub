import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Documentation Hub',
  tagline: 'Documentation Hub for all your needs',
  favicon: 'img/undraw_docusaurus_mountain.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://baskar-mookkan.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/doc-hub/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'baskar-mookkan', // Usually your GitHub org/user name.
  projectName: 'doc-hub', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    [
      '@scalar/docusaurus',
      {
        id: 'crm-api',
        label: 'Enterpriser CRM',
        route: '/api/crm',
        showNavLink: false,
        configuration: {
          sources: [
            {
              id: 'document-api',
              title: 'Document',
              url: '../openapi/eapi-document.json'
            },
            {
              id: 'contact-api',
              title: 'Contact',
              url: '../openapi/eapi-contact.yaml'
            },
          ],
          proxy: '',
          telemetry: false,
          withDefaultFonts: false,
          agent: {
            disabled: true
          },
          // Step 1: Tell Scalar not to apply its default color themes
          theme: 'none',

          // Step 2: Bridge Docusaurus Infima variables to Scalar design keys
          customCss: `
            :root {
              --scalar-color-primary: var(--ifm-color-primary);
              --scalar-color-1: var(--ifm-font-color-base);
              --scalar-color-2: var(--ifm-color-emphasis-700);
              --scalar-color-3: var(--ifm-color-emphasis-500);
              
              --scalar-background-1: var(--ifm-background-color);
              --scalar-background-2: var(--ifm-background-surface-color);
              --scalar-border-color: var(--ifm-toc-border-color);
              
              --scalar-font: var(--ifm-font-family-base);
              --scalar-font-code: var(--ifm-font-family-monospace);
            }

            /* Ensure dark mode transitions follow Docusaurus data attributes */
            html[data-theme='dark'] {
              --scalar-color-primary: var(--ifm-color-primary);
              --scalar-color-1: var(--ifm-font-color-base);
              --scalar-background-1: var(--ifm-background-color);
              --scalar-background-2: var(--ifm-background-surface-color);
              --scalar-border-color: var(--ifm-toc-border-color);
            }
          `,
        }
      }
    ],
    [
      '@scalar/docusaurus',
      {
        id: 'erp-api',
        label: 'Enterprise ERP',
        route: '/api/erp',
        showNavLink: false,
        configuration: {
          spec: {
            url: '../openapi/eapi-insights.json',
          },
          // proxy: '',
          // telemetry: false,
          // withDefaultFonts: false,
          // agent: {
          //   disabled: true
          // },
          // Step 1: Tell Scalar not to apply its default color themes
          theme: 'none',

          // Step 2: Bridge Docusaurus Infima variables to Scalar design keys
          customCss: `
            :root {
              --scalar-color-primary: var(--ifm-color-primary);
              --scalar-color-1: var(--ifm-font-color-base);
              --scalar-color-2: var(--ifm-color-emphasis-700);
              --scalar-color-3: var(--ifm-color-emphasis-500);
              
              --scalar-background-1: var(--ifm-background-color);
              --scalar-background-2: var(--ifm-background-surface-color);
              --scalar-border-color: var(--ifm-toc-border-color);
              
              --scalar-font: var(--ifm-font-family-base);
              --scalar-font-code: var(--ifm-font-family-monospace);
            }

            /* Ensure dark mode transitions follow Docusaurus data attributes */
            html[data-theme='dark'] {
              --scalar-color-primary: var(--ifm-color-primary);
              --scalar-color-1: var(--ifm-font-color-base);
              --scalar-background-1: var(--ifm-background-color);
              --scalar-background-2: var(--ifm-background-surface-color);
              --scalar-border-color: var(--ifm-toc-border-color);
            }
          `,
        }
      }
    ],
    [
      require.resolve('docusaurus-lunr-search'),
      {
        languages: ['en'],
      },
    ],
  ],
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/baskar-mookkan/doc-hub/tree/main',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/baskar-mookkan/doc-hub/tree/main',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Enterprise Documentation Hub',
      logo: {
        alt: 'Enterprise Documentation Hub',
        src: 'img/undraw_docusaurus_mountain.svg',
        srcDark: 'img/undraw_docusaurus_mountain.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'demoSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'dropdown',
          label: 'API Reference',
          position: 'left',
          items: [
            { label: 'Enterprise CRM', to: '/api/crm' },
            { label: 'Enterprise ERP', to: '/api/erp' },
          ],
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://baskar-mookkan.github.io/doc-hub/blog',
          label: 'Blog',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'Enterprise Documentation Hub',
        src: 'img/undraw_docusaurus_mountain.svg',
        href: 'https://github.com/baskar-mookkan/',
        width: 140,
      },
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting started',
              to: '/docs',
            },
            {
              label: 'Blog',
              to: '/blog',
            },
          ],
        },
        {
          title: 'My Company',
          items: [
            {
              label: 'About Us',
              href: 'https://github.com/baskar-mookkan/doc-hub',
            },
            {
              label: 'Products',
              href: 'https://github.com/baskar-mookkan/',
            },
            {
              label: 'Contact',
              href: 'https://github.com/baskar-mookkan/',
            },
          ],
        },
        {
          title: 'Connect',
          items: [
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/in/baskarmookkan/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/baskar-mookkan/doc-hub',
            },
          ],
        },
      ],
      copyright: `Built with ❤️`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
