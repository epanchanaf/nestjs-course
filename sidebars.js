/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  cursoSidebar: [
    'introduccion',
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
    }
  ]
};

export default sidebars;
