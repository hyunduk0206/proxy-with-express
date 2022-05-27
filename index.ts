import express, { Express, Request, Response } from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const fetchTtsResult = async (text: string) => {
    const synthesize_url = `https://kakaoi-newtone-openapi.kakao.com/v1/synthesize`;
    const headers_synth = {
        "Content-Type": "application/xml",
        Authorization: `KakaoAK ${process.env.TTS_API_KEY}`,
    };
    const synth_in = `<speak> <voice name='WOMAN_DIALOG_BRIGHT'> ${text} </voice> </speak>`;
    const res = await fetch(synthesize_url, {
        method: "POST",
        headers: headers_synth,
        body: JSON.stringify({
            data: synth_in,
        }),
    });
    if (!res.ok) {
        const message = await res.text();
        throw new Error(message);
    }

    return await res.arrayBuffer();
};

app.get("/ping", (req: Request, res: Response) => {
    res.send("pong");
});

app.post("/ping", (req: Request, res: Response) => {
    res.status(200).json({ payload: "pong" });
});

app.post("/", async (req: Request, res: Response) => {
    const { text } = req.body;

    console.log("->", text);

    const arrBuff = await fetchTtsResult(text);

    const buffer = Buffer.from(arrBuff);

    const base64String = buffer.toString("base64");

    res.status(200).json({ base64String });
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running on port ${port}`);
});
