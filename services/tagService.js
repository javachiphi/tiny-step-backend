const { combineAndFilterUniqueTags } = require('../utils/tagUtils');


class TagService {
    constructor(tagModel, entryModel, userModel) {
        this.tagModel = tagModel;
        this.entryModel = entryModel;
        this.userModel = userModel;
    }

    async getUserTags(userId) {
        const user = await this.userModel.findByPk( userId);
         const tags = await user.getTags({ order: [['created_at', 'DESC']] }); 
        return tags;
    }

    async getGroupingTags(userId) {
        // Step 1: Fetch tags with entry IDs
        const tagsWithEntries = await this.tagModel.findAll({
            attributes: ["id", "note", "description", "type", "created_at", "updated_at"],
            order: [['created_at', 'DESC']], 
            include: [{
                model: this.entryModel,
                attributes:['id', 'observation', 'solution', 'created_at', 'updated_at'],
                where: { userId: userId },
                through: { attributes: [] },
                include: [{ // Include tags for each entry
                    model: this.tagModel,
                    attributes: ['id', 'type', 'note'],
                    through: { attributes: [] },
                }],
            }],
            nest: true,
        });

        // Step 2: Count and group entries per tag
        let formatted = {};  
        tagsWithEntries.forEach(tag => {
            if(!formatted[tag.note]){
                formatted[tag.note] = {
                    id: tag.id,
                    type: tag.type,
                    note: tag.note,
                    description: tag.description,
                    count: tag.entries.length,
                    created_at: tag.created_at,
                    updated_at: tag.updated_at,
                    entries: tag.entries.map(entry => {
                        return {
                            ...entry.get({plain: true}),
                            tags: entry.tags.map(tag => tag.get({plain: true}))
                        };
                    })
                };
            }

        });
        const formattedData = Object.values(formatted);
        return formattedData;
    }

    async getCombinedTags(userId) {
      
        const groupingTags = await this.getGroupingTags(userId);
        const entryTags = await this.getUserTags(userId);
        
        // Use the utility function to combine and filter tags
        return combineAndFilterUniqueTags(groupingTags, entryTags);
    }

}

module.exports = TagService;