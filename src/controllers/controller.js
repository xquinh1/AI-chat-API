class Controller {
    constructor(service) {
        this.service = service;
        // Ensure methods are bound when passed directly as route handlers
        this.askGemini = this.askGemini.bind(this);
    }

    static normalizePrompt(value) {
        if (typeof value !== "string") return null;
        const trimmed = value.trim();
        return trimmed.length ? trimmed : null;
    }

    async askGemini(req, res, next) {
        const prompt = Controller.normalizePrompt(req.body?.prompt);

        if (!prompt) {
            return res.status(400).json({
                error: {
                    code: "INVALID_PROMPT",
                    message: "prompt is required and must be a non-empty string"
                }
            });
        }

        try {
            const response = await this.service.askGemini(prompt);
            return res.status(200).json({ data: { response } });
        } catch (err) {
            next(err)
        }
    }
}

export default Controller