const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdf = require('pdf-parse');
const dotenv = require('dotenv');
const fs = require('fs/promises');

dotenv.config(); 


const genAI = new GoogleGenerativeAI(process.env.API_KEY);


const extractResumeText = async (filePath) => {
    try {
        const dataBuffer = await fs.readFile(filePath);
        const { text } = await pdf(dataBuffer);
        return text;
    } catch (error) {
        throw new Error('Error extracting text from the resume: ' + error.message);
    }
};


const roastResume = async (resumeText, mode) => {
    let prompt='';
    if (mode === '1') {
        prompt = `
            Roast this resume with the following intensity level: 1 (Mild). 

            Provide constructive criticism with a touch of sarcasm. Point out a few areas for improvement without being too harsh.

            Resume: ${resumeText}
        `;
    } else if (mode === '2') {
        prompt = `
            Roast this resume with the following intensity level: 2 (Moderate). 

            Be more direct and critical. Highlight several flaws and weaknesses, using a sarcastic tone to make the critique entertaining yet informative.

            Resume: ${resumeText}
        `;
    } else{
        prompt = `
            Roast this resume with the following intensity level: 3 (Brutal). 

            Go all out! Tear this resume apart with brutal honesty. Identify every embarrassing mistake, overused buzzword, and exaggeration. Be merciless and sarcastic about the skills, experience, and any irrelevant or unimpressive details. Don’t hold back — make this critique as blunt and harsh as possible.

            Resume: ${resumeText}
        `;
    }
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const response = await model.generateContent(prompt);
        return response.response.text(); 
    } catch (error) {
        console.error('Error roasting resume:', error); 
        throw new Error('Error getting feedback from Gemini AI: ' + error.message);
    }
};


const processResume = async (file, mode) => {
    if (!file) throw new Error('No file uploaded');

    try {
        const resumeText = await extractResumeText(file.path);
        const feedback = await roastResume(resumeText, mode);

        await fs.unlink(file.path);
        return feedback;
    } catch (error) {
      
        if (file.path) {
            await fs.unlink(file.path).catch(console.error);
        }
        throw error; 
    }
};

module.exports = { processResume }; 
