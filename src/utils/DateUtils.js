
import { date } from 'quasar'

export function getStartDateText(startDate) { 
   if (!startDate) { return "date not set" }

   let datetime = new Date(startDate.seconds * 1000)
   return date.formatDate(datetime, 'ddd, MMM D, h:mm a') + " " + localTimezone()
}

export function localTimezone() {
   let dateString = new Date(Date.now()).toString()
   let timezone = dateString.slice(dateString.indexOf("("), dateString.indexOf(")") + 1)
   if (timezone == "(Eastern Daylight Time)") { timezone = "(EDT)" }
   else if (timezone == "(Pacific Daylight Time)") { timezone = "(PDT)" }
   return timezone
}

