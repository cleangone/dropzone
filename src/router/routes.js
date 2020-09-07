import { Route } from 'src/utils/Constants.js';

const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '',               component: () => import('pages/HomePage.vue') },
      { path: '/auth/login',    component: () => import('pages/Auth/LoginRegisterPage.vue'),  name: Route.LOGIN   },
      { path: '/auth/register', component: () => import('pages/Auth/LoginRegisterPage.vue'),  name: Route.REGISTER },
      { path: '/auth/forgot',   component: () => import('pages/Auth/ForgotPasswordPage.vue'), name: Route.FORGOT },
      { path: '/drop/:dropId',  component: () => import('pages/DropPage.vue'),                name: Route.DROP, },
      { path: '/item/:itemId',  component: () => import('pages/ItemPage.vue'),                name: Route.ITEM, },      
      { path: '/account',       component: () => import('pages/User/AccountPage.vue') },
      { path: '/favorites',     component: () => import('pages/User/FavoritesPage.vue') },
      { path: '/actions',       component: () => import('pages/User/ActionsPage.vue') },
      { path: '/invoices',      component: () => import('pages/User/InvoicesPage.vue') },
      { path: '/admin/drops',         component: () => import('pages/Admin/DropsAdminPage.vue') },      
      { path: '/admin/items/:dropId', component: () => import('pages/Admin/ItemsAdminPage.vue') },      
      { path: '/admin/bids/:itemId',  component: () => import('pages/Admin/BidsAdminPage.vue') },    
      { path: '/admin/invoices',      component: () => import('pages/Admin/InvoicesAdminPage.vue') },  
      { path: '/admin/settings',      component: () => import('pages/Admin/SettingsPage.vue') },  
      { path: '/admin/users',         component: () => import('pages/Admin/UsersAdminPage.vue') },  
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
