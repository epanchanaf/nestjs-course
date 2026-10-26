/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  cursoSidebar: [
    'introduccion',
    {
      type: 'category',
      label: 'Semana 0 · Fundamentos de servidor',
      items: [
        'semana-00/objetivos',
        'semana-00/sesion-00a',
        {type: 'link', label: '↗ Diapositivas · Sesión 0A', href: '/diapositivas/semana-00-sesion-00a'},
        'semana-00/sesion-00b',
        {type: 'link', label: '↗ Diapositivas · Sesión 0B', href: '/diapositivas/semana-00-sesion-00b'},
        'semana-00/sesion-00c',
        {type: 'link', label: '↗ Diapositivas · Sesión 0C', href: '/diapositivas/semana-00-sesion-00c'},
        'semana-00/actividad-diagnostica'
      ]
    },
    {
      type: 'category',
      label: 'Semana 1 · Fundamentos',
      items: [
        'semana-01/objetivos',
        'semana-01/sesion-01',
        {type: 'link', label: '↗ Diapositivas · Sesión 1', href: '/diapositivas/semana-01-sesion-01'},
        'semana-01/sesion-02',
        {type: 'link', label: '↗ Diapositivas · Sesión 2', href: '/diapositivas/semana-01-sesion-02'},
        'semana-01/proyecto-integrador'
      ]
    },
    {
      type: 'category',
      label: 'Semana 2 · REST y routing',
      items: [
        'semana-02/objetivos',
        'semana-02/sesion-03',
        {type: 'link', label: '↗ Diapositivas · Sesión 3', href: '/diapositivas/semana-02-sesion-03'},
        'semana-02/sesion-04',
        {type: 'link', label: '↗ Diapositivas · Sesión 4', href: '/diapositivas/semana-02-sesion-04'},
        'semana-02/proyecto-integrador'
      ]
    },
    {
      type: 'category',
      label: 'Semana 3 · DTOs y validación',
      items: [
        'semana-03/objetivos',
        'semana-03/sesion-05',
        {type: 'link', label: '↗ Diapositivas · Sesión 5', href: '/diapositivas/semana-03-sesion-05'},
        'semana-03/sesion-06',
        {type: 'link', label: '↗ Diapositivas · Sesión 6', href: '/diapositivas/semana-03-sesion-06'},
        'semana-03/proyecto-integrador'
      ]
    },
    {
      type: 'category',
      label: 'Semana 4 · Persistencia',
      items: [
        'semana-04/objetivos',
        'semana-04/sesion-07',
        {type: 'link', label: '↗ Diapositivas · Sesión 7', href: '/diapositivas/semana-04-sesion-07'},
        'semana-04/sesion-08',
        {type: 'link', label: '↗ Diapositivas · Sesión 8', href: '/diapositivas/semana-04-sesion-08'},
        'semana-04/proyecto-integrador'
      ]
    },
    {
      type: 'category',
      label: 'Semana 5 · Relaciones persistentes',
      items: [
        'semana-05/objetivos',
        'semana-05/sesion-09',
        {type: 'link', label: '↗ Diapositivas · Sesión 9', href: '/diapositivas/semana-05-sesion-09'},
        'semana-05/sesion-10',
        {type: 'link', label: '↗ Diapositivas · Sesión 10', href: '/diapositivas/semana-05-sesion-10'},
        'semana-05/proyecto-integrador'
      ]
    },
    {
      type: 'category',
      label: 'Semana 6 · Consultas de datos',
      items: [
        'semana-06/objetivos',
        'semana-06/sesion-11',
        {type: 'link', label: '↗ Diapositivas · Sesión 11', href: '/diapositivas/semana-06-sesion-11'},
        'semana-06/sesion-12',
        {type: 'link', label: '↗ Diapositivas · Sesión 12', href: '/diapositivas/semana-06-sesion-12'},
        'semana-06/proyecto-integrador'
      ]
    },
    {
      type: 'category',
      label: 'Semana 7 · Configuración por ambientes',
      items: [
        'semana-07/objetivos',
        'semana-07/sesion-13',
        {type: 'link', label: '↗ Diapositivas · Sesión 13', href: '/diapositivas/semana-07-sesion-13'},
        'semana-07/sesion-14',
        {type: 'link', label: '↗ Diapositivas · Sesión 14', href: '/diapositivas/semana-07-sesion-14'},
        'semana-07/proyecto-integrador'
      ]
    },
    {
      type: 'category',
      label: 'Semana 8 · Autenticación inicial',
      items: [
        'semana-08/objetivos',
        'semana-08/sesion-15',
        {type: 'link', label: '↗ Diapositivas · Sesión 15', href: '/diapositivas/semana-08-sesion-15'},
        'semana-08/sesion-16',
        {type: 'link', label: '↗ Diapositivas · Sesión 16', href: '/diapositivas/semana-08-sesion-16'},
        'semana-08/proyecto-integrador'
      ]
    },
    {
      type: 'category',
      label: 'Semana 9 · Protección con JWT',
      items: [
        'semana-09/objetivos',
        'semana-09/sesion-17',
        {type: 'link', label: '↗ Diapositivas · Sesión 17', href: '/diapositivas/semana-09-sesion-17'},
        'semana-09/sesion-18',
        {type: 'link', label: '↗ Diapositivas · Sesión 18', href: '/diapositivas/semana-09-sesion-18'},
        'semana-09/proyecto-integrador'
      ]
    },
    {
      type: 'category',
      label: 'Semana 10 · Autorización y seguridad',
      items: [
        'semana-10/objetivos',
        'semana-10/sesion-19',
        'semana-10/sesion-20',
        'semana-10/proyecto-integrador'
      ]
    },
    {
      type: 'category',
      label: 'Semana 11 · Arquitectura y componentes transversales',
      items: [
        'semana-11/objetivos',
        'semana-11/sesion-21',
        'semana-11/sesion-22',
        'semana-11/proyecto-integrador'
      ]
    },
    {
      type: 'category',
      label: 'Semana 12 · Pruebas unitarias',
      items: [
        'semana-12/objetivos',
        'semana-12/sesion-23',
        'semana-12/sesion-24',
        'semana-12/proyecto-integrador'
      ]
    }
  ]
};

export default sidebars;
