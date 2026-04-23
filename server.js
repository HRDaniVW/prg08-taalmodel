import express from "express"
import { callOpenAI } from "./chat.js"

const app = express();
app.use(express.json())

app.get("/api/test", async(req, res)=> {
    const result = await callOpenAI();
    res.json({response: result});
})

app.post("/api/test", async(req, res)=> {
    const {prompt} = req.body;
    const result = await callOpenAI(prompt);
    res.json({ response: result });
})

app.use(express.static("public"));
app.listen(3000, () => console.log(`Serving on http://localhost:3000`))