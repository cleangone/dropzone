
export const TagCategory = {
   ARTIST: 'Artist',
}

export class TagMgr {   
   static artist(container) { return TagMgr.getName(container, TagCategory.ARTIST) }	
   static getName(container, key) { 
      if (!container.tagNames) { return "" }
      return container.tagNames[key] ? container.tagNames[key] : "" 
   }
   
   static setTag(container, tag) { 
      if (!container.tagIds) { container.tagIds = {} }
      container.tagIds[tag.category] = tag.id
      
      if (!container.tagNames) { container.tagNames = {} }
      container.tagNames[tag.category] = tag.name
   }
}
