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
        router.get(`/`, this.controller.getSystemTags.bind(this.controller));
        router.post(`/`, jwtCheck, this.controller.createOne.bind(this.controller));
        
        router.get('/:tagId',this.controller.getOne.bind(this.controller));
        router.put('/:tagId',this.controller.updateOne.bind(this.controller));
        router.delete('/:tagId',this.controller.deleteOne.bind(this.controller));
        

        //send user selected 
        
        //User-tags association 
        router.get(`/users/my`, jwtCheck, this.controller.getUserTags.bind(this.controller));
        router.post(`/users/my`, jwtCheck, this.controller.addUserTags.bind(this.controller));
        router.delete(`/users/my`, jwtCheck, this.controller.removeUserTags.bind(this.controller));
        // router.delete('/users/:userId/:tagId',this.controller.removeUserTag.bind(this.controller));
        //  user can 'archive' tags (in future)

        //Entry-tags association
        router.get('/entries/:entryId', this.controller.getEntryTags.bind(this.controller));
        router.post('/entries/:entryId', this.controller.addEntryTag.bind(this.controller));    
        router.delete('/entries/:entryId/:tagId', this.controller.removeEntryTag.bind(this.controller));

        return router;


    }

}



module.exports = tagRouter