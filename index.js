require('dotenv').config();

const express = require('express');
const methodOverride = require('method-override');
const taskRoutes = require('./routes/taskRoutes');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
// -----------------------------------------------------------

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views' ,path.join(__dirname,'views'));

// Routes
app.use('/tasks', taskRoutes);

// Home Redirect
app.get('/', (req, res) => {
    res.redirect('/tasks');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:3000`);
});