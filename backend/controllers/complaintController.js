import Complaint from "../models/complaint.js";
import sendEmail from "../utils/sendEmail.js"; 

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


// @desc    Update complaint status
// @route   PATCH /api/complaints/:id/status
// @access  Private
export const updateComplaintStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // expected: 'Pending' | 'In-progress' | 'Resolved'

  if (!status || !["Pending", "In-progress", "Resolved"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const complaint = await Complaint.findById(id).populate("user","name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = status;
    await complaint.save();

    // Send email to the complaint owner
    if (complaint.user?.email) {
      const subject = `Your complaint status has been updated`;
      const html = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <p>Dear ${complaint.user?.name || "Valued User"},</p>

          <p>
            We are writing to inform you that the status of your complaint has been
            updated in our system.
          </p>

          <p style="margin: 12px 0; padding: 10px; background: #f4f6f8; border-left: 4px solid #2a9d8f;">
            <strong>Complaint:</strong> ${complaint.complaint}<br/>
            <strong>New Status:</strong> 
            <span style="color: ${status === "resolved" ? "#2e7d32" : status === "in-progress" ? "#1565c0" : "#f57c00"}; font-weight: bold;">
              ${status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </p>

          <p>
            Please rest assured that our team is actively working to ensure your issue 
            is addressed as quickly as possible. 
            You will receive further updates if any additional action is required.
          </p>

          <p>Thank you for your patience and trust in our support team.</p>

          <br/>
          <p>
            Best regards,<br/>
            <strong>Support Team</strong><br/>
            Team_RAFSANTAK
          </p>
        </div>
      `;


      await sendEmail({
        to: complaint.user.email,
        subject,
        html,
      });
    }

    res.status(200).json({ message: `Complaint status updated to '${status}'`, data: complaint });
  } catch (error) {
    console.error("Error updating complaint status:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};