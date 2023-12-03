const express =require("express");


class BaseController {
    constructor(){
        
    }

    getAll(req, res){
        res.send('get all')
    }
}

module.exports = BaseController;