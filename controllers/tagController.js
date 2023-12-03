const BaseController = require("./baseController");

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


class tagController extends BaseController {
    constructor(){
        super(); 
    }

    getOne(req, res){
        res.send('get single tag');
    }

   updateOne(req, res){
        res.send('update tag');
    }

    deleteOne(req, res){
        res.send('delete tag');
    }
}

module.exports = tagController;