import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Curso de NestJS',
  tagline: 'Construye CourseHub API paso a paso',
  favicon: 'img/favicon.svg',
  url: 'https://epanchanaf.github.io',
  baseUrl: '/nestjs-course/',
  organizationName: 'epanchanaf',
  projectName: 'nestjs-course',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  markdown: {hooks: {onBrokenMarkdownLinks: 'warn'}},
  i18n: {defaultLocale: 'es', locales: ['es']},
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {sidebarPath: './sidebars.js', routeBasePath: '/', editUrl: undefined},
        blog: false,
        theme: {customCss: './src/css/custom.css'}
      })
    ]
  ],
  themeConfig: /** @type {import('@docusaurus/preset-classic').ThemeConfig} */ ({
    navbar: {
      title: 'NestJS · CourseHub API',
      logo: {alt: 'Logotipo del curso', src: 'img/logo.svg'},
      items: [
        {type: 'docSidebar', sidebarId: 'cursoSidebar', position: 'left', label: 'Contenido'},
        {href: 'https://github.com/epanchanaf/nestjs-course', label: 'GitHub', position: 'right'}
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {title: 'Curso', items: [{label: 'Semana 1', to: '/semana-01/sesion-01'}]},
        {title: 'Recursos', items: [{label: 'Documentación oficial de NestJS', href: 'https://docs.nestjs.com/'}]}
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Curso de NestJS.`
    },
    prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula}
  })
};

export default config;
