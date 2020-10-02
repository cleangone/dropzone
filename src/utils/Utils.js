import { uid } from 'quasar'
import { format_MM_DD_YY } from './DateUtils'

export function dollars(number) {
   return number ? "$" + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
}

export function dateUid() {
   return format_MM_DD_YY(new Date().getTime()) + "-" +  uid()
}

