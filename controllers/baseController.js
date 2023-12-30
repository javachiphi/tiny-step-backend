class BaseController {
    constructor(model){
        this.model = model;
    }

   async getAll(req, res){
     try {
        const all = await this.model.findAll();
        console.log('getting all')
        res.send(all)
     } catch(error) {
        console.error('error', error)
     }
    }
}

module.exports = BaseController;