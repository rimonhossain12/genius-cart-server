const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
// must use capital ObjectID and require will be ObjectId;
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ygqbm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {
        await client.connect();
        // console.log('connect to database');
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //   GET single service

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific', id);
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query);
            res.json(service);

        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('Hit the post API', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
            
        })

    }
    finally {
        // await client.close()
    }


    // DELETED OPERATION WITH API
    app.delete('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }
        const result = await servicesCollection.deleteOne(query)
        // console.log('result = ',result);
        res.json(result);

    })

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Genius Server');
});

app.listen(port, () => {
    console.log('Running Genius server on port ', port);
})