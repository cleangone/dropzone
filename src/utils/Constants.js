
export const ItemDisplayType = {
   MINI:  'MiniThumbnail',
   THUMB: 'Thumbnail',
   BID:   'BidThumbnail',
   CART:  'CartThumbnail',
   FULL:  'Full'
}

export const Route = {
   HOME:     'Home',
   DROP:     'Drop',
   ITEM:     'Item',
   CART:     'Cart',
   CATEGORY: 'Category',
   RECENT:   'Recent Updates',
   CURRENT:  'Current Activity',
   FAVORITE: 'Favorite',
   LOGIN:    'Login',
   REGISTER: 'Register',
   FORGOT:   'Forgot Password',
   TODO:     'ToDo',
}

export const SaleType = {
   DEFAULT: 'Default',
   BID: 'Bid',
   BUY: 'Buy',
}

export const RequestProcessing = {
   AUTOMATIC: 'Automatic',
   MANUAL: 'Manual',
}

export const UI = {
   CLOSE:    'close',
   EDIT:     'edit',
   NONE:     '(none)',
   SHOW_ALL: 'all',
   SHOW_AVAILABLE: 'available',
}

export const Versions = [
   "v1.3.2  - 5/7/21",   // Fix bid countdown problem when thumb is on page twice in diff categories
   "v1.3.1  - 5/7/21",   // Fix quasar build css chunk ordering warning for ItemThumb.vue
   "v1.3.0  - 5/7/21",   // Multiple tags per item
   "v1.2.3  - 5/5/21",   // Base artist recent art on their most recent item avail date, add ItemMgr.getAvailable(...)
   "v1.2.2  - 5/4/21",   // Navigation guard for admin pages, refactor ToDo page and route creation
   "v1.2.1  - 5/3/21",   // Fix ToDo page privledge
   "v1.2.0  - 5/3/21",   // Create Admin ToDo page
   "v1.1.3  - 5/2/21",   // Show user the items they have requested, add anon users to user admin
   "v1.1.2  - 5/1/21",   // Persist cart, specify postLoginRoute
   "v1.1.1  - 4/26/21",  // Create anonymous user for purchase if not logged in
   "v1.1.0  - 4/20/21",  // Initial cart functionality
   "v1.0.0  - 4/17/21",  // Add manual processing of purchase requests
   "v0.21.10 - 11/9/20", // Remove expand icon over image for popup, larger popup
   "v0.21.9 - 11/3/20",  // Popup large image instead of expanding thumb in place
   "v0.21.8 - 10/31/20", // Debounce ItemThumb expand
   "v0.21.7 - 10/30/20", // Toggle component, use on Drop and Category pages
   "v0.21.6 - 10/30/20", // Category avatar
   "v0.21.5 - 10/29/20", // fix Recent Items sort, add expand icon for thumb mouseover, add Drop Page sort selection
   "v0.21.4 - 10/29/20", // fix hold/sold when scrolling through category items 
   "v0.21.3 - 10/29/20", // add category image
   "v0.21.2 - 10/28/20", // mouse-over thumbnail pops up larger image
   "v0.21.1 - 10/28/20", // Combine Name, Sort Name in one col, keep showCols in session
   "v0.21.0 - 10/27/20", // Category as a primary object
   "v0.20.0 - 10/26/20", // RecentItemsPage, refactor item/drop add/edit layout, item.dropId editable
   "v0.19.4 - 10/22/20", // fix TagMgr.primary bug, prev/next through favorites, curr acitivity
   "v0.19.3 - 10/21/20", // SessionMgr, Item Page prev/next inside of an artist category
   "v0.19.2 - 10/20/20", // Do not show hold/sold in item prev/next if they are not shown on drop page
   "v0.19.1 - 10/20/20", // Move drop link to above item
   "v0.19.0 - 10/20/20", // Added swipe, prev/next to Item Page 
   "v0.18.3 - 10/19/20", // Layout Drawer platform dependent show/mini
   "v0.18.2 - 10/19/20", // Site title clickable, home page mobile format
   "v0.18.1 - 10/18/20", // QuickEdit, drop/item descriptions, better control of drops on home page
   "v0.18.0 - 10/16/20", // group items by category in artist page, drop.status private, video link in artist admin list
   "v0.17.1 - 10/15/20", // mini-drawer, transparent footer
   "v0.17.0 - 10/14/20", // Add twitter, artist video,'Drops today'
   "v0.16.1 - 10/12/20", // Fixed outbid popup image
   "v0.16.0 - 10/12/20", // Initial inbound/outbound sms
   "v0.15.2 - 10/9/20",  // Add quick pricing modal, sep bind for userActions
   "v0.15.1 - 10/8/20",  // Multiple images CRUD
   "v0.15.0 - 10/7/20",  // Multiple images groundwork - item.primaryImage
   "v0.14.3 - 10/7/20",  // update CurrentActivity w showDropping/Buys/Outbid
   "v0.14.2 - 10/6/20",  // Update bid popup width
   "v0.14.1 - 10/6/20",  // Add thumbnail to Outbid Alert popup
   "v0.14.0 - 10/6/20",  // Outbid Alert
   "v0.13.1 - 10/5/20",  // handle null/blank user.nickname, click-stop on Schedule Drop
   "v0.13.0 - 10/5/20",  // BidPeriod, thumb on BidsPage, resize fullscreen image to not exceed screen width
   "v0.12.3 - 10/3/20",  // quasar upgrade, CurrentActivity shows last 24 hours, QZoom extension for fullscreen images
   "v0.11.2 - 10/1/20"   // add CurrentActivity
]

export const Colors = [ 'red', 'pink', 'orange', 'yellow', 'blue', 'green', 'indigo', 'purple' ]


