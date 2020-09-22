
import { date } from 'quasar'

export function getStartDateText(startDate) { 
   if (!startDate) { return "date not set" }

   let datetime = new Date(startDate.seconds * 1000)
   return formatWithTz(datetime, 'ddd, MMM D, h:mm a')
}

export function formatDateTimeOptYear(theDate) {
   if (!theDate) { return "" }
   let datetime = new Date(theDate.seconds * 1000)
   return date.formatDate(datetime, optYearFormat(datetime))
}

export function formatDateTimeOptYearTz(theDate) {
   if (!theDate) { return "" }
   let datetime = new Date(theDate.seconds * 1000)
   return formatWithTz(datetime, optYearFormat(datetime))
}

function optYearFormat(datetime) { return isThisYear(datetime) ? 'MMM D, h:mm a' : 'MMM D, YYYY h:mm a' }
function isThisYear(datetime) { return new Date().getYear() == datetime.getYear() }
function formatWithTz(datetime, format) { return date.formatDate(datetime, format) + " " + localTimezone() }

export function localTimezone() {
   let dateString = new Date(Date.now()).toString()
   let timezone = dateString.slice(dateString.indexOf("("), dateString.indexOf(")") + 1)
   if (timezone == "(Eastern Daylight Time)") { timezone = "(EDT)" }
   else if (timezone == "(Pacific Daylight Time)") { timezone = "(PDT)" }
   return timezone
}

