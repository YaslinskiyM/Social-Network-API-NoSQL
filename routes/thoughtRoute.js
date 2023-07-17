// Import the Express router function
const router = require("express").Router();

// Import the controller functions
const {
  getAllThought,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require("../controllers/thought-controller");

// Define routes for the base URL "/api/thoughts"
router.route("/")
  .get(getAllThought)    // GET request to retrieve all thoughts
  .post(createThought);  // POST request to create a new thought

// Define routes for a URL with a specific ID, "/api/thoughts/:id"
router.route("/:id")
  .get(getThoughtById)   // GET request to retrieve a specific thought by its ID
  .put(updateThought)    // PUT request to update a specific thought by its ID
  .delete(deleteThought); // DELETE request to delete a specific thought by its ID

// Define routes for a URL with a specific thought ID and reactions, "/api/thoughts/:thoughtId/reactions"
router.route("/:thoughtId/reactions")
  .post(addReaction);    // POST request to add a reaction to a specific thought

// Define routes for a URL with a specific thought ID and a specific reaction ID, "/api/thoughts/:thoughtId/reactions/:reactionId"
router.route("/:thoughtId/reactions/:reactionId")
  .delete(removeReaction); // DELETE request to remove a specific reaction from a specific thought

// Export the router to be used in other parts of the application
module.exports = router;