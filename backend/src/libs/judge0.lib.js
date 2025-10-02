import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const getJudge0LanguageId = (language) => {
    const langMap = {
      "PYTHON": 71,
      "JAVA": 62,
      "CPP": 54,
      "JAVASCRIPT": 63,
    };
    return langMap[language.toUpperCase()] || null;
};

export const getLanguageName = (language_id)=>{
    const langMap = {
      71: "PYTHON",
      62: "JAVA",
      54: "CPP",
      63: "JAVASCRIPT",
    };
    return langMap[language_id] || null;
} 

export const submitBatch = async (submissions) => {
    const { data } = await axios.post(
      `${process.env.JUDGE0_API_BASE_URL}/submissions/batch?base64_encoded=false`,
      {
        submissions,
      }
    );
    if(process.env.NODE_ENV === "development") console.log("Submissions response: ",data);
    return data;    // Returns an array of submission IDs : [{token1}, {token2}, ...]
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBatchResult = async(tokens) => {
    while (true) {
        const { data } = await axios.get(
          `${process.env.JUDGE0_API_BASE_URL}/submissions/batch`,
          {
            params: {
              tokens: tokens.join(","),
              base64_encoded: false,
            },
          }
        );

        const results = data.submissions;
        
        const isAllDone =  results.every((result)=> result.status.id !== 1 && result.status.id !== 2);
        
        if(isAllDone){
            return results;
        }

        await sleep(1000);
    }
}