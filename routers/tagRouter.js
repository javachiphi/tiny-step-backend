const express = require('express')
const router = express.Router()

class tagRouter {
    constructor(controller) {
        this.controller = controller; 
    }

    routes(){

        //Basic tag CRUD 
        router.get(`/`, this.controller.getAll.bind(this.controller));
        router.post(`/`, this.controller.createOne.bind(this.controller));
        
        router.get('/:tagId',this.controller.getOne.bind(this.controller));
        router.put('/:tagId',this.controller.updateOne.bind(this.controller));
        router.delete('/:tagId',this.controller.deleteOne.bind(this.controller));


        //User-tags association 
        router.get(`/users/:userId`, this.controller.getUserTags.bind(this.controller));
        router.post(`/users/:userId/tags`, this.controller.addUserTags.bind(this.controller));
        router.delete('/users/:userId/:tagId',this.controller.removeUserTag.bind(this.controller));
        //  user can 'archive' tags (in future)

        //Entry-tags association
        router.get('/entries/:entryId', this.controller.getEntryTags.bind(this.controller));
        router.post('/entries/:entryId', this.controller.addEntryTag.bind(this.controller));    
        router.delete('/entries/:entryId/:tagId', this.controller.removeEntryTag.bind(this.controller));




        
          
        return router;


    }

    //only create via userId/tags [1]  categoryId/tags
//entries/:categoryId/tags
//users/:userId/

    //only user creates tags through api 
    //a user add to tags (multiple) onboarding 
    // a user can remove tag from its user-tag junction table 

}



module.exports = tagRouter