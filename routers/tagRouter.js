const express = require('express');
const router = express.Router();
const { auth } = require('express-oauth2-jwt-bearer');


const jwtCheck = auth({
    audience: 'https://diary/api',
    issuerBaseURL: 'https://dev-e417tt8aydm3bghh.us.auth0.com/',
    tokenSigningAlg: 'RS256'
  });


class tagRouter {
    constructor(controller) {
        this.controller = controller; 
    }

    routes(){

        router.get('/combined', jwtCheck, this.controller.getCombinedTags.bind(this.controller));
    
        //Basic tag CRUD 
        router.get(`/`, jwtCheck, this.controller.getTags.bind(this.controller));
        router.post(`/`, jwtCheck, this.controller.createOne.bind(this.controller));
      
        router.get('/:tagId',this.controller.getOne.bind(this.controller));
        router.put('/:tagId',this.controller.updateOne.bind(this.controller));
        router.delete('/:tagId', jwtCheck, this.controller.deleteOne.bind(this.controller));
        router.get('/:tagId/assocEntryTagsCount', jwtCheck, this.controller.getAssociatedEntryTagsCount.bind(this.controller));
        
        //only useful when we have system tags and allow user to add them
        router.post(`/users/my`, jwtCheck, this.controller.addUserTags.bind(this.controller));
        router.delete(`/users/my`, jwtCheck, this.controller.removeUserTags.bind(this.controller));
        //  user can 'archive' tags (in future)
        return router;


    }

}



module.exports = tagRouter