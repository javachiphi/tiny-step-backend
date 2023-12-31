const BaseController = require("./baseController");
const defaultSeeder = require('../utils/defaultSeeder');


class userController extends BaseController {
    constructor(model, entryModel, tagModel){
        super(model); 
        this.defaultSeeder = new defaultSeeder(model, entryModel, tagModel);
    }
    
    async createUserIfNotExist(req, res) {
        const transaction = await this.model.sequelize.transaction();
        try {
            const jwtSub = req.auth.payload.sub;
            const [user, created] = await this.model.findOrCreate({
                where: { jwtSub: jwtSub },
                defaults: { jwtSub: jwtSub },
                transaction
            });
    
            if (created) { 
                await this.defaultSeeder.seedDefaultData(jwtSub, transaction);
            } 

            await transaction.commit();
            res.status(200).send({ user, isNewUser: created });
        } catch(error) {
            await transaction.rollback();
            res.status(500).send('Error in user creation/seeding');
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