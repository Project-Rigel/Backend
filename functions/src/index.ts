import * as functions from 'firebase-functions';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

exports.addMessage = functions.https.onRequest((req, res) => {
   res.send({hello: "jorge"});
});
