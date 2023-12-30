const BaseController = require("./baseController");


class userController extends BaseController {
    constructor(model){
        super(model); 
    }
    async createOne(req, res){
        try {

            const jwtSub = req.auth.payload.sub;

            const user = await this.model.findOrCreate({
                where: { jwtSub: jwtSub },
                defaults: {
                    jwtSub: jwtSub
                  }
              });

            res.status(200).send(user);
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