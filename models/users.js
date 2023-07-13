const {schema, model} = require('mongoose'); // require mongoose's schema and model methods

const UserSchema = new schema({ // create a new schema
    username: {
        type: String,   
        unique: true,   // unique username
        trim: true, // removes whitespace from both ends of a string
        required: 'Username is Required' // required field
    },

    email: {
        type: String,
        unique: true,
        required: 'Email is Required',
        match: [/.+@.+\..+/, 'Please enter a valid e-mail address']
    },

    thoughts: [ // array of id values referencing the Thought model
        {
            type: schema.Types.ObjectId, // tells Mongoose to expect an ObjectId
            ref: 'Thought',
        },
    ],

    friends: [  // array of id values referencing the User model (self-reference)
        {
            type: schema.Types.ObjectId, //
            ref: 'User',
        },
    ],
},

{
    toJSON: {
        virtuals: true,
    },
    id: false,
}
);

UserSchema.virtual('friendCount').get(function() {  // virtual called friendCount that retrieves the length of the user's friends array field on query
    return this.friends.length;
});

const User = model('User', UserSchema);

module.exports = User; // export the User model
