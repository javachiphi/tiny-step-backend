const express = require('express')
const app = express()
const port = 3001
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const cors = require('cors');

const db = require('./db/models/index')
const { entry, tag, user } = db;
app.use(cors({origin: 'http://localhost:3000'}))



const EntryRouter = require('./routers/entryRouter.js')
const TagRouter = require('./routers/tagRouter.js')
const UserRouter = require('./routers/userRouter.js')
const EntryController = require('./controllers/entryController.js')
const TagController = require('./controllers/tagController.js')
const UserController = require('./controllers/userController.js')


//entry 
const entryController = new EntryController(entry, user, tag)
const entryRouter = new EntryRouter(entryController).routes()
app.use('/entries', entryRouter);


//tag
const tagController = new TagController(tag, user, entry)
const tagRouter = new TagRouter(tagController).routes()
app.use('/tags', tagRouter);


//user 
const userController = new UserController(user);
const userRouter = new UserRouter(userController).routes();
app.use('/users', userRouter);


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