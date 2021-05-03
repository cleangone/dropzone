import { Route } from 'src/utils/Constants.js';

const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '',                      component: () => import('pages/HomePage.vue'),                 name: Route.HOME },
      { path: '/auth/login/:route',    component: () => import('pages/Auth/LoginRegisterPage.vue'),   name: Route.LOGIN },
      { path: '/auth/register',        component: () => import('pages/Auth/LoginRegisterPage.vue'),   name: Route.REGISTER },
      { path: '/auth/forgot',          component: () => import('pages/Auth/ForgotPasswordPage.vue') },
      { path: '/drop/:id',             component: () => import('pages/DropPage.vue'),                 name: Route.DROP },
      { path: '/item/:itemId',         component: () => import('pages/ItemPage.vue'),                 name: Route.ITEM },      
      { path: '/category/:id/',        component: () => import('pages/CategoryPage.vue') },      
      { path: '/category/:id/:tagId',  component: () => import('pages/CategoryPage.vue'),             name: Route.CATEGORY },      
      { path: '/bids/:itemId',         component: () => import('pages/BidsPage.vue') },      
      { path: '/recent',               component: () => import('pages/RecentItemsPage.vue'),          name: Route.RECENT },
      { path: '/cart',                 component: () => import('pages/CartPage.vue'),                 name: Route.CART },
      { path: '/current',              component: () => import('pages/User/CurrentActivityPage.vue'), name: Route.CURRENT },
      { path: '/account',              component: () => import('pages/User/AccountPage.vue') },
      { path: '/favorites',            component: () => import('pages/User/FavoritesPage.vue'),       name: Route.FAVORITE },
      { path: '/actions',              component: () => import('pages/User/ActionsPage.vue') },
      { path: '/invoices',             component: () => import('pages/User/InvoicesPage.vue') },
      { path: '/admin/todo',           component: () => import('pages/Admin/ToDoAdminPage.vue'),      name: Route.TODO },      
      { path: '/admin/drops',          component: () => import('pages/Admin/DropsAdminPage.vue') },      
      { path: '/admin/dropitems/:id',  component: () => import('pages/Admin/DropItemsAdminPage.vue') },      
      { path: '/admin/reqs/:itemId/:route', component: () => import('pages/Admin/PurchaseReqsAdminPage.vue') },      
      { path: '/admin/categories',     component: () => import('pages/Admin/CategoriesAdminPage.vue') },      
      { path: '/admin/catitems/:id',   component: () => import('pages/Admin/CategoryItemsAdminPage.vue') },      
      { path: '/admin/images/:itemId', component: () => import('pages/Admin/ItemImagesPage.vue') },      
      { path: '/admin/users',          component: () => import('pages/Admin/UsersAdminPage.vue') },  
      { path: '/admin/invoices',       component: () => import('pages/Admin/InvoicesAdminPage.vue') },  
      { path: '/admin/tags',           component: () => import('pages/Admin/TagsAdminPage.vue') },  
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
