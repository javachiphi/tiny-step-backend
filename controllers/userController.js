const BaseController = require("./baseController");


class userController extends BaseController {
    constructor(model){
        super(model); 
    }

     //figure out how to better handle password 
    async createOne(req, res){
        try {
            console.log('req.body', req.body)
            const { email, password, personality } = req.body;
            const newUser = await this.model.create({
                email: email, 
                password: password, 
                personality: personality || null,
            })
            res.send(newUser);
        } catch(error) {
            console.log('error', error);
            res.status(500).send('Error creating')
        }
    }

    async getOne(req, res){
        try {
            const { userId } = req.params
            const found = await this.model.findByPk(userId);
            res.send(found)
        } catch(error) {
            console.log('error', error);
            res.status(500).send('Error getting')
        }
    }


    //figure out how to better handle password update 
   async updateOne(req, res){
        try {
            const { userId } = req.params;
            const { personality, email, password } = req.body;

            const found = await this.model.findByPk(userId);

            found.personality = personality;
            found.email = email;
            found.password = password; 

            const updated = await found.save(); 
            res.send(updated);
        } catch(error) {
            console.log('error', error);
            res.status(500).send('Error updating')
        }
    }

    async deleteOne(req, res){
        try {
            const { userId } = req.params; 
            const found = await this.model.findByPk(userId);
            console.log('found', found);
            found.destroy()
            res.send("deleted");
        } catch(error) {
            console.log('error', error);
            res.status(500).send('Error deleting')
        }
    }
}

module.exports = userController;