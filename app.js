import dotenv from "dotenv";
import express, { text } from "express";
import { google } from "googleapis";
import util from "./util.js";
import sendRequest from "./ai-service.js";
import cors from "cors";
import path from "path";

dotenv.config(); 

const app = express();
const PORT = 3000;

app.use(cors({
    origin: "*", // Allow all origins (or specify your extension URL)
    methods: ["GET"],
}));

// //cors
// app.use((req,res,next) => {
//     res.header('Access-Control-Allow-Origin','*');
//     res.header('Access-Control-Allow-Methods','GET');
//     next();
// })

app.use(express.static("public"));

app.get('/', (req,res) => {
    res.sendFile(path.join(process.cwd(), "public", "body.png"));
})
app.get('/analyze/:videoid', async (req,res) => {
    const videoId = req.params.videoid;

    try {
        const youtube = google.youtube('v3');
        const response = await youtube.commentThreads.list({
            part: 'snippet',
            videoId: videoId,
            maxResults: 100,
            order: 'relevance',
            auth: process.env.YOUTUBE_API_KEY

        })

        const topLevelComments = response.data.items;
        if(!topLevelComments || topLevelComments.length === 0){
            return res.status(200).send("No Comments");
        }

        const comments = topLevelComments.map(item => ({
            text: item.snippet.topLevelComment.snippet.textOriginal,
            likeCount: item.snippet.topLevelComment.snippet.likeCount
        }))

        const commentWithoutTimestamps = util.filterTimestamps(comments);
        const commentsText = commentWithoutTimestamps.map((c,i) => `${i+1} ${c.text}` )

        const aiResponse = await sendRequest(commentsText.join());
        console.log(aiResponse);
        res.send(aiResponse);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to process"});
    }
    // res.send(`Analyzing video with ID: ${videoId}`);
});

app.listen(PORT , () => {
    console.log(`Server is running on port: ${PORT}`);
    
})