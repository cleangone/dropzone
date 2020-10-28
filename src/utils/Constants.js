
export const ItemDisplayType = {
   MINI: 'MiniThumbnail',
   THUMB: 'Thumbnail',
   BID_THUMB: 'BidThumbnail',
   FULL: 'Full'
}

export const Route = {
   HOME:     'Home',
   DROP:     'Drop',
   ITEM:     'Item',
   // ARTIST:   'Artist',
   CATEGORY: 'Category',
   RECENT:   'Recent Updates',
   CURRENT:  'Current Activity',
   FAVORITE: 'Favorite',
   LOGIN:    'Login',
   REGISTER: 'Register',
   FORGOT:   'Forgot Password',
}

export const SaleType = {
   DEFAULT: 'Default',
   BID: 'Bid',
   BUY: 'Buy',
}

export const UI = {
   CLOSE: 'close',
   EDIT:  'edit',
   NONE:  '(none)',
}

export const Versions = [
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


