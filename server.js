
// REQUIRE DEPENDENCIES
const express = require('express')
const app = express()
const cors = require('cors')
const { render } = require('ejs')
const PORT = 8000
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

app.use(cors())

// DECLARED DB VARIABLES
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'alien-species'


// MONGO CONNECT
MongoClient.connect(dbConnectionStr)
    .then(client =>{
        console.log('ITS CONNECTED, TO THE DATABASE');
        db = client.db(dbName)
    })


// SET MIDDLEWARE
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.get('/',(req,res)=>{
    db.collection('aliens').find().toArray()
    .then(data=>{
       let nameList = data.map((x)=> x.speciesName)
       console.log(nameList);
       res.render('index.ejs', {info: nameList})
    })
    .catch(error => console.error(error))
})

app.post('/api',(req,res) => {
console.log('GOT YOUR POST');
db.collection('aliens').insertOne(
    req.body
)
.then(result => {
    console.log(result);
    res.redirect('/')
})
.catch(error => console.error(error))
})

app.put('/updateEntry',(req,res) => {
    console.log(req.body);
    Object.keys(req.body).forEach(key =>{
        if(req.body[key] === null || req.body[key] === undefined || req.body[key] === ""){
            delete req.body[key]
        }
    })
    console.log(req.body);
    db.collection('aliens').findOneAndUpdate(
        {name: req.body.name},
        {
            $set: req.body
        },
    )
    .then(result =>{
        console.log(result);
        res.json('Success')
    })
    .catch(error => console.error(error))
})

app.delete('/deleteEntry', (req,res) => {
    db.collection('aliens').deleteOne(
        {name: req.body.name},
        )
        .then(result => {
            console.log('Entry Deleted')
            res.json('Entry Deleted')
        })
        .catch(error => console.error(error))
})

// SET UP LOCALHOST
app.listen(process.env.PORT || PORT, () => {
    console.log('SERVER ONLINE MAINFRAME');
})