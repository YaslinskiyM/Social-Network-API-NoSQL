// Importing the User and Thought models
const { User, Thought } = require("../models");

// Controller for users
const userController = {
  // Method to get all users
  getAllUser(req, res) {
    User.find({})  // Find all User records
      .populate({  // Populating friends field, excluding __v
        path: "friends",
        select: "-__v",
      })
      .select("-__v")  // Exclude __v from the result
      .sort({ _id: -1 })  // Sort by _id in descending order
      .then((dbUserData) => res.json(dbUserData))  // Send response with the found data
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);  // Send error status if something went wrong
      });
  },

  // Method to get a user by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })  // Find a user by id
      .populate({  // Populate thoughts, excluding __v
        path: "thoughts",
        select: "-__v",
      })
      .populate({  // Populate friends, excluding __v
        path: "friends",
        select: "-__v",
      })
      .select("-__v")  // Exclude __v from the result
      .then((dbUserData) => {
        // If no user found, send a message with a 404 status
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "No user found with this id!" });
        }
        res.json(dbUserData);  // Send the found user data
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);  // Send error status if something went wrong
      });
  },

  // Method to create a new user
  createUser({ body }, res) {
    User.create(body)  // Create a new User record
      .then((dbUserData) => res.json(dbUserData))  // Send the created user data
      .catch((err) => res.json(err));  // Send error if something went wrong
  },

  // Method to update a user by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => {
        // If no user found, send a message with a 404 status
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);  // Send the updated user data
      })
      .catch((err) => res.json(err));  // Send error if something went wrong
  },

  // Method to delete a user by id
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })  // Delete the user by id
      .then((dbUserData) => {
        // If no user found, send a message with a 404 status
        if (!dbUserData) {
          return res.status(404).json({ message: "No user with this id!" });
        }
        // Delete all thoughts of the user
        return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
      })
      .then(() => {
        // Send a success message
        res.json({ message: "User and associated thoughts deleted!" });
      })
      .catch((err) => res.json(err));  // Send error if something went wrong
  },

  // Method to add a friend to a user
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },  // $addToSet adds unique values to an array
      { new: true, runValidators: true }
    )
      .then((dbUserData) => {
        // If no user found, send a message with a 404 status
        if (!dbUserData) {
          res.status(404).json({ message: "No user with this id" });
          return;
        }
        res.json(dbUserData);  // Send the updated user data
      })
      .catch((err) => res.json(err));  // Send error if something went wrong
  },

  // Method to remove a friend from a user
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },  // $pull removes values that match a specified condition
      { new: true }
    )
      .then((dbUserData) => {
        // If no user found, send a message with a 404 status
        if (!dbUserData) {
          return res.status(404).json({ message: "No user with this id!" });
        }
        res.json(dbUserData);  // Send the updated user data
      })
      .catch((err) => res.json(err));  // Send error if something went wrong
  },
};

module.exports = userController;  // Export the controller