module.exports = [
  {
    key: 'pages',
    name: 'Pages',
    icon: 'ios-paper-outline',
    child: [
      {
        key: 'other_page',
        name: 'Navigation',
        title: true
      },
      {
        key: 'dashboard',
        name: 'Dashboard',
        link: '/app',
        icon: 'ios-document-outline'
      },
      {
        key: 'algorithm',
        name: 'Algorithms Page',
        link: '/app/algorithms',
        icon: 'ios-document-outline'
      },
      {
        key: 'import',
        name: 'Import Page',
        link: '/app/import',
        icon: 'ios-document-outline'
      },
      {
        key: 'tables',
        name: 'Tables',
        link: '/app/tables',
        icon: 'ios-document-outline'
      }
      /* ,
         {
          key: 'maintenance',
          name: 'Maintenance',
          link: '/maintenance',
          icon: 'ios-build-outline'
        },
        {
          key: 'coming_soon',
          name: 'Coming Soon',
          link: '/coming-soon',
          icon: 'ios-bonfire-outline'
        }, */
    ]
  }
];
