const BaseController = require("./baseController");


class entryController extends BaseController {
    constructor(model){
        super(model); 
    }

    getOne(req, res){
        res.send('get single entry');
    }

    createOne(req, res){
        res.send('create single entry');
    }

   updateOne(req, res){
        res.send('update entry');
    }

    deleteOne(req, res){
        res.send('delete entry');
    }
}

module.exports = entryController;