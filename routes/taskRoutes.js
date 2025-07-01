const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/', taskController.showTasks);

router.get('/about', taskController.showAbout);

router.get('/new', taskController.createTask);

router.post('/', taskController.addTask);

router.get('/:id/edit', taskController.editTaskForm);

router.put('/:id', taskController.updateTask);

router.put('/:id/complete', taskController.markCompleted);

router.delete('/:id', taskController.deleteTask);

router.get('/completed', taskController.showCompletedTasks);

router.get('/search', taskController.searchedTask);



module.exports = router;