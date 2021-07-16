"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.api = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const got_1 = require("got");
admin.initializeApp({
    credential: admin.credential.cert({
        privateKey: functions.config().private.key.replace(/\\n/g, '\n'),
        projectId: functions.config().project.id,
        clientEmail: functions.config().client.email
    }),
    databaseURL: 'https://oneplus-data.firebaseio.com'
});
// Express
const express = require("express");
const cors = require("cors");
// Database
const db = admin.firestore();
// Multi Route ExpressJS HTTP Function
const app = express();
exports.app = app;
const main = express();
// Custom Middleware
const auth = (request, response, next) => {
    if (request.query.token != "secretplotti") {
        response.status(400).send('unauthorized');
    }
    next();
};
// router
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
main.use(auth);
main.use(cors({ origin: true }));
main.use('/v1', app);
exports.api = functions.https.onRequest(main);
app.post('/add_event', async (req, res) => {
    try {
        // enter the data int db
        const newDoc = await db.collection("events").add(JSON.parse(req.body));
        // do an API call (this will be replaced by Airship once we have credentials)
        const { data } = await got_1.default.post('https://httpbin.org/anything', {
            json: {
                hello: 'world'
            }
        }).json();
        res.status(200).send(`Created a new event: ${newDoc.id} API Call result: ${data}.`);
    }
    catch (error) {
        res.status(400).send(`Something went wrong. Contact the chmedia data team.`);
    }
});
//# sourceMappingURL=index.js.map