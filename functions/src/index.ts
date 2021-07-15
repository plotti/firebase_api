import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
import * as bodyParser from "body-parser";

admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: functions.config().private.key.replace(/\\n/g, '\n'),
    projectId: functions.config().project.id,
    clientEmail: functions.config().client.email
  }),
  databaseURL: 'https://oneplus-data.firebaseio.com'
})

// Express
import * as express from 'express';
import * as cors from 'cors';

// Database
const db = admin.firestore()

// Multi Route ExpressJS HTTP Function
const app = express();
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

export const api = functions.https.onRequest(main);

app.post('/add_event', async (req, res) => {
  try {
    const newDoc = await db.collection("events").add(JSON.parse(req.body))
    res.status(200).send(`Created a new event: ${newDoc.id}`);
  } catch (error) {
    res.status(400).send(`Something went wrong. Contact the chmedia data team.`)
  }
});


export {app};
