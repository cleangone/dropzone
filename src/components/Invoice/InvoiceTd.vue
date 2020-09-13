<template>
   <span>
      <span v-if="col.name == 'tracking'"> 
         {{ row.carrier }}
         <a v-if="hasTrackingLink(row)" :href="getTrackingLink(row)" target=”_blank”>{{ row.tracking }}</a>
         <span v-else>{{ row.tracking }}</span>
      </span>
      <span v-else> {{ col.value }} </span>   
   </span>
</template>

<script>
	export default {
      props: ['row', 'col'],
		methods: {
         hasTrackingLink(row) { 
            return (row.tracking && row.tracking.length > 5 && row.carrier == "USPS Priority") 
         },  
         getTrackingLink(row) {  
            if (row.carrier = "USPS Priority") { return "https://tools.usps.com/go/TrackConfirmAction?tLabels=" + row.tracking }
            else { return ""}
         },                     
		}
	}

</script>