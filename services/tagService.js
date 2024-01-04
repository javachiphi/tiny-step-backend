const { combineAndFilterUniqueTags } = require('../utils/tagUtils');
const { sequelize } = require("../db/models/index.js");


class TagService {
    constructor(tagModel, entryModel, userModel) {
        this.tagModel = tagModel;
        this.entryModel = entryModel;
        this.userModel = userModel;
    }

    async getUserTags(userId) {
        const user = await this.userModel.findByPk(userId);
         const tags = await user.getTags({ 
            order: [['created_at', 'DESC']], 
            attributes: ["id", "note", "description", "type", "created_at", "updated_at"],
        }); 
        return tags;
    }

    async getEntryTags(userId) {
        // Step 1: Fetch tags with entry IDs
        const tagsWithEntries = await this.tagModel.findAll({
            attributes: [
                "id", 
                "note", 
                "description", 
                "type", 
                "created_at", 
                "updated_at",
                [sequelize.fn("COUNT", sequelize.col("entries.id")), "entryCount"]
            ],
            order: [['created_at', 'DESC']], 
            include: [{
                model: this.entryModel,
                attributes:[],
                where: { userId: userId },
                through: { attributes: [] },
            }],
            group: ['tag.id'],
            nest: true,
        });

        return tagsWithEntries;
    }

    async getCombinedTags(userId) {  
        const entryTags = await this.getEntryTags(userId);
        const userTags = await this.getUserTags(userId);
            // Use the utility function to combine and filter tags
        return combineAndFilterUniqueTags(entryTags, userTags);
    }

}

module.exports = TagService;