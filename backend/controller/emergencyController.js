import Emergency from "../model/Emergency.js";
import User from "../model/user.schema.js";
import { sendEmail } from "../utils/sendEmail.js";


const ONLY_SAME_BLOOD_GROUP = false;

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const escapeHtml = (text = "") =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");


export const createEmergency = async (req, res) => {
  try {
    const {
      patientName, hospital, bloodGroup, units, division,
      district, upazila, contactPhone, contactEmail, details, urgency
    } = req.body;

    if (!patientName || !hospital || !bloodGroup || !units ||
        !division || !district || !contactPhone || !contactEmail) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

   
    const emergency = await Emergency.create({
      patientName, hospital, bloodGroup, units, division,
      district, upazila, contactPhone, contactEmail, details, urgency,
      requestedBy: req.user._id
    });

    const divRegex = new RegExp(escapeRegex(division.trim()), "i");
    const disRegex = new RegExp(escapeRegex(district.trim()), "i");

    const filter = {
      isDonor: { $ne: false },
      isAvailable: { $ne: false },
      isVerified: { $ne: false },
      _id: { $ne: req.user._id },
      $or: [{ division: divRegex }, { district: disRegex }]
    };

    if (ONLY_SAME_BLOOD_GROUP) {
      filter.bloodGroup = bloodGroup;
    }

    const donors = await User.find(filter).select("email");

    const emails = [
      ...new Set(
        donors
          .map((d) => (d.email || "").trim().toLowerCase())
          .filter((mail) => mail && mail !== contactEmail.trim().toLowerCase())
      )
    ];

   
    const totalUsers = await User.countDocuments();
    const withDivision = await User.countDocuments({ division: { $exists: true, $ne: "" } });
    console.log("---- EMERGENCY DEBUG ----");
    console.log("Request:", { division, district, bloodGroup });
    console.log("Total users:", totalUsers, "| Users with division field:", withDivision);
    console.log("Matched donors:", donors.length, "| After removing requester email:", emails.length);

    console.log(
      `Emergency: ${bloodGroup} | ${division}/${district} | Matched donors: ${emails.length}`
    );

    
    let sent = 0;
    let lastMailError = "";

    if (emails.length > 0) {
      const subject = `Emergency: ${bloodGroup} blood needed at ${hospital}`;

      const html = `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;border:2px solid #B42332;border-radius:12px;overflow:hidden">
          <div style="background:#B42332;color:#fff;padding:16px 20px">
            <h2 style="margin:0">Emergency Blood Request</h2>
            <p style="margin:4px 0 0">${escapeHtml(urgency || "Urgent")}</p>
          </div>
          <div style="padding:20px;color:#222;line-height:1.7">
            <p><b>Patient:</b> ${escapeHtml(patientName)}</p>
            <p><b>Phone:</b> ${escapeHtml(contactPhone)}</p>
            <p><b>Blood Group:</b> ${escapeHtml(bloodGroup)}</p>
            <p><b>Bags needed:</b> ${escapeHtml(units)}</p>
            <p><b>Hospital:</b> ${escapeHtml(hospital)}</p>
            <p><b>Location:</b> ${escapeHtml(upazila ? upazila + ", " : "")}${escapeHtml(district)}, ${escapeHtml(division)}</p>
            ${details ? `<p><b>Details:</b> ${escapeHtml(details)}</p>` : ""}
            <p style="margin-top:20px">Apni help korte parle upore deya number e jogajog korun.</p>
            <p style="font-size:12px;color:#777">Rokto Dai: Blood donation must always be voluntary. Hospital professionals must confirm eligibility.</p>
          </div>
        </div>`;

      
      for (let i = 0; i < emails.length; i += 50) {
        const chunk = emails.slice(i, i + 50);
        try {
          await sendEmail({
            to: process.env.EMAIL_USER,
            bcc: chunk,
            subject,
            html
          });
          sent += chunk.length;
        } catch (mailError) {
          lastMailError = mailError.message;
          console.log("Email Error:", mailError.message);
        }
      }
    }

    emergency.notifiedCount = sent;
    await emergency.save();

    let message;
    if (emails.length === 0) {
      message = "Request published, but no matching donor was found in this division/district yet.";
    } else if (sent === 0) {
      message = `Request published, but emails could not be sent. ${lastMailError}`;
    } else {
      message = `Request published. ${sent} donor(s) were notified by email.`;
    }

    return res.status(201).json({ success: true, message, notified: sent, emergency });
  } catch (error) {
    console.log("Emergency Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to publish emergency request"
    });
  }
};


export const getEmergencies = async (req, res) => {
  try {
    const emergencies = await Emergency.find()
      .select("patientName hospital bloodGroup units division district upazila urgency details createdAt")
      .sort({ createdAt: -1 })
      .limit(6);

    return res.status(200).json({ success: true, emergencies });
  } catch (error) {
    console.log("Get Emergencies Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load emergency requests"
    });
  }
};