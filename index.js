const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const db = require('./db/models/index')
const { entry, tag, user } = db;



const EntryRouter = require('./routers/entryRouter.js')
const TagRouter = require('./routers/tagRouter.js')
const EntryController = require('./controllers/entryController.js')
const TagController = require('./controllers/tagController.js')



const entryController = new EntryController(entry, user)
const entryRouter = new EntryRouter(entryController).routes()
app.use('/users/:userId/entries', entryRouter);

const tagController = new TagController(tag, user, entry)
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