
export const ItemDisplayType = {
   MINI: 'MiniThumbnail',
   THUMB: 'Thumbnail',
   BID_THUMB: 'BidThumbnail',
   FULL: 'Full'
}

export const Route = {
   ARTIST: 'Artist',
   DROP: 'Drop',
   ITEM: 'Item',
   FORGOT: 'ForgotPassword',
   LOGIN: 'Login',
   REGISTER: 'Register',
}

export const SaleType = {
   DEFAULT: 'Default',
   BID: 'Bid',
   BUY: 'Buy',
}

export const UI = {
   CLOSE: 'close',
}

export const Versions = [
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


