const BaseController = require("./baseController");


class userController extends BaseController {
    constructor(){
        super(); 
    }

    getOne(req, res){
        res.send('get single user');
    }

    createOne(req, res){
        res.send('create single user');
    }


   updateOne(req, res){
        res.send('update user');
    }

    deleteOne(req, res){
        res.send('delete user');
    }
}

module.exports = userController;