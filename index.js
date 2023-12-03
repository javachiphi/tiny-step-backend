const express = require('express')
const app = express()
const port = 3000
const EntryRouter = require('./routers/entryRouter.js')
const BaseController = require('./controllers/baseController.js')
const EntryController = require('./controllers/entryController.js')


const entryController = new EntryController
const entryRouter = new EntryRouter(entryController).routes()

app.use('/entries', entryRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

//ROUTER 
// router for CRUD /entries 
// create post /entries  then action (controller )
// update put /entry/[entryId] then action (controller)
// read get /entries then action 
// delete del entry/[entryId] then action 


// router for CRUD /tags 
// create post /tags  then action (controller )
// update put /tag/[tagId] then action (controller)
// read get /tags then action 
// delete del tag/[tagId] then action 


//Controller 
// handle database action 

//base controller 
// get all -> list all actions 

// ENTRIES CONTROLLER  // 
// post ->  receive request body form 
// get observation, solution. 
//  and create to database 
// return the action 

// put (update) -> receive request body form 
// get observation and solution, id 
// findOne by Id, 
// update observation, solution 
// update and save to the database. 
//return action 

//delete -> receive the id
// find by id 
// delete the database 
// return success -> front says "breadcrumb" successfully deleted 


// TAGS CONTROLLER  // 
// post ->  receive request body form 
// get note, and [entry_id] from req.body or params 
// and create tag to database & junction table updated
// return the action create successfully 


// put (update) -> receive request body form 
// get tag id  and request body form (note)
// findOne by Id, 
// update and save to the database. 
//return action 

//delete -> receive the id
// find by id 
// delete the database 
// return success -> front says "breadcrumb" successfully deleted 




/// sequelize to create model, database 
//entry : id, observation, solution 
// tag  : note 

// controller and route to create 