const express = require('express')
const router = express.Router()

class tagRouter {
    constructor(controller) {
        this.controller = controller; 
    }

    routes(){
          router.get(`/`, this.controller.getAll.bind(this.controller));
          router.get('/:tagId',this.controller.getOne.bind(this.controller));
          router.put('/:tagId',this.controller.updateOne.bind(this.controller));
          router.delete('/:tagId',this.controller.deleteOne.bind(this.controller));

        return router;


    }

    
}



module.exports = tagRouter