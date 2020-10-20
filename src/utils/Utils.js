import { uid } from 'quasar'
import { format_MM_DD_YY } from './DateUtils'

export function isSwipeLeft(swipeInfo) {return swipeInfo.direction == "left" }
export function isSwipeRight(swipeInfo) {return swipeInfo.direction == "right" }

export function dollars(number) {
   return number ? "$" + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
}

export function formatPhone(phone) {
   // phone in format: 1aaaxxxnnnn
   if (!phone || phone.length != 11) { return "" }
   return "(" + phone.substring(1, 4) + ") " + phone.substring(4, 7) + " - " + phone.substring(7)
}

export function formatTightPhone(phone) {
   // phone in format: 1aaaxxxnnnn
   if (!phone || phone.length != 11) { return "" }
   return phone.substring(1, 4) + "-" + phone.substring(4, 7) + "-" + phone.substring(7)
}

export function unformatPhone(phone) {
   // phone in format: "(aaa) xxx - nnnn"
   return "1" + phone.substring(1, 4) + phone.substring(6, 9) + phone.substring(12)
}

export function dateUid() {
   return format_MM_DD_YY(new Date().getTime()) + "-" +  uid()
}

