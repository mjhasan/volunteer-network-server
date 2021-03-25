const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()

const app = express()
const port = 4000
app.use(cors())
app.use(bodyParser.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qrsky.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const registerCollection = client.db("social-network").collection("register");
    const eventsCollection = client.db("social-network").collection("events");
    console.log('Database Connected');

    // Volunteer registration

    app.post('/register', (req, res) => {
        const registerInfo = req.body;
        registerCollection.insertOne(registerInfo)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
    app.get('/registerList', (req, res) => {
        registerCollection.find({ email: req.query.email })
            .toArray((err, doc) => {
                res.send(doc)
            })
    })

    app.delete('/delete/:id', (req, res) => {
        registerCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })

    app.get('/allRegisterList', (req, res) => {
        registerCollection.find({})
            .toArray((err, doc) => {
                res.send(doc)
            })
    })

    app.delete('/trash/:id', (req, res) => {
        registerCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })

    // Add and load events

    app.post('/addEvents', (req, res) => {
        const events = req.body;
        console.log(events);
        eventsCollection.insertOne(events)
            .then(result => {
                console.log(result)
                res.send(result.insertedCount > 0)
            })
    })
    app.get('/allEvents', (req, res) => {
        eventsCollection.find({})
            .toArray((err, doc) => {
                res.send(doc)
            })
    })
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || 4000)