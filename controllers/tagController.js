const BaseController = require("./baseController");
const { sequelize } = require("../db/models/index.js");
const tagService = require('../services/tagService');

const { Op } = require('sequelize');


class tagController extends BaseController {
    constructor(model, userModel, entryModel){
        super(model); 
        this.userModel = userModel; 
        this.entryModel = entryModel; 
        this.tagService = new tagService(model, entryModel, userModel);
    }

    async getAssociatedEntryTagsCount(req, res) {
        const jwtSub = req.auth.payload.sub;
        const foundUser = await this.userModel.findOne({ where: { jwtSub: jwtSub } });
        const userId = foundUser.id;
        const { tagId } = req.params;
    
        try {

            const [results, metadata] = await sequelize.query(`
            SELECT
                t2.id, t2.note, t2.type, t2.description,
                COUNT(t2.id) as tagCount
            FROM 
                tags AS t1
                INNER JOIN entry_tags AS et ON t1.id = et.tag_id
                INNER JOIN entries AS e ON et.entry_id = e.id
                INNER JOIN entry_tags AS et2 ON e.id = et2.entry_id
                INNER JOIN tags AS t2 ON et2.tag_id = t2.id
            WHERE 
                t1.id = :tagId AND e.user_id = :userId
            GROUP BY t2.id, t2.note, t2.type, t2.description
            ORDER BY tagCount DESC
        `, { replacements: { tagId: tagId, userId: userId } });
        

            res.status(200).json(results);

        } catch(error) {
            console.log('error', error);
            res.status(500).send('Error getting all')
        }
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

    async getCombinedTags(req, res) {
        try{
        const jwtSub = req.auth.payload.sub;
        const foundUser = await this.userModel.findOne({
            where: {
                jwtSub: jwtSub
            }
        })
        const userId = foundUser.id 
        
        const combinedTags = await this.tagService.getCombinedTags(userId);
        res.send(combinedTags);
        } catch(error) {
            console.error('error', error);
            res.status(500).send('Error getting tags');
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
            const userTags = await this.tagService.getUserTags(userId);
            res.send(userTags);
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
        const  tagsToDelete  = req.body
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
            const check = await user.getTags();
            console.log('check', check);
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

// check if this is over engineered after using combined tags and frontend validation
    async createOne(req, res){
        const jwtSub = req.auth.payload.sub;
        const foundUser = await this.userModel.findOne({
            where: {
                jwtSub: jwtSub
            }
        })
        const userId = foundUser.id 
        const { note, description, type, personality } = req.body;
        console.log('req.body', req.body);
        try {

            const user = await this.userModel.findByPk(userId);
            const existingTag = await this.model.findOne({
                where: {
                    note: note,
                    type: type
                }
            })

            const userWithSpecificTag = existingTag && await this.userModel.findOne({
                where: { id: userId },
                include: [{
                model: this.model,
                where: { id: existingTag.id },
                through: {
                    attributes: [],
                    },  
                required: false  // Set to false to still return the user even if the tag isn't associated
                }]
            });

            const userHasTag = userWithSpecificTag && userWithSpecificTag.tags.length > 0
            if(userHasTag){
                return res.status(200).send(existingTag)
            } else {
                const newTag = await this.model.create({
                    note: note,
                    description: description || null,
                    type: type || null,
                    personality: personality || null
                })

                await user.addTag(newTag);
                console.log('since new tag')

            res.send(newTag);
            }
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
        const transaction = await sequelize.transaction();
        const { tagId } = req.params;
        //remove association with entries then remove
        try {
            const found = await this.model.findByPk(tagId, { transaction });
            const entries = await found.getEntries({ transaction });
            await found.removeEntries(entries, { transaction });
            
            // Re-checking entries
            const checkEntries = await found.getEntries({ transaction });
            console.log('Entries after removal attempt:', checkEntries);

            if (checkEntries.length === 0) {
                await found.destroy({ transaction });
                await transaction.commit();
                res.status(200).send('Tag deleted successfully');
            } else {
                throw new Error('Failed to remove all entries');
            }
        } catch (error) {
            await transaction.rollback();
            console.error('Error:', error);
            res.status(500).send('Error deleting');
        }
    }
}

module.exports = tagController;