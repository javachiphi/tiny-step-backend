const BaseController = require("./baseController");


class tagController extends BaseController {
    constructor(model){
        super(model); 
    }

    async getOne(req, res){
        try {
            const { tagId } = req.params
            const found = await this.model.findByPk(tagId);
            res.send(found)
        } catch(error) {
            console.log('error', error);
            res.status(500).send('Error getting one')
        }
    }

    async createOne(req, res){
        try {
            console.log('req.body', req.body)
            const { note, description, type, personality } = req.body;
            const newTag = await this.model.create({
                note: note,
                description: description || null,
                type: type || null,
                personality: personality || null
            })
            res.send(newTag);
        } catch(error) {
            console.log('error', error);
            res.status(500).send('Error creating tag')
        }

    }


   async updateOne(req, res){
        try {
            console.log('req.body', req.body);
            const { tagId } = req.params; 
            const found = await this.model.findByPk(tagId);

            const { note, description, type, personality } = req.body;

            found.note = note;
            found.description = description;
            found.type = type;
            found.personality = personality 

            const updated = await found.save();

            res.send(updated);
        } catch(error) {
            console.log('error', error);
            res.status(500).send('Error updating')
        }
    }

    async deleteOne(req, res){
        try {
            const { tagId } = req.params; 
            const found = await this.model.findByPk(tagId);
            found.destroy()
            res.send("deleted");
        } catch(error) {
            console.log('error', error);
            res.status(500).send('Error deleting')
        }
    }
}

module.exports = tagController;