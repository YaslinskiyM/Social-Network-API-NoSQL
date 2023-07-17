// Import the Express router function
const router = require("express").Router();

// Import the controller functions
const {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require("../controllers/user-controller");

// Define routes for the base URL "/api/users"
router.route("/")
  .get(getAllUser)    // GET request to retrieve all users
  .post(createUser);  // POST request to create a new user

// Define routes for a URL with a specific ID, "/api/users/:id"
router.route("/:id")
  .get(getUserById)   // GET request to retrieve a specific user by their ID
  .put(updateUser)    // PUT request to update a specific user by their ID
  .delete(deleteUser); // DELETE request to remove a specific user by their ID

// Define routes for a URL with a specific user ID and friend ID, "/api/users/:userId/friends/:friendId"
router.route("/:userId/friends/:friendId")
  .post(addFriend)    // POST request to add a friend to a specific user
  .delete(removeFriend); // DELETE request to remove a friend from a specific user

// Export the router to be used in other parts of the application
module.exports = router;