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
    }
  ]
};

export default sidebars;
