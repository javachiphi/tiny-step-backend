const BaseController = require("./baseController");
const { sequelize } = require("../db/models/index.js");


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
                include: [
                    {
                        model: this.tagModel,
                        attributes: ["note", "description", "type", "id"],
                        through: {
                            attributes: [],
                        },  
                    }
                ]
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
    const jwtSub = req.auth.payload.sub;
    
        try {
            const { entryId } = req.params;
            const { observation, solution, tagId } = req.body;

            const found = await this.model.findByPk(entryId);
            const user = await this.userModel.findOne({ where: { jwtSub } });

            if (found.userId !== user.id) {
                return res.status(403).send('Not authorized to update this entry');
            }
    

        
            console.log('found?', found)
            found.observation = observation;
            found.solution = solution;

            await found.save(); 

            if (tagId) {
                // Assuming tagId is an array of tag IDs
                await found.setTags(tagId);
            }

            // found.updateTag(tagId)???
            res.send(found);
        } catch(error) {
            console.log('error', error);
            res.status(500).send('Error updating')
        }
    }


 
    async deleteOne(req, res) {
        const jwtSub = req.auth.payload.sub;
        
        try {
            const { entryId } = req.params;
            const entry = await this.model.findByPk(entryId);
    
            if (!entry) {
                return res.status(404).send('Entry not found');
            }
    
            const user = await this.userModel.findOne({ where: { jwtSub } });
            if (entry.userId !== user.id) {
                return res.status(403).send('Not authorized to delete this entry');
            }
            
    
            await entry.destroy();
            res.send("Entry deleted successfully");
        } catch (error) {
            console.log('error', error);
            res.status(500).send('Error deleting');
        }
    }

    async getGroupedEntries(req, res) {
        
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
                    "note",
                    "type",

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
