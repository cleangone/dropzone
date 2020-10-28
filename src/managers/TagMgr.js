export const TagCategory = {
   PRIMARY: 'Primary',
}

export class TagMgr {   
   static hasTag(container, tag) { return TagMgr.getId(container, tag.category) == tag.id }
   static primaryId(container)   { return TagMgr.getId(container,   TagCategory.PRIMARY) }	
   static primaryName(container) { return TagMgr.getName(container, TagCategory.PRIMARY) }	
   
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

   static getNameToTagMap(tags) { 
      let tagMap = new Map()
      for (var tag of tags) {
         tagMap.set(tag.name, tag)
      }
      return tagMap
   }

   static getNames(tags) { 
      const sortedTags = Array.from(tags)
      sortedTags.sort((a, b) => (a.sortName < b.sortName) ? -1 : 1)
   
      let names = []
      for (var tag of sortedTags ) {
         names.push(tag.name)
      }
      return names
   }
}
