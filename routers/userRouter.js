const express = require('express')
const router = express.Router()  
const { auth } = require('express-oauth2-jwt-bearer');

const jwtCheck = auth({
    audience: 'https://diary/api',
    issuerBaseURL: 'https://dev-e417tt8aydm3bghh.us.auth0.com/',
    tokenSigningAlg: 'RS256'
  });

class userRouter {
    constructor(controller) {
        this.controller = controller; 
    }

    routes(){
      router.post(`/`, jwtCheck, this.controller.createUserIfNotExist.bind(this.controller));
      router.delete('/:userId',this.controller.deleteOne.bind(this.controller));

        return router;


    }

    
}



module.exports = userRouter