const { Schema, model } = require('mongoose');

// Helper function to format date
function formatDate(date) {
    const options = { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    return new Intl.DateTimeFormat('en-US', options).format(date).replace(',', '').replace('AM', 'am').replace('PM', 'pm').replace(' at ', ' [at] ');
  }

// Reaction Schema
const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()

        },
        reactionBody: {
            type: String,
            required: true,
            maxLength: 280

        },
        username: {
            type: String,
            required: true,

        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: formatDate
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

//  Create Thought model
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,

        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: formatDate,

        },
        username: {
            type: String,
            required: true,

        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

// Create a virtual called `reactionCount` that retrieves the length of the thought's `reactions` array field on query.
thoughtSchema.virtual(`reactionCount`).get(function () {
    return this.reactions.length
});

const Thought = model('Thought', thoughtSchema);
module.exports = Thought;