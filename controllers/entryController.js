const BaseController = require("./baseController");



class entryController extends BaseController {
    constructor(){
        super(); 
    }

    getOne(req, res){
        res.send('get single entry');
    }

   updateOne(req, res){
        res.send('update entry');
    }

    deleteOne(req, res){
        res.send('delete entry');
    }
}

module.exports = entryController;