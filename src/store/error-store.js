import { firestoreAction } from 'vuexfire'
import { firestore } from 'boot/firebase'
import { uid } from 'quasar'
import { format_MM_DD_YY } from 'src/utils/DateUtils.js'

   
/*
   error:
      id (starts with mm-dd-yy-)
      errorType: Severe
      message
*/

export const ErrorType = {
   SEVERE: 'Severe',
}

const actions = {
   createError: firestoreAction((context, error) => {
      error.createdDate = new Date(),
      error.id = format_MM_DD_YY(error.createdDate) + "-" + uid(),
      error.errorType = ErrorType.SEVERE
      
      collection().doc(error.id).set(error)
   })
}

function collection() { return firestore.collection('errors') }

export default {
	namespaced: true,
   actions
}