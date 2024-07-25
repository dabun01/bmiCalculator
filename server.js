const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb+srv://daveabundis4:<Password>@cluster0.apaoqmt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Define Schema
const bmiSchema = new mongoose.Schema({
    weight: Number,
    height: Number,
    bmi: Number,
    date: { type: Date, default: Date.now }
});

// Create Model
const BMI = mongoose.model('BMI', bmiSchema);

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/calculate', async (req, res) => {
    const { weight, height } = req.body;
    const bmi = weight / (height * height);

    const bmiEntry = new BMI({
        weight: weight,
        height: height,
        bmi: bmi
    });

    await bmiEntry.save();

    res.render('result', { weight, height, bmi });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
