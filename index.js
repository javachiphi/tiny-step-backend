const express = require('express')
const app = express()
const port = 3000

const db = require('./db/models/index')
const { entry, tag } = db;


const EntryRouter = require('./routers/entryRouter.js')
const TagRouter = require('./routers/tagRouter.js')
const EntryController = require('./controllers/entryController.js')
const TagController = require('./controllers/tagController.js')



const entryController = new EntryController(entry)
const entryRouter = new EntryRouter(entryController).routes()
app.use('/entries', entryRouter);

const tagController = new TagController
const tagRouter = new TagRouter(tagController).routes()
app.use('/tags', tagRouter);



app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })





/// sequelize to create model, database 
//entry : id, observation, solution 
// tag  : title  (provide cbt as an example)

// controller and route to create 

/// add backend testing

//reasoning/logic pattern, decision making pattern, communication pattern 
// 