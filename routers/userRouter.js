const express = require('express')
const router = express.Router()

class userRouter {
    constructor(controller) {
        this.controller = controller; 
    }

    routes(){
          router.get(`/`, this.controller.getAll.bind(this.controller));
          router.post(`/`, this.controller.createOne.bind(this.controller));
          
          router.get('/:userId',this.controller.getOne.bind(this.controller));
          router.put('/:userId',this.controller.updateOne.bind(this.controller));
          router.delete('/:userId',this.controller.deleteOne.bind(this.controller));

        return router;


    }

    
}



module.exports = userRouter