import express from "express"
const router = express.Router();

export default (controller) => {
    router.post('/ask-gemini', controller.askGemini);
    
    return router;
};