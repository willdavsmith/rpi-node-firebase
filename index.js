require('dotenv').config()
const express = require('express')
const firebase = require('firebase/app')
require('firebase/database')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();
app.use(bodyParser.urlencoded({ extended: true }))

firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
}

firebase.initializeApp(firebaseConfig);

app.get('/', (req, res) => {
    firebaseRead().then(r => res.send(`${r["count"]}`))
})

app.get('/upload', cors(), (req, res) => {
    firebaseRead().then(r => {
        firebaseWrite(Number(r["count"]) + 1)
        res.sendStatus(200)
    })
    .catch(e => {
        res.sendStatus(500)
    })
})

app.listen(process.env.port, process.env.host)
console.log(`Running on http://${process.env.host}:${process.env.port}`);

function firebaseWrite(c) {
    firebase.database().ref('items/').set({
        count: c
    })
}

async function firebaseRead() {
    return firebase.database().ref('items/').once('value').then(function (snapshot) {
        return snapshot.val()
    })
}
