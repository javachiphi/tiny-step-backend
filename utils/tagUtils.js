/**
 * Combines and filters tags for uniqueness based on id and note.
 * @param {Array} groupingTags - An array of tags with potentially extra attributes.
 * @param {Array} entryTags - An array of tags with basic attributes.
 * @returns {Array} A combined and filtered array of unique tags.
 */
const combineAndFilterUniqueTags = (groupingTags, entryTags) => {
    const uniqueTagsMap = new Map();

    const addTagToMap = (tag) => {
        const key = `${tag.id}-${tag.note}`; // Create a unique key
        if (!uniqueTagsMap.has(key)) {
            uniqueTagsMap.set(key, tag);
        }
    };

    // Add tags to the map, groupingTags first to give them precedence
    groupingTags.forEach(addTagToMap);
    entryTags.forEach(addTagToMap);

    return Array.from(uniqueTagsMap.values());
};

module.exports = {
    combineAndFilterUniqueTags,
};
