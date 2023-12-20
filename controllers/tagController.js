const BaseController = require("./baseController");
const { sequelize } = require("../db/models/index.js");
const { Op } = require('sequelize');


class tagController extends BaseController {
    constructor(model, userModel, entryModel){
        super(model); 
        this.userModel = userModel; 
        this.entryModel = entryModel; 
    }

    async getSystemTags(req, res){
        try{
            const systemTags = await this.model.findAll({
                where: {
                    type: {
                        [Op.ne]: 'user_generated'
                    }
                }
            });

            res.send(systemTags);
        } catch(error){
            cosole.error('error', error)
        }
    }
//USER - TAGS ASSOCIATION ACTIONS //
    // display default tags that user selected 
    async getUserTags(req,res){
        try{
            const jwtSub = req.auth.payload.sub;

            const foundUser = await this.userModel.findOne({
                where: {
                    jwtSub: jwtSub
                }
            })
            const userId = foundUser.id 
            const user = await this.userModel.findByPk(userId);
            const tags = await user.getTags({
                attributes: ["note", "description", "type", "personality"]
            });
            res.send(tags);

        }catch(error){
            console.log('error', error);
            res.status(500).send('Error getting one')
        }
    }

    // user addede default tags to their profile" - during onboarding 
    async addUserTags(req, res) {
        const tagsToAdd = req.body.idsToAdd

        const jwtSub = req.auth.payload.sub;

        const foundUser = await this.userModel.findOne({
            where: {
                jwtSub: jwtSub
            }
        })
        const userId = foundUser.id 
    
        try {
            const user = await this.userModel.findByPk(userId);
            if (!user) {
                return res.status(404).send('User not found');
            }
    
            // const tagIds = tagsToAdd.map(tag => tag.tagId);
            await user.addTags(tagsToAdd);
    
            res.status(200).json({ message: "Tags added successfully" });
        } catch (error) {
            console.error('Error adding tags:', error);
            res.status(500).send('Error adding tags');
        }
    }
    
    // user removed default tag 
    async removeUserTags(req, res) {
        const { tagId } = req.params;
        const tagsToDelete = req.body


        const jwtSub = req.auth.payload.sub;

        const foundUser = await this.userModel.findOne({
            where: {
                jwtSub: jwtSub
            }
        })
        const userId = foundUser.id 
       
        try {
            const user = await this.userModel.findByPk(userId);
            await user.removeTags(tagsToDelete);
            res.status(200).json({message: `tags removed: ${tagsToDelete}`})
        }catch(error){
            console.error('error', error);
            res.status(500).send('Error removing tags');
        }
    }

// ENTRY & TAGS association actions // 
    async getEntryTags(req, res) {
        const { entryId } = req.params;
        

        try{
            const entry = await this.entryModel.findByPk(entryId);
            if(!entry){
                return res.status(404).send('entry not found')
            }

            const tags = await entry.getTags();
            res.status(200).json(tags);
        } catch(error) {
            console.error('Error fetching tags:', error);
            res.status(500).send('Error fetching tags');
        }
    }

    async addEntryTag(req, res) {
        const { entryId } = req.params;
        const { tagId } = req.body;

        try {
            const entry = await this.entryModel.findByPk(entryId);
            const tag = await this.model.findByPk(tagId);

            if (!entry || !tag) {
                return res.status(404).send('Entry or Tag not found');
            }

            await entry.addTag(tag);
            res.status(200).json({ message: "Tag added to entry successfully" });
        } catch (error) {
            console.error('Error adding tag to entry:', error);
            res.status(500).send('Error adding tag to entry');
        }
    }

    async removeEntryTag(req, res) {
        const { entryId, tagId } = req.params;

        try {
            const entry = await this.entryModel.findByPk(entryId);
            const tag = await this.model.findByPk(tagId);

            if (!entry || !tag) {
                return res.status(404).send('Entry or Tag not found');
            }

            await entry.removeTag(tag);
            res.status(200).json({ message: "Tag removed from entry successfully" });
        } catch (error) {
            console.error('Error removing tag from entry:', error);
            res.status(500).send('Error removing tag from entry');
        }
    }


/// BASIC CRUD OPERATIONS //// 0Auth add currentUser id
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
        const jwtSub = req.auth.payload.sub;
        const foundUser = await this.userModel.findOne({
            where: {
                jwtSub: jwtSub
            }
        })
        const userId = foundUser.id 

        try {
            console.log('req.body', req.body)
            const { note, description, type, personality } = req.body;
            const newTag = await this.model.create({
                note: note,
                description: description || null,
                type: type || null,
                personality: personality || null
            })

            const user = await this.userModel.findByPk(userId);
            await user.addTag(newTag);

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
            const result = await found.destroy();
            res.status(200).send(result);
        } catch(error) {
            console.log('error', error);
            res.status(500).send('Error deleting')
        }
    }

}

module.exports = tagController;