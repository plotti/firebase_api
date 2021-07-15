"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTrend = exports.gameCount = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();
exports.gameCount = functions.firestore
    .document('games/{gameId}')
    .onCreate(async (snapshot, context) => {
    const data = snapshot.data();
    const userRef = db.doc(`users/${data.uid}`);
    const userSnap = await userRef.get();
    const userData = userSnap.data();
    return userRef.update({
        gameCount: userData.gameCount + 1
    });
});
exports.userTrend = functions.firestore
    .document('games/{gameId}')
    .onUpdate((snapshot, context) => {
    const before = snapshot.before.data();
    const after = snapshot.after.data();
    let trend;
    if (after.score >= before.score) {
        trend = 'you are improving :)';
    }
    else {
        trend = 'you are on the decline :(';
    }
    const userRef = db.doc(`users/${after.uid}`);
    return userRef.update({
        trend
    });
});
//# sourceMappingURL=firestore.js.map