import { exec } from "child_process";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";

export const transcribeAudio = async (req, res) => {
    try {
        const audiofile = req.file.path;

        const formData = new FormData();
        formData.append("file", fs.createReadStream(audiofile));
        formData.append("model", "whisper-1");

        const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                ...formData.getHeaders()
            }
        });

        fs.unlinkSync(audiofile); // delete file after processing
        res.json({ transcription: response.data.text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const synthesizeSpeech = async (req, res) => {
    try {
        const { text } = req.body;
        const outputFilePath = `output-${Date.now()}.wav`;

        exec(`espeak-ng -w ${outputFilePath} "${text}"`, (error) => {
            if(error) {
                return res.status(500).json({ error: "Text-to-speech conversion failed" });
            }

            res.download(outputFilePath, () => {
                fs.unlinkSync(outputFilePath); // delete temp file after sending
            })
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};