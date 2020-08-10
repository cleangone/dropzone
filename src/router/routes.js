
const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '',          component: () => import('pages/HomePage.vue') },
      { path: '/auth',     component: () => import('pages/AuthPage.vue') },
      { path: '/drop/:dropId', name: 'DropPage', component: () => import('pages/DropPage.vue') },
      { path: '/account',  component: () => import('pages/User/AccountPage.vue') },
      { path: '/actions',  component: () => import('pages/User/ActionsPage.vue') },
      { path: '/checkout', component: () => import('pages/User/CheckoutPage.vue') },
      { path: '/users',    component: () => import('pages/Admin/UsersAdminPage.vue') },
      { path: '/drops',    component: () => import('pages/Admin/DropsAdminPage.vue') },      
      { path: '/dropitems/:dropId',        component: () => import('pages/Admin/DropItemsAdminPage.vue') },      
      { path: '/bids/:dropId/:dropItemId', component: () => import('pages/Admin/BidsAdminPage.vue') },      
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
