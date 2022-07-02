// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "gRPC client",
  tagline:
    "This library is intended for both JavaScript and TypeScript usage from a web browser.",
  url: "https://grpc-client.dev",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // organizationName: "facebook", // Usually your GitHub org/user name.
  projectName: "https://github.com/nixjs/grpc-client", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: [
    "docusaurus-plugin-sass",
    [
      "@docusaurus/plugin-ideal-image",
      {
        quality: 70,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
        disableInDev: false,
      },
    ],
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/nixjs/grpc-client",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/nixjs/grpc-client",
        },
        theme: {
          customCss: [require.resolve("./src/css/custom.scss")],
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: "gRPC Web Clients",
          src: "img/logo-light.svg",
          srcDark: "img/logo-dark.svg",
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Docs",
          },
          // {
          //   label: "Version",
          //   position: "right",
          //   items: [
          //     {
          //       label: "v0.0.1",
          //       to: "/docs/v0.0.1",
          //     },
          //   ],
          // },
          {
            href: "https://github.com/nixjs/grpc-client",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        copyright: `Created with 💖 by <a target="_blank" rel="noopener noreferrer" href="https://github.com/nixjs/grpc-client">@nghinv</a>. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 6,
      },
      announcementBar: {
        id: "support_us",
        content:
          '⭐ If you like, please star the project on <a target="_blank" rel="noopener noreferrer" href="https://github.com/nixjs/grpc-client">Github</a> and follow <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/nghinguyen-n623/">nghinv</a> on LinkedIn. Thanks for your support! ❤️',
        backgroundColor: "#fafbfc",
        textColor: "#091E42",
        isCloseable: true,
      },
    }),
};

module.exports = config;
