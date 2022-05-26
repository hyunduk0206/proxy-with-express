import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const fetchTtsResult = async () => {
    const payload = { text: "테스트" };

    const synthesize_url = `https://kakaoi-newtone-openapi.kakao.com/v1/synthesize`;
    const headers_synth = {
        "Content-Type": "application/xml",
        Authorization: `KakaoAK ${process.env.TTS_API_KEY}`,
    };
    const synth_in = `<speak> <voice name='WOMAN_DIALOG_BRIGHT'> ${payload.text} </voice> </speak>`;
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

    const data = await res.arrayBuffer();
    console.log(data);
};

fetchTtsResult();
