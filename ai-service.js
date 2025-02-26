
import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sendRequest = async (comments) => {
  const prompt = `You are given a numbered list of YouTube comments. 
    Your task is to analyze the overall sentiment of the comments, 
    ignoring any comments related to timestamps or promotions. 
    Provide a short analysis of the sentiment, in no more than 400 characters, 
    without mentioning specific comments.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent([prompt, comments]);
        const response = await result.response;
        const text = response.text();
        return text; 
  } catch (error) {
    console.error("Error in processing the request:", error);
  }
};

export default sendRequest;
