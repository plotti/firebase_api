"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendText = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Twilio = require("twilio");
const credentials = functions.config().twilio;
const client = new Twilio(credentials.sid, credentials.token);
const db = admin.firestore();
exports.sendText = functions.https.onCall(async (data, context) => {
    const userId = context.auth.uid;
    const userRef = db.doc(`users/${userId}`);
    const userSnap = await userRef.get();
    const number = userSnap.data().phoneNumber;
    return client.messages.create({
        body: data.message,
        to: number,
        from: '+12345678901' // Your Twilio number
    });
});
//# sourceMappingURL=callable.js.map