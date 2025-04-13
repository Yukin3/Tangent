require('dotenv').config();  
const express = require("express");
const app = express();
const cors = require("cors");
const connectToDB = require("./config/db");




//middleware
app.use(cors());
app.use(express.json())
connectToDB();


    //Routes
app.get("/", (req, res) => { //Startup route
    res.send("Tangents servers are up and running."); 
});

app.get('/health', (req, res) => { //Health
    res.status(200).json({ status: 'Ok🟢' });
});
    //API Endpoints
// app.get('/api/health', (req, res) => { //Health
//     res.send("Tangents servers are up and running.");
// });
const notesRoutes = require('./routes/notesRoutes');
app.use('/api/notes', notesRoutes);
const folderRoutes = require('./routes/folderRoutes');
app.use('/api/folders', folderRoutes);
const linkRoutes = require('./routes/linkRoutes');
app.use('/api/links',linkRoutes );




app.use((req, res, next) => {
        console.log("🛰️ CORS origin check:", req.headers.origin);
        console.log("➡️ Path:", req.path);
        next();
});
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
  console.log(`Visit  localhost:${PORT}`);
});

