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
            attributes: ["id", "note", "type", "created_at", "updated_at"],
            order: [['created_at', 'DESC']], 
            include: [{
                model: this.entryModel,
                attributes:['id', 'observation', 'solution', 'created_at', 'updated_at'],
                where: { userId: userId },
                through: { attributes: [] },
            }],
            raw: true,
            nest: true,
        });

        // Step 2: Count and group entries per tag
        let formatted = {};  
        tagsWithEntries.forEach(tag => {
            const note = tag.note;
            const entry = tag.entries; 
    
            if(!formatted[note]){
                formatted[note] = {
                    id: tag.id,
                    type: tag.type,
                    count: 0,
                    created_at: tag.created_at,
                    updated_at: tag.updated_at,
                    entries:[]
                };
            }
    
            formatted[note].entries.push(entry);
            formatted[note].count += 1; 
        })
    
        const formattedData = Object.keys(formatted).map(note => {
            return {
                id: formatted[note].id,
                note: note, 
                type: formatted[note].type,
                count: formatted[note].count,
                created_at: formatted[note].created_at,
                updated_at: formatted[note].updated_at,
                entries: formatted[note].entries,
                }
        })

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