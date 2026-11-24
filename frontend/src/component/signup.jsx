
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";

const Signup = () => {

  
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    email: "",
    division: "",
    district: "",
    upazila: "",
    address: "",
    lastDonation: "",
    available: true,
    password: "",
    confirmPassword: "",
    agree: false,
  });

 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (formData.password !== formData.confirmPassword) {
      alert("Password does not match!");
      return;
    }

    
    if (!formData.agree) {
      alert("Please accept the terms and conditions.");
      return;
    }

    try {
      
      const {
        fullName,
        confirmPassword,
        agree,
        ...rest
      } = formData;

      
      const registrationData = {
        ...rest,
        name: fullName,
      };

      
      const response = await api.post("/user/signup", registrationData);

     

if (response.data.success) {
  alert("Registration successful! Please verify your email.");

  sessionStorage.setItem(
    "roktodai_pending_email",
    response.data.email || formData.email
  );

  navigate("/verify-email", {
    state: { email: response.data.email || formData.email }
  });

} else {
  alert(response.data.message || "Registration failed!");
}


    } catch (error) {
      console.error("Registration Error:", error);

      alert(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    }
  };
  const inputStyle =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 transition";

  const labelStyle =
    "block text-sm font-semibold text-gray-700 mb-2";

  const bloodGroups = [
    "A+", "A-", "B+", "B-",
    "AB+", "AB-", "O+", "O-",
  ];

  const divisions = [
    "Dhaka",
    "Chattogram",
    "Rajshahi",
    "Khulna",
    "Barishal",
    "Sylhet",
    "Rangpur",
    "Mymensingh",
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4]">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 md:px-16 py-5 flex justify-between items-center">

        <Link to="/" className="flex items-center gap-2">
          <div className="bg-[#B42332] text-white p-2 rounded-xl">
            ♥
          </div>

          <span className="text-2xl font-bold text-gray-900">
            rokto<span className="text-[#B42332]">dai</span>
          </span>
        </Link>

        <div className="text-sm text-gray-600">
          Already have an account?

          <Link
            to="/login"
            className="text-[#B42332] font-bold ml-2"
          >
            Login
          </Link>
        </div>

      </nav>


      
      <main className="max-w-6xl mx-auto px-4 py-12">

        <div className="text-center mb-10">

          <div className="inline-block bg-red-100 text-[#B42332] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            ♥ Join Our Blood Donor Community
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Become a Blood Donor
          </h1>

          <p className="text-gray-500 mt-3">
            Create your account and become someone's hope.
          </p>

        </div>


        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">

          <div className="bg-[#B42332] text-white p-6 md:p-8">

            <h2 className="text-2xl font-bold">
              Donor Registration
            </h2>

            <p className="text-red-100 mt-2">
              Please provide accurate information to join Rokto Dai.
            </p>

          </div>


          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-10">

            
            <section>

              <div className="flex items-center gap-3 mb-6">

                <div className="bg-red-100 text-[#B42332] p-3 rounded-xl">
                  👤
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Personal Information
                  </h3>

                  <p className="text-sm text-gray-500">
                    Tell us about yourself.
                  </p>
                </div>

              </div>


              <div className="grid md:grid-cols-2 gap-5">

                <div>
                  <label className={labelStyle}>
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={inputStyle}
                    autoComplete="name"
                    required
                  />
                </div>


                <div>
                  <label className={labelStyle}>
                    Date of Birth *
                  </label>

                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                  />
                </div>


                <div>
                  <label className={labelStyle}>
                    Gender (Optional)
                  </label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">
                      Prefer not to say
                    </option>
                  </select>
                </div>


                <div>
                  <label className={labelStyle}>
                    Blood Group *
                  </label>

                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                  >
                    <option value="">Select Blood Group</option>

                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}

                  </select>
                </div>

              </div>

            </section>


            <hr className="border-gray-200" />


            <section>

              <div className="flex items-center gap-3 mb-6">

                <div className="bg-red-100 text-[#B42332] p-3 rounded-xl">
                  📞
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Contact Information
                  </h3>

                  <p className="text-sm text-gray-500">
                    How can people contact you?
                  </p>
                </div>

              </div>


              <div className="grid md:grid-cols-2 gap-5">

                <div>
                  <label className={labelStyle}>
                    Phone Number *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    pattern="01[3-9][0-9]{8}"
                    title="Enter a valid Bangladeshi mobile number"
                    className={inputStyle}
                    autoComplete="tel"
                    required
                  />
                </div>


                <div>
                  <label className={labelStyle}>
                    Email Address *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    className={inputStyle}
                    autoComplete="email"
                    required
                  />
                </div>

              </div>

            </section>


            <hr className="border-gray-200" />


            
            <section>

              <div className="flex items-center gap-3 mb-6">

                <div className="bg-red-100 text-[#B42332] p-3 rounded-xl">
                  📍
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Location Information
                  </h3>

                  <p className="text-sm text-gray-500">
                    Help nearby people find blood donors.
                  </p>
                </div>

              </div>


              <div className="grid md:grid-cols-2 gap-5">

                <div>
                  <label className={labelStyle}>
                    Division *
                  </label>

                  <select
                    name="division"
                    value={formData.division}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                  >
                    <option value="">Select Division</option>

                    {divisions.map((division) => (
                      <option key={division} value={division}>
                        {division}
                      </option>
                    ))}

                  </select>
                </div>


                <div>
                  <label className={labelStyle}>
                    District *
                  </label>

                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Enter your district"
                    className={inputStyle}
                    required
                  />
                </div>


                <div>
                  <label className={labelStyle}>
                    Upazila / Thana *
                  </label>

                  <input
                    type="text"
                    name="upazila"
                    value={formData.upazila}
                    onChange={handleChange}
                    placeholder="Enter Upazila or Thana"
                    className={inputStyle}
                    required
                  />
                </div>


                <div>
                  <label className={labelStyle}>
                    Area / Village / Road *
                  </label>

                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your area or address"
                    className={inputStyle}
                    autoComplete="street-address"
                    required
                  />
                </div>

              </div>

              <p className="text-xs text-gray-500 mt-3">
                Your exact residential address should not be shown publicly.
                Use your general area for donor discovery.
              </p>

            </section>


            <hr className="border-gray-200" />


            
            <section>

              <div className="flex items-center gap-3 mb-6">

                <div className="bg-red-100 text-[#B42332] p-3 rounded-xl">
                  🩸
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Donation Information
                  </h3>

                  <p className="text-sm text-gray-500">
                    Tell us about your donation availability.
                  </p>
                </div>

              </div>


              <div className="grid md:grid-cols-2 gap-5">

                <div>
                  <label className={labelStyle}>
                    Last Blood Donation Date (Optional)
                  </label>

                  <input
                    type="date"
                    name="lastDonation"
                    value={formData.lastDonation}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                    className={inputStyle}
                  />
                </div>


                <div className="flex items-center bg-red-50 rounded-xl p-4 gap-3">

                  <input
                    type="checkbox"
                    id="available"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                    className="w-5 h-5 accent-red-700"
                  />

                  <label
                    htmlFor="available"
                    className="text-sm font-semibold text-gray-700"
                  >
                    I am interested in donating blood.
                  </label>

                </div>

              </div>

              <p className="text-xs text-gray-500 mt-3">
                Availability does not mean medical eligibility. Actual
                donation eligibility must be assessed by a qualified
                blood donation professional.
              </p>

            </section>


            <hr className="border-gray-200" />


            {/* ACCOUNT SECURITY */}
            <section>

              <div className="flex items-center gap-3 mb-6">

                <div className="bg-red-100 text-[#B42332] p-3 rounded-xl">
                  🔒
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Account Security
                  </h3>

                  <p className="text-sm text-gray-500">
                    Create a secure password.
                  </p>
                </div>

              </div>


              <div className="grid md:grid-cols-2 gap-5">

                <div>
                  <label className={labelStyle}>
                    Password *
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    minLength="8"
                    autoComplete="new-password"
                    className={inputStyle}
                    required
                  />
                </div>


                <div>
                  <label className={labelStyle}>
                    Confirm Password *
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    minLength="8"
                    autoComplete="new-password"
                    className={inputStyle}
                    required
                  />
                </div>

              </div>

            </section>


            
            <div className="bg-gray-50 p-5 rounded-xl">

              <label className="flex items-start gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  className="w-5 h-5 mt-1 accent-red-700"
                  required
                />

                <span className="text-sm text-gray-600">
                  I agree to the Terms and Conditions and Privacy Policy
                  of Rokto Dai. I understand that my contact information
                  will be handled securely.
                </span>

              </label>

            </div>


           
            <button
              type="submit"
              className="w-full bg-[#B42332] hover:bg-[#941C29] text-white font-bold py-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg"
            >
              Create Donor Account →
            </button>


            <p className="text-center text-sm text-gray-500">
              Already registered?

              <Link
                to="/login"
                className="text-[#B42332] font-bold ml-1"
              >
                Sign In
              </Link>
            </p>

          </form>

        </div>


        
        <p className="text-center text-sm text-gray-400 mt-8">
          ♥ Every drop counts. Every donor matters.
        </p>

      </main>

    </div>
  );
};

export default Signup;

