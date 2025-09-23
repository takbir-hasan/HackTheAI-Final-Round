import axios from "axios";
import Complaint from "../models/complaint.js";


// --- Helper to call SmythOS Agent ---
async function callAgent(payload) {
      try {
            const res = await axios.post(process.env.SMYTH_AGENT_URL, payload, {
              headers: {
                "Authorization": `Bearer ${process.env.SMYTH_API_KEY}`,
                "Content-Type": "application/json",
              },
            });
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
        if (agentResp?.category === "complaint") {
          await new Complaint({
            category: agentResp.category || "complaint",
            type: agentResp.type || "Other",
            answer: agentResp.answer || "",
            complaint: agentResp.complaint || query,
          }).save();
        }
    
        // 3) Return whatever agent responded
        res.json({ success: true, agentResponse: agentResp });
      } catch (err) {
        console.error("Error in /ask:", err.message);
        res.status(500).json({ success: false, error: "Server error" });
      }
};
