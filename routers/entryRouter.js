const express = require('express')
const router = express.Router({ mergeParams: true }); 
const { auth } = require('express-oauth2-jwt-bearer');


const jwtCheck = auth({
    audience: 'https://diary/api',
    issuerBaseURL: 'https://dev-e417tt8aydm3bghh.us.auth0.com/',
    tokenSigningAlg: 'RS256'
  });


class EntryRouter {
    constructor(controller) {
        this.controller = controller; 
    }

    routes(){
          router.get('/',jwtCheck, this.controller.getAllbyOneUser.bind(this.controller));
          router.get('/filtered', jwtCheck, this.controller.getFiltered.bind(this.controller));
          router.get('/groupedEntriesByTag', jwtCheck, this.controller.getGroupedEntries.bind(this.controller));
          router.post('/', jwtCheck, this.controller.createOne.bind(this.controller));
          
          router.get('/:entryId', jwtCheck, this.controller.getOne.bind(this.controller));
          router.put('/:entryId', jwtCheck, this.controller.updateOne.bind(this.controller));
          router.delete('/:entryId', jwtCheck, this.controller.deleteOne.bind(this.controller));

        return router;


    }

    
}



module.exports = EntryRouter