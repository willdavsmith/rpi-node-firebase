require('dotenv').config()
const express = require('express')
const firebase = require('firebase/app')
require('firebase/database')
const bodyParser = require('body-parser')
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

app.post('/upload', (req, res) => {
    console.log(req.body.count)
    firebaseWrite(req.body.count)
    res.sendStatus(200)
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
