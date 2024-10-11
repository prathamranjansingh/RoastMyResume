const express = require('express');
const multer = require('multer');
const path = require('path');
const { processResume } = require('../controllers/resumeController');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

router.post('/roast', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const mode = req.body.mode || 'default';
        const feedback = await processResume(req.file, mode);
        res.json({ feedback });
    } catch (error) {
        if (error.message.includes('OpenAI API rate limit exceeded')) {
            return res.status(429).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;