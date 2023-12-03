const express = require('express')
const router = express.Router({ mergeParams: true }); 

// router for CRUD /entries 
// create post /entries  then action (controller )
// update put /entry/[entryId] then action (controller)
// read get /entries then action 
// delete del entry/[entryId] then action 

// middleware that is specific to this router 

class EntryRouter {
    constructor(controller) {
        this.controller = controller; 
    }

    routes(){
          router.get('/', this.controller.getAllbyOneUser.bind(this.controller));
          router.post('/', this.controller.createOne.bind(this.controller));
          
          router.get('/:entryId',this.controller.getOne.bind(this.controller));
          router.put('/:entryId',this.controller.updateOne.bind(this.controller));
          router.delete('/:entryId',this.controller.deleteOne.bind(this.controller));

        return router;


    }

    
}



module.exports = EntryRouter