const express = require('express')
const app = express()
const port = 3000
const EntryRouter = require('./routers/entryRouter.js')
const TagRouter = require('./routers/tagRouter.js')
const EntryController = require('./controllers/entryController.js')
const TagController = require('./controllers/tagController.js')


const entryController = new EntryController
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
// tag  : note 

// controller and route to create 