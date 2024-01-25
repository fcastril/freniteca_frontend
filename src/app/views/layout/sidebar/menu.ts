import { constants } from "buffer";
import { MenuItem } from "./menu.model";
import { Constants } from "src/app/common/constants";

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
    label: "Busquedas",
    isTitle: true,
    roles: [
      Constants.roles.administrator,
      Constants.roles.operator,
      Constants.roles.viewer,
      Constants.roles.distribuitor,
    ],
  },
  {
    label: "Productos",
    icon: "codesandbox",
    link: "/search/products",
    roles: [
      Constants.roles.administrator,
      Constants.roles.operator,
      Constants.roles.viewer,
      Constants.roles.distribuitor
    ],
  },
  {
    label: "Configuración",
    isTitle: true,
    roles: [Constants.roles.administrator, Constants.roles.operator],
  },
  {
    label: "Productos",
    icon: "box",
    roles: [Constants.roles.administrator, Constants.roles.operator],
    subItems: [
      {
        label: "Productos",
        link: "/masters/products",
        roles: [Constants.roles.administrator, Constants.roles.operator],
      },
      {
        label: "Tipos de Productos",
        link: "/masters/typeproducts",
        roles: [Constants.roles.administrator, Constants.roles.operator],
      },
      {
        label: "Marcas",
        link: "/masters/brands",
        roles: [Constants.roles.administrator, Constants.roles.operator],
      },
      {
        label: "Aplicaciones",
        link: "/masters/applications",
        roles: [Constants.roles.administrator, Constants.roles.operator],
      },
      {
        label: "Ensambladoras",
        link: "/masters/assemblers",
        roles: [Constants.roles.administrator, Constants.roles.operator],
      },
    ],
  },
  {
    label: "Seguridad",
    icon: "lock",
    roles: [Constants.roles.administrator],
    subItems: [
      {
        label: "Usuarios",
        link: "/security/users",
        roles: [Constants.roles.administrator],
      },
      {
        label: "Vendedores",
        link: "/security/sellers",
        roles: [Constants.roles.administrator],
      },
      {
        label: "Zonas",
        link: "/security/zones",
        roles: [Constants.roles.administrator],
      },
      {
        label: "Logs",
        link: "/security/logs",
        roles: [Constants.roles.administrator],
      },
    ],
  },
];
