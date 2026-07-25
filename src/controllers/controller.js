class Controller {
    constructor(service) {
        this.service = service;
    }

    askGemini = async (req, res) => {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                message: "Prompt is required"
            }) 
        }

        try {
            const response = await this.service.askGemini(prompt);
            res.json({ response });
        } catch (err) {
            return res.status(500).json({
                message: err.message
            })
        }
    }
}

export default Controller