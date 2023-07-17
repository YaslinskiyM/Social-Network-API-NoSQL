const {schema, model, types} = require('mongoose'); // require mongoose's schema and model methods

const dateFormat = require('../utils/dateFormat'); // import dateFormat module

const ReactionSchema = new schema( // create a new schema
    {
        reactionId: {
            type: types.ObjectId, 
            default: () => new types.ObjectId(), 

        },

        reactionBody: { 
            type: String, 
            required: true, 
            maxlength: 280 
        },

        username: { 
            type: String,
            required: true
        },

        createdAt: {
            type: Date, // Date type
            default: Date.now, // default value of the current timestamp
            get: (timestamp) => dateFormat(timestamp) // use dateFormat module to format the timestamp on query
        },
    },

    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);

// Define a schema for thoughts
const ThoughtSchema = new Schema(
    {
      thoughtText: {
        type: String,
        required: "Thought is Required",
        minlength: 1,
        maxlength: 280,
      },
  
      createdAt: {
        type: Date,
        default: Date.now,
        // Use a getter method to format the timestamp on query
        get: (timestamp) => dateFormat(timestamp),
      },
  
      username: {
        type: String,
        required: true,
      },
  
      // Array of nested documents created with the ReactionSchema
      reactions: [ReactionSchema],
    },
    {
      toJSON: {
        virtuals: true,
        getters: true,
      },
      id: false,
    }
  );
  
  // Define a virtual for the 'ThoughtSchema' that returns the count of reactions
  ThoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
  });
  
  // Create a model from the 'ThoughtSchema'
  const Thought = model("Thought", ThoughtSchema);
  
  // Export the 'Thought' model
  module.exports = Thought;