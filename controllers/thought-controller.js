// Importing the Thought and User models
const { Thought, User } = require("../models");

// Controller for thoughts
const thoughtController = {
  // Method to get all thoughts
  getAllThought(req, res) {
    // Find all Thought records
    Thought.find({})
      .populate({  // Populating reactions field, excluding __v
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")  // Exclude __v from the result
      .sort({ _id: -1 })  // Sort by _id in descending order
      .then((dbThoughtData) => res.json(dbThoughtData))  // Send response with the found data
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);  // Send error status if something went wrong
      });
  },

  // Method to get a thought by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })  // Find a thought by id
      .populate({  // Populate reactions, excluding __v
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")  // Exclude __v from the result
      .then((dbThoughtData) => {
        // If no thought found, send a message with a 404 status
        if (!dbThoughtData) {
          return res.status(404).json({ message: "No thought with this id!" });
        }
        res.json(dbThoughtData);  // Send the found thought data
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);  // Send error status if something went wrong
      });
  },

  // Method to create a new thought
  createThought({ params, body }, res) {
    Thought.create(body)  // Create a new Thought record
      .then(({ _id }) => {
        // Add the new thought to the user's thoughts array
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        // If no user found, send a message with a 404 status
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "Thought created but no user with this id!" });
        }
        // Send a success message
        res.json({ message: "Thought successfully created!" });
      })
      .catch((err) => res.json(err));  // Send error if something went wrong
  },

  // Method to update a thought by id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbThoughtData) => {
        // If no thought found, send a message with a 404 status
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this id!" });
          return;
        }
        res.json(dbThoughtData);  // Send the updated thought data
      })
      .catch((err) => res.json(err));  // Send error if something went wrong
  },

  // Method to delete a thought by id
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })  // Delete the thought by id
      .then((dbThoughtData) => {
        // If no thought found, send a message with a 404 status
        if (!dbThoughtData) {
          return res.status(404).json({ message: "No thought with this id!" });
        }

        // Remove the thought id from the user's thoughts array
        return User.findOneAndUpdate(
          { thoughts: params.id },
          { $pull: { thoughts: params.id } },  // $pull removes values that match a specified condition
          { new: true }
        );
      })
      .then((dbUserData) => {
        // If no user found, send a message with a 404 status
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "Thought deleted but no user with this id!" });
        }
        // Send a success message
        res.json({ message: "Thought successfully deleted!" });
      })
      .catch((err) => res.json(err));  // Send error if something went wrong
  },

  // Method to add a reaction to a thought
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },  // $addToSet adds unique values to an array
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        // If no thought found, send a message with a 404 status
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought with this id" });
          return;
        }
        res.json(dbThoughtData);  // Send the updated thought data
      })
      .catch((err) => res.json(err));  // Send error if something went wrong
  },

  // Method to remove a reaction from a thought
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },  // $pull removes values that match a specified condition
      { new: true }
    )
      .then((dbThoughtData) => res.json(dbThoughtData))  // Send the updated thought data
      .catch((err) => res.json(err));  // Send error if something went wrong
  },
};

module.exports = thoughtController;  // Export the controller