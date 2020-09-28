import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const createCustomClaimOnBusinessCreationFunction = functions
  .region('europe-west1')
  .firestore.document('business/{businessId}')
  .onCreate(async (snapshot, context) => {
    console.log(context);
    const ownerId = snapshot.data().ownerId || null;
    console.log(
      await admin.auth().setCustomUserClaims(ownerId, {
        isBusinessOwner: true,
        businessId: context.params.businessId,
      }),
    );
    await snapshot.ref.set({ hello: 'pene' }, { merge: true });
  });

// exports.addDefaultUserRole = use-cases.auth.user().onCreate((user) => {
//   let uid = user.uid;
//
//   //add custom claims
//   return admin
//     .auth()
//     .setCustomUserClaims(uid, {
//       isBusinessAdmin: true,
//     })
//     .then(() => {
//       //Interesting to note: we need to re-fetch the userRecord, as the user variable **does not** hold the claim
//       return admin.auth().getUser(uid);
//     })
//     .then((userRecord) => {
//       console.log(uid);
//       console.log(userRecord.customClaims.isAdmin);
//       return null;
//     });
// });
