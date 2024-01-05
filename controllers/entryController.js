const BaseController = require("./baseController");

class entryController extends BaseController {
    constructor(model, userModel, tagModel){
        super(model); 
        this.userModel = userModel;
        this.tagModel = tagModel; 
        
    }

    //remove tagfilter method and reroute frontend to entries?tagIds=323
    async getEntries(req, res) {
        const jwtSub = req.auth.payload.sub;
        const user = await this.userModel.findOne({ where: { jwtSub: jwtSub } });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const userId = user.id;
    
        const { tagIds, page = 1, limit = 10 } = req.query;
        const formattedTagIds = tagIds && tagIds.split(',').map(id => parseInt(id))
        const offset = (page - 1) * limit;
    
        try {
            const queryOptions = {
                where: { userId: userId },
                order: [['created_at', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset),
                include: [{
                    model: this.tagModel,
                    attributes: ["note", "description", "type", "id"],
                    through: { attributes: [] },
                    where: tagIds ? { id: formattedTagIds } : undefined,
                }],
            }
            const { count, rows } = await this.model.findAndCountAll(queryOptions);
            // const entryRow = await rows.filter(entry => entry.tags.length === 2)
            let totalCount
            let entryRow 
            let totalPages
            if(formattedTagIds && formattedTagIds.length === 2){
             entryRow = await rows.filter(entry => entry.tags.length === 2) // only two tags, not inclusive of single tag
             totalCount = entryRow.length
             totalPages = 'no pagination for two tag id filters';
            } else {
                console.log('not going through tag check')
                entryRow = rows
                totalPages = Math.ceil(count / limit);
                totalCount = count
            }     
          
            res.send({ count: totalCount, rows: entryRow, totalPages, currentPage: parseInt(page) });
        } catch (error) {
            console.log('error', error);
            res.status(500).send('Error getting all');
        }
    }
    
    async fetchEntries(userId, limit, offset) {
        return await this.model.findAndCountAll({
            where: { userId: userId },
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [{
                model: this.tagModel,
                attributes: ["note", "description", "type", "id"],
                through: { attributes: [] },
            }],
        });
    }

    async getTagFilter(req, res){
        const tagIdExists = req.query.tagIds ? true : false;
        const tagIds = tagIdExists && req.query.tagIds.split(',').map(id => parseInt(id));       
        
        try {
            let entries = await this.model.findAll({
                order: [['created_at', 'DESC']],
                include: [{
                    model: this.tagModel,
                    where: { id: tagIds },
                    attributes: ['note', 'id', 'description'],
                    through: { attributes: [] },
                }],
            });
            // filter entries - if tags length is equal to tagIds length, then return entry
            if(tagIds.length === 2) {
                entries = entries.filter(entry => entry.tags.length === 2);
            }
            
            res.json(entries);
        } catch (error) {
            res.status(500).send('Server Error');
        }
    }

    async getOne(req, res){
        try {
            const { entryId } = req.params
            const found = await this.model.findByPk(entryId, {
                include: [{
                    model: this.tagModel,
                    through: {
                        attributes: [],
                    },
                }]
            });

            if(found){
                res.send(found)
            } else {
                res.status(404).send('Entry not found')
            }

            
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
                await newEntry.addTag(tagId);
                await foundUser.addTag(tagId); // add tag to user_tags table
            }

            const entryWithTags = await this.model.findByPk(newEntry.id, {
                include: [{
                    model: this.tagModel,
                    through: {
                        attributes: [],
                    },
                }]
            });
            res.send(entryWithTags);
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
                console.log('tag Id?', tagId)
                await found.setTags(tagId);
                await user.setTags(tagId);
            }

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
            res.send("Entry deleted successfully"); //tag still available at user tags table
        } catch (error) {
            console.log('error', error);
            res.status(500).send('Error deleting');
        }
    }

    
      
}

module.exports = entryController;
