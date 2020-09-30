import { date } from 'quasar'

export function getStartDateText(timestamp) { 
   if (!timestamp) { return "Date not set" }
   let datetime = getDate(timestamp)
   return formatWithTz(datetime, 'ddd, MMM D, h:mm a')
}

export function formatDateTimeOptYear(timestamp) {
   if (!timestamp) { return "" }
   let datetime = getDate(timestamp)
   return date.formatDate(datetime, optYearFormat(datetime))
}

export function formatDateOptYear(inputDate) {
   const millis = toMillis(inputDate)
   if (!millis) { return "" }
   let datetime = new Date(millis)
   return date.formatDate(datetime, isThisYear(datetime) ? 'MMM D' : 'MMM D, YYYY')
}

export function format_M_DD_YY(inputDate)    { return format(toMillis(inputDate), 'M/D/YY') }
export function format_MMM_D(inputDate)      { return format(toMillis(inputDate), 'MMM D') }
export function format_MMM_D_YYYY(inputDate) { return format(toMillis(inputDate), 'MMM D, YYYY') }
export function format_MM_DD_YY(inputDate)   { return format(toMillis(inputDate), 'MM-DD-YY') }

// dates are generally timstamp when created by frontend, and millis when created by backend functions
// easier to handle both than to always be standarizing
export function toMillis(inputDate) {
   if (!inputDate) { return inputDate }
   return inputDate.seconds ? inputDate.seconds*1000 : inputDate
}

export function isFutureDate(timestamp) {
   // console.log("isFutureDate", dateToFormat)
   return timestamp ? (timestamp.seconds*1000 > new Date().getTime()) : false }

export function formatDateTimeOptYearTz(timestamp) {
   if (!timestamp) { return "" }
   let datetime = getDate(timestamp)
   return formatWithTz(datetime, optYearFormat(datetime))
}

export function localTimezone() {
   let dateString = new Date(Date.now()).toString()
   let timezone = dateString.slice(dateString.indexOf("("), dateString.indexOf(")") + 1)
   if (timezone == "(Eastern Daylight Time)") { timezone = "(EDT)" }
   else if (timezone == "(Pacific Daylight Time)") { timezone = "(PDT)" }
   return timezone
}

function optYearFormat(datetime) { return isThisYear(datetime) ? 'MMM D, h:mm a' : 'MMM D, YYYY h:mm a' }
function isThisYear(datetime) { return new Date().getYear() == datetime.getYear() }
function formatWithTz(datetime, format) { return date.formatDate(datetime, format) + " " + localTimezone() }
function format(millis, format) {return millis ? date.formatDate(new Date(millis), format) : "" }

function getDate(timestamp) { return new Date(timestamp.seconds * 1000) }
