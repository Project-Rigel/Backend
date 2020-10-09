import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

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
    await snapshot.ref.set({ withClaim: true }, { merge: true });
  });
