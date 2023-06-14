import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
//   {
//     label: 'Principal',
//     isTitle: true
//   },
//   {
//     label: 'Dashboard',
//     icon: 'home',
//     link: '/dashboard'
//   },
  {
    label: 'Busquedas',
    isTitle: true
  },
  {
    label: 'Productos',
    icon: 'codesandbox',
    link: '/search/products'
  },
  {
    label: 'Configuración',
    isTitle: true
  },
  {
    label: 'Productos',
    icon: 'box',
    subItems: [
      {
        label: 'Productos',
        link: '/masters/products',
      },
      {
        label: 'Tipos de Productos',
        link: '/masters/typeproducts',
      }
    ]
  },
  {
    label: 'Seguridad',
    icon: 'lock',
    subItems: [
      {
        label: 'Usuarios',
        link: '/security/users',
      },
      {
        label: 'Vendedores',
        link: '/security/sellers',
      },
      {
        label: 'Zonas',
        link: '/security/zones',
      },
      {
        label: 'Logs',
        link: '/security/logs',
      }
    ]
  }
];
