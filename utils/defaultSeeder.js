const data = require('./defaultData');

class defaultSeeder {
    constructor(userModel, entryModel, tagModel) {
        this.userModel = userModel;
        this.entryModel = entryModel;
        this.tagModel = tagModel;
    }

    async seedTagData(user, tagData) {
        try {
            const tags = await this.tagModel.bulkCreate(tagData);
            await user.addTags(tags);
            return tags;
        } catch (error) {
            console.log('error in seedTagData', error);
            return error; 
            
        }
    }

    async seedEntryData(user, entryData, tagsCreated) {
        try {
            const userId = user.id
            const entry = await this.entryModel.create({...entryData, userId: userId});
            await entry.setTags(tagsCreated);
            return entry;
        } catch (error) {
            console.log('error in seedTagData', error)
            return error
        }
    }
    
    async seedDefaultData(jwtSub) {
        const exists = await this.checkDefaultDataExists(jwtSub);
        if (exists) return { message: 'Default data already exists', data: null};

        try {
            const user = await this.userModel.findOne({ where: { jwtSub: jwtSub } });
            const results = await Promise.all(Object.values(data).map(async (batch) => {
                const tagResult = await this.seedTagData(user, batch.tagData);
                const entryResult = await this.seedEntryData(user, batch.entryData, tagResult);
                return { tagResult, entryResult };
            }));
    
            return results;
        } catch(error) {
            console.error('Error in testSeed:', error);
            return error;
        }

    }

    async checkDefaultDataExists(jwtSub) {
        const user = await this.userModel.findOne({ where: { jwtSub: jwtSub }, 
            include: [
                { model: this.tagModel },
                { model: this.entryModel }
            ]
         });

         if (!user) return false;

        const hasDefaultTags = user.tags.some(tag => tag.is_default);
        const hasDefaultEntries = user.entries.some(entry => entry.is_default);

    return hasDefaultTags && hasDefaultEntries;
    }
}




module.exports = defaultSeeder;