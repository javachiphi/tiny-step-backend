const express =require("express");


class BaseController {
    constructor(){
        
    }

    getAll(req, res){
        res.send('get all entries')
    }
}

module.exports = BaseController;