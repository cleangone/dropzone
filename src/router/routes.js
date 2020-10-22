import { Route } from 'src/utils/Constants.js';

const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '',                      component: () => import('pages/HomePage.vue'),                 name: Route.HOME },
      { path: '/auth/login',           component: () => import('pages/Auth/LoginRegisterPage.vue'),   name: Route.LOGIN },
      { path: '/auth/register',        component: () => import('pages/Auth/LoginRegisterPage.vue'),   name: Route.REGISTER },
      { path: '/auth/forgot',          component: () => import('pages/Auth/ForgotPasswordPage.vue') },
      { path: '/drop/:id',             component: () => import('pages/DropPage.vue'),                 name: Route.DROP },
      { path: '/item/:itemId',         component: () => import('pages/ItemPage.vue'),                 name: Route.ITEM },      
      { path: '/artist/:id/',          component: () => import('pages/ArtistPage.vue') },      
      { path: '/artist/:id/:catId',    component: () => import('pages/ArtistPage.vue'),               name: Route.ARTIST },      
      { path: '/bids/:itemId',         component: () => import('pages/BidsPage.vue') },      
      { path: '/current',              component: () => import('pages/User/CurrentActivityPage.vue'), name: Route.CURRENT },
      { path: '/account',              component: () => import('pages/User/AccountPage.vue') },
      { path: '/favorites',            component: () => import('pages/User/FavoritesPage.vue'),       name: Route.FAVORITE },
      { path: '/actions',              component: () => import('pages/User/ActionsPage.vue') },
      { path: '/invoices',             component: () => import('pages/User/InvoicesPage.vue') },
      { path: '/admin/drops',          component: () => import('pages/Admin/DropsAdminPage.vue') },      
      { path: '/admin/items/:dropId',  component: () => import('pages/Admin/ItemsAdminPage.vue') },      
      { path: '/admin/images/:itemId', component: () => import('pages/Admin/ItemImagesPage.vue') },      
      { path: '/admin/users',          component: () => import('pages/Admin/UsersAdminPage.vue') },  
      { path: '/admin/invoices',       component: () => import('pages/Admin/InvoicesAdminPage.vue') },  
      { path: '/admin/artists',        component: () => import('pages/Admin/Tag/ArtistAdminPage.vue') },  
      { path: '/admin/categories',     component: () => import('pages/Admin/Tag/CategoryAdminPage.vue') },  
      { path: '/admin/settings',       component: () => import('pages/Admin/SettingsPage.vue') },  
      
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
