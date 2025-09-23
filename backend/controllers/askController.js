import axios from "axios";
import Complaint from "../models/complaint.js";


// --- Helper to call SmythOS Agent ---
async function callAgent(payload) {
      try {
            // const res = await axios.post(process.env.SMYTH_AGENT_URL, payload, {
            //   headers: {
            //     "Authorization": `Bearer ${process.env.ACCESS_TOKEN_SECRET}`,
            //     "Content-Type": "application/json",
            //   },
            // });
            // return res.data;
            console.log(process.env.SMYTH_AGENT_URL);
            const res = await axios.post(process.env.SMYTH_AGENT_URL, payload);
            return res.data;
          } catch (err) {
            console.error("Agent call error:", err.response?.data || err.message);
            return { error: true, message: "Agent error" };
          }
}

// --- Main Endpoint ---
export const askQuestion = async (req, res) => {
      const { query, notices = {}, faq = {} } = req.body;
      if (!query) return res.status(400).json({ success: false, error: "Query required" });
    
      try {
        // 1) Call single agent (complaint/notice/faq handled inside agent)
        const agentResp = await callAgent({ query, notices, faq });
    
        // 2) If complaint → save to DB
        let parsedResp = agentResp;
        if (typeof agentResp?.response === "string") {
          try {
            parsedResp = JSON.parse(agentResp.response);
          } catch (e) {
            console.error("JSON parse error:", e.message);
          }
        }
      
        if (parsedResp?.category === "complaint") {
          await new Complaint({
            category: parsedResp.category || "complaint",
            type: parsedResp.type || "Other",
            answer: parsedResp.answer || "",
            complaint: parsedResp.complaint || query,
          }).save();
        }
    
        // 3) Return response
        res.json({ success: true, agentResponse: parsedResp });
      } catch (err) {
        console.error("Error in /ask:", err.message);
        res.status(500).json({ success: false, error: "Server error" });
      }
};
