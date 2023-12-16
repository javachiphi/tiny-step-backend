const BaseController = require("./baseController");
const { sequelize } = require("../db/models/index.js")
class entryController extends BaseController {
    constructor(model, userModel, tagModel){
        super(model); 
        this.userModel = userModel;
        this.tagModel = tagModel; 
        
    }


    async getAllbyOneUser(req, res){
        const jwtSub = req.auth.payload.sub;
        const foundUser = await this.userModel.findOne({
            where: {
                jwtSub: jwtSub
            }
        })

        const userId = foundUser.id 
        
        try {
            const all = await this.model.findAll({
                where: {
                    userId: userId 
                },
                order: [['created_at', 'DESC']], 
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
            const jwtSub = req.auth.payload.sub;
            const foundUser = await this.userModel.findOne({
                where: {
                    jwtSub: jwtSub
                }
            })

            const userId = foundUser.id 


            const { observation, solution, tagId } = req.body;
            const newEntry = await this.model.create({
                userId: userId, 
                observation: observation || null,
                solution: solution || null,
            })
         
            if(tagId) {
             newEntry.addTag(tagId);
            }
            res.send(newEntry);
        } catch(error) {
            console.log('error', error);
            res.status(500).send('Error creating')
        }
    }


    
   async updateOne(req, res){
        try {
            const { entryId } = req.params;
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

    async getEntryTagAllCounts(req, res) {
        const jwtSub = req.auth.payload.sub;
        const foundUser = await this.userModel.findOne({
            where: {
                jwtSub: jwtSub
            }
        })

        console.log('foundUser', foundUser)
        const userId = foundUser.id 
      
        try {
            const tagCounts = await this.tagModel.findAll({
                attributes: [
                    "id",
                    "note"
                //   [sequelize.fn('COUNT', sequelize.col('tag.id')), 'tagCount'],
                ],
                include: [
                  {
                    model: this.model,
                    where: {
                      userId: userId,
                    },
                     through: {
                      attributes: [],
                    },
                  },
                ],
                // group: ['tag.id'],
                raw: true,
                nest: true,
              }) 

          res.send(tagCounts);
        } catch (error) {
          console.error('Error', error);
          res.status(500).json({ error: 'An error occurred while counting tags.' });
        }
      }
      
}

module.exports = entryController;
