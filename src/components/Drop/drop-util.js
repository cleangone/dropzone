import { date } from 'quasar'

export function getStartDateText(drop) { 
   if (!drop.startDate || !drop.startTime ) { return "date not set" }

   const [year, month, day] = drop.startDate.split("/")
   const [hour, min] = drop.startTime.split(":")	  
   let dropDate = new Date(year, month - 1, day, hour, min)

   return date.formatDate(dropDate, 'ddd, MMM D, h:mm a') + " (US Pacific)"
}
