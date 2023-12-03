const BaseController = require("./baseController");
// finish entry controller 
//finish user-tags/ entry-tags controller 


class entryController extends BaseController {
    constructor(model, userModel){
        super(model); 
        this.userModel = userModel
        
    }

    async getAllbyOneUser(req, res){
        const { userId } = req.params
        try {
            const all = await this.model.findAll({
                where: {
                    userId: userId 
                }
            });
            res.send(all);
        } catch(error) {
            console.log('error', error);
            res.status(500).send('Error getting all')
        }
    }

    async getOne(req, res){
        try {
            const { entryId } = req.params
            const found = await this.model.findByPk(entryId);
            res.send(found)
        } catch(error) {
            console.log('error', error);
            res.status(500).send('Error getting')
        }
    }

    async createOne(req, res){
        try {
            console.log('req.body', req.body)
            const { userId } = req.params;
            const { observation, solution } = req.body;
            const newEntry = await this.model.create({
                userId: userId, 
                observation: observation || null,
                solution: solution || null,
            })
            res.send(newEntry);
        } catch(error) {
            console.log('error', error);
            res.status(500).send('Error creating')
        }
    }

   async updateOne(req, res){
        try {
            console.log('req.body', req.body)
            const { userId, entryId } = req.params;
            const { observation, solution } = req.body;

            const found = await this.model.findByPk(entryId);

            found.observation = observation;
            found.solution = solution;

            const updated = await found.save(); 
            res.send(updated);
        } catch(error) {
            console.log('error', error);
            res.status(500).send('Error updating')
        }
    }

    async deleteOne(req, res){
        try {
            const { entryId } = req.params; 
            const found = await this.model.findByPk(entryId);
            found.destroy()
            res.send("deleted");
        } catch(error) {
            console.log('error', error);
            res.status(500).send('Error deleting')
        }
    }
}

module.exports = entryController;