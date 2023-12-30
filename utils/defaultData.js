const data = [
    {
        tagData: [
            { note: "energy management", type: "mind", is_default: true },
            { note: "problem solving", type: "mind", is_default: true},
            { note: "coding", type: "situation", is_default: true },
        ],
        entryData:
    {
                observation: 'when energy is low, I tend to brute force my way through problems.',
                solution: 'take a 5 min walk. Or deep breath 10 times.',
                is_default: true
            }
    },
    {
        tagData: [
            { note: "prioritization", type: "mind", is_default: true },
            { note: "coding", type: "situation" , is_default: true},
        ],
        entryData: 
            {
                observation: 'I got caught up in small UI details. Wasted time that could have been used for the main issue.',
                solution: 'Watch out for recency bias. Focus on the main issue.',
                is_default: true
            },
    },
    {
        tagData: [
            { note: "complacency", type: "mind", is_default: true },
            { note: "workout", type: "situation" , is_default: true},
        ],
        entryData: 
            {
                observation: 'I miscount the reps or misinterpret the rules in a direction that benefits me.',
                solution: 'Assume the worst/lower count when in doubt. Avoid rewarding complacency.',
                is_default: true
            },
    
    }
];

module.exports = data;
