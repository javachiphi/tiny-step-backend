const BaseController = require("./baseController");
const defaultSeeder = require('../utils/defaultSeeder');


class userController extends BaseController {
    constructor(model, entryModel, tagModel){
        super(model); 
        this.defaultSeeder = new defaultSeeder(model, entryModel, tagModel);
    }
    
    async createOne(req, res) {
        try {
            const jwtSub = req.auth.payload.sub;
            const [user, created] = await this.model.findOrCreate({
                where: { jwtSub: jwtSub },
                defaults: { jwtSub: jwtSub }
            });
    
            if (created) {
                const seed = await this.defaultSeeder.seedDefaultData(jwtSub);
                res.status(200).send({ user, seed });
            } else {

                res.status(200).send(user);
            }
    
        } catch(error) {
            console.log('error', error);
            res.status(500).send('Error creating');
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