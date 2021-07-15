"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
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
app.use(express.json());
//app.use(auth);
app.use(bodyParser.text({ type: 'text/html' }));
app.use(bodyParser.text({ type: 'text/xml' }));
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: true }));
app.use('/api/v1', app);
// Custom Middleware
const auth = (request, response, next) => {
    if (request.query.token != "plotti") {
        response.status(400).send('unauthorized');
    }
    next();
};
app.post('/add_event', bodyParser.json(), async (req, res, next) => {
    console.log(req.body);
    console.log(req.body["title"]);
    console.log(req.body.title);
    try {
        await db.collection("events").add({
            title: req.body["title"],
            text: req.body.text
        });
    }
    catch (error) {
        res.status(400).send(`Contact should only contains firstName, lastName and email!!!`);
    }
});
app.get('/cat', (request, response) => {
    response.send('CAT');
});
app.get('/dog', (request, response) => {
    response.send('DOG');
});
//# sourceMappingURL=http.js.map