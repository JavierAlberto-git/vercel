const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const ctrl = require("../controllers/task.controller");

// Todas estas rutas deben existir así porque Android las llama igual:
router.get("/tasks", auth, ctrl.getTasks);         // GET /api/tasks
router.get("/tasks/:id", auth, ctrl.getTask);      // GET /api/tasks/:id
router.post("/tasks", auth, ctrl.createTask);      // POST /api/tasks
router.put("/tasks/:id", auth, ctrl.updateTask);   // PUT /api/tasks/:id
router.delete("/tasks/:id", auth, ctrl.deleteTask);// DELETE /api/tasks/:id

module.exports = router;
