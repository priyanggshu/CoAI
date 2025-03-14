import axios from "axios"; 

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

const queryOpenAI = async (promp) => {
    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }],
            },
            { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` }}
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        return "Error fetching from OpenAI";
    }
};

const queryGemini = async (prompt) => {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText?key=${GEMINI_API_KEY}`,
            { prompt: { text: prompt } }
        );
        return response.data.candidates[0]?.output || "Error fetching from Gemini"
    } catch (error) {
        return "Error fetching from Gemini";
    }
};

const queryPerplexity = async (prompt) => {
    try {
        const response = await axios.post(
            "https://api.perplexity.ai/v1/answer",
            { query: prompt },
            { headers: { Authorization: `Bearer ${PERPLEXITY_API_KEY}` } }
        );
        return response.data.answer || "Error fetching from Perplexity";
    } catch (error) {
        return "Error fetching from Perplexity";
    }
};

const mergeResponses = (responses) => {
    const filteredResponses = responses.filter((res) => !res.includes("Error"));
    if(filteredResponses.length === 0) return "All AI services failed.";
    return filteredResponses.join("  |  ");
};

export const fetchAndMergeResponses = async (req, res) => {
    const { prompt } = req.body;

    const responses = await Promise.all([
        queryOpenAI(prompt),
        queryGemini(prompt),
        queryPerplexity(prompt),
    ]);

    const mergedResponse = mergeResponses(responses);

    return res.json({ mergedResponse, individualResponses: responses });
};