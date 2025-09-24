import Complaint from "../models/complaint.js";

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
export const getAllComplaints = async (req, res) => {
  try {
    // populate user info (name, email)
    const complaints = await Complaint.find().populate("user", "name email");
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};