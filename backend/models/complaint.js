import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
 user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // reference to User
  category: { type: String, default: "complaint" }, // always complaint
  type: { type: String }, // IT Issue | Facility Issue | Admin Issue
  answer: { type: String }, // answer to the complaint
  complaint: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
