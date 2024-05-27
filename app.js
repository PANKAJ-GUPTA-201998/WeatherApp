const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const API_KEY = '2b9b609e8f82f02afd044595c8d61792';

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const port = 8000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit-city', async (req, res) => {
    const city = req.body.city;
    console.log("Received city: " + city);

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const response = await axios.get(url);
        const temperature = response.data.main.temp;
        const description = response.data.weather[0].description;
        const icon = response.data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        res.render('index', { city, temperature, description, iconUrl });
    } catch (error) {
        console.error(error);
        if (error.response) {
            res.status(500).send(`Error retrieving weather data: ${error.response.data.message}`);
        } else {
            res.status(500).send("Failed to retrieve weather data");
        }
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
