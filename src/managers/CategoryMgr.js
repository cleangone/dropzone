import { Config } from 'boot/Config'

/*
   category
      id
      parentId: 0 for root categories
      name
      shortName
      sortName
      image { baseName, isHorizontal, url, filePath, thumbUrl, thumbFilePath }
*/

export const CategoryStatus = {
   PRIVATE:   'Private',
   PUBLIC:    'Public',
   AVAILABLE: 'Available',
}

export class CategoryMgr {
}
