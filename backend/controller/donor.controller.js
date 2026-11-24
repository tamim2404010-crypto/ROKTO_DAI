
import User from "../model/user.schema.js";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const escapeRegex = (text) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");


export const getDonors = async (req, res) => {
  try {
    let { bloodGroup, district } = req.query;

    const filter = {
      isDonor: true,
      isAvailable: true,
      isVerified: true
    };

   
    if (bloodGroup && bloodGroup.trim()) {
      const group = bloodGroup.replace(/ /g, "+").trim();

      if (!BLOOD_GROUPS.includes(group)) {
        return res.status(400).json({
          success: false,
          message: "Invalid blood group"
        });
      }

      filter.bloodGroup = group;
    }

   
    if (district && district.trim()) {
      const cleanDistrict = escapeRegex(district.trim());

      filter.district = {
        $regex: `^${cleanDistrict}$`,
        $options: "i"
      };
    }

    console.log("DONOR SEARCH FILTER:", filter);

    const donors = await User.find(filter)
      .select("name bloodGroup division district upazila isAvailable lastDonationDate")
      .sort({ createdAt: -1 });

    console.log("FOUND DONORS:", donors.length);

    return res.status(200).json({
      success: true,
      count: donors.length,
      donors
    });

  } catch (error) {
    console.log("Donor Search Error:", error);

    return res.status(500).json({
      success: false,
      message: "Donor search failed",
      error: error.message
    });
  }
};


export const getDonorContact = async (req, res) => {
  try {
    const donor = await User.findOne({
      _id: req.params.id,
      isDonor: true,
      isAvailable: true,
      isVerified: true
    }).select("name phone");

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not found"
      });
    }

    return res.status(200).json({
      success: true,
      phone: donor.phone
    });

  } catch (error) {
    console.log("Donor Contact Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load contact"
    });
  }
};
