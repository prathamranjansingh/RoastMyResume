const express = require('express');
const dotenv = require('dotenv');
const resumeRoutes = require('./routes/resumeRoutes');
const cors = require('cors');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());



app.use(express.json());
app.use('/api/resume', resumeRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});