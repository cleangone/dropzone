
export const TagCategory = {
   ARTIST: 'Artist',
}

export class Tag {   
   static artist(container) { return Tag.getValue(container, TagCategory.ARTIST) }	
   static setArtist(container, artist) { return Tag.setValue(container, TagCategory.ARTIST, artist) }	
 
   static getValue(container, key) { 
      if (!container.tags) { return "" }
      return container.tags[key] ? container.tags[key] : "" 
   }
   
   static setValue(container, key, value) { 
      if (!container.tags) { container.tags = {} }
      container.tags[key] = value
   }
}
