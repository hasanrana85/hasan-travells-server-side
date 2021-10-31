const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1i5y6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
        const database = client.db('hasan_Travels');
        const serviceCollection = database.collection('services');
        const visitorCollection = database.collection('visitor');

        //GET Services
        app.get('/services', async(req, res) =>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // Get single api
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })

        // POST API
        app.post('/service', async(req, res) =>{
            const service = req.body;
            console.log('hit the post api', service);

            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })

        // Post Api Vistor
        app.post('/visitor', async(req, res) =>{
            const visitor = req.body;
            console.log('hitting the post', visitor);

            const result = await visitorCollection.insertOne(visitor);
            res.json(visitor);
        })

        //GET Visitor
        app.get('/visitor', async(req, res) =>{
            const cursor = visitorCollection.find({});
            const visitors = await cursor.toArray();
            res.json(visitors);
        })

        // Delete Visitor
        app.delete('/visitor/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await visitorCollection.deleteOne(query);
            console.log('deleting user with id', result);
            res.json(result);
        })
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('hasan travels is running');
})

app.listen(port, () =>{
    console.log('server running at port', port);
})