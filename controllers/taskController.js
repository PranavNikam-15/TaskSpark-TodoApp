const db = require('../models/db');
const sendMail = require('../utils/mailSender');

// Show All Tasks
exports.showTasks = (req, res) => {
    db.query('SELECT * FROM tasks WHERE is_completed = FALSE', (err, results) => {
        if (err) throw err;

        results.forEach(task => {
            task.start_date = task.start_date.toISOString().split('T')[0];
            task.due_date = task.due_date.toISOString().split('T')[0];
        });
        res.render('index', { tasks: results });
    });
};

// Show About Pageg
exports.showAbout = (req, res) => {
    res.render('about');
};

// Show All Completed Tasks
exports.showCompletedTasks = (req, res) => {
    db.query('SELECT * FROM tasks where is_completed = TRUE', (err, results) => {
        if (err) throw err;

        results.forEach(task => {
            task.start_date = task.start_date.toISOString().split('T')[0];
            task.due_date = task.due_date.toISOString().split('T')[0];
        });
        res.render('completedTasks', { tasks: results });
    });
};

// Create New Task
exports.createTask = (req, res) => {
    res.render('new');
};

// Add New Task
exports.addTask = async (req, res) => {
    try {
        const { title, description, start_date, due_date } = req.body;

        await new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO tasks (title, description, start_date, due_date) VALUES (?, ?, ?, ?)',
                [title, description, start_date, due_date],
                (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                }
            );
        });

        // Send email
        await sendMail(
            process.env.EMAIL_RECIPIENT,
            'New Task Created ✔️',
            {
                title,
                description,
                start_date,
                due_date
            }
        );

        console.log('Mail sent successfully!');
        res.redirect('/tasks');

    } catch (err) {
        console.error('Error:', err);
        res.redirect('/tasks');
    }
};


// Show Edit Form
exports.editTaskForm = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM tasks WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        results.forEach(task => {
            task.start_date = task.start_date.toISOString().split('T')[0];
            task.due_date = task.due_date.toISOString().split('T')[0];
        });
        res.render('edit', { task: results[0] });
    });
};

// Update Task
exports.updateTask = (req, res) => {
    const { id } = req.params;
    const { title, description, start_date, due_date } = req.body;
    db.query('UPDATE tasks SET title = ?, description = ?, start_date = ?, due_date = ? WHERE id = ?',
        [title, description, start_date, due_date, id], (err) => {
            if (err) throw err;
            res.redirect('/tasks');
        });
};

// Delete Task
exports.deleteTask = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/tasks');
    });
};

// Mark Task as a completed
exports.markCompleted = (req, res) => {
    const { id } = req.params;
    db.query('UPDATE tasks SET is_completed = TRUE WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/tasks');
    });
};

// Show Searched Task
exports.searchedTask = (req, res) => {
    let searchedTask = req.query.searchedTask;
    if (!searchedTask || searchedTask.trim() === '') {
        return res.redirect('/tasks');
    }
    const searchValue = `%${searchedTask}%`;
    db.query('SELECT * FROM tasks WHERE MATCH (title, description) against (?)', [searchValue], (err, results) => {
        if (err) throw err;
        results.forEach(task => {
            task.start_date = task.start_date.toISOString().split('T')[0];
            task.due_date = task.due_date.toISOString().split('T')[0];
        });
        res.render('search', { tasks: results });
    });
};