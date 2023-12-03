const BaseController = require("./baseController");


class tagController extends BaseController {
    constructor(){
        super(); 
    }

    getOne(req, res){
        res.send('get single tag');
    }

    createOne(req, res){
        res.send('create single tag');
    }


   updateOne(req, res){
        res.send('update tag');
    }

    deleteOne(req, res){
        res.send('delete tag');
    }
}

module.exports = tagController;