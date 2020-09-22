
export const TagCategory = {
   ARTIST: 'Artist',
}

export class TagMgr {   

   static hasTag(container, tag) { return TagMgr.getId(container, tag.category) == tag.id }

   static artist(container) { return TagMgr.getName(container, TagCategory.ARTIST) }	

   static tagsWithLinks(tags) { 
      const tagsWithLinks = []
      tags.forEach(tag => { if (tag.showLink) { tagsWithLinks.push(tag) } })
      return tagsWithLinks
   }

   static getId(container, category) { 
      if (!container.tagIds) { return "" }
      return container.tagIds[category] ? container.tagIds[category] : ""
   }

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
