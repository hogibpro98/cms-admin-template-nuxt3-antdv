const baseURL = '_nuxt/assets/images';
const Menu = [
  {
    name: 'dashboard',
    icon: `${baseURL}/icon_group.png`,
    path: 'dashboard',
    children: [
      {
        name: 'employees1',
        icon: `${baseURL}/employees1.png`,
        path: 'employees1',
        children: [
          {
            name: 'employees11',
            icon: `${baseURL}/employees1.png`,
            path: 'employees11'
          }
        ]
      }
    ]
  },
  {
    name: 'employees',
    icon: `${baseURL}/employees.png`,
    path: 'employees'
  },
  {
    name: 'unmatched_employees',
    icon: `${baseURL}/icon_unmathed.png`,
    path: 'unmatched-employees'
  },
  {
    name: 'settings',
    icon: `${baseURL}/icon_setting.png`,
    path: 'settings'
  }
];

export default Menu;
