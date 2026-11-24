import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";

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

const groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const initial = {
  patientName: "",
  hospital: "",
  bloodGroup: "",
  units: "1",
  division: "",
  district: "",
  upazila: "",
  contactPhone: "",
  contactEmail: "",
  details: "",
  urgency: "Urgent",
};

export default function EmergencyRequest() {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first to post an emergency request.");
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (user) {
        setForm((prev) => ({
          ...prev,
          contactPhone: user.phone || "",
          contactEmail: user.email || "",
        }));
      }
    } catch {
      // ignore
    }
  }, [navigate]);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { data } = await api.post("/api/emergencies", {
        ...form,
        units: Number(form.units),
      });

      setSuccess(data.message || "Emergency request published successfully!");

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message || "Could not post the emergency request."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 transition";

  const labelStyle = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="min-h-screen bg-[#F8F7F4]">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 md:px-16 py-5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-[#B42332] text-white p-2 rounded-xl">♥</div>

          <span className="text-2xl font-bold text-gray-900">
            rokto<span className="text-[#B42332]">dai</span>
          </span>
        </Link>

        <Link to="/" className="text-sm text-[#B42332] font-semibold">
          ← Back to home
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">

        <div className="text-center mb-10">
          <div className="inline-block bg-red-100 text-[#B42332] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🚨 EMERGENCY BROADCAST
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Post a blood request
          </h1>

          <p className="text-gray-500 mt-3">
            Donors in the same district will receive an email alert with your
            name, phone, blood group and hospital.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">

          <div className="bg-[#B42332] text-white p-6 md:p-8">
            <h2 className="text-2xl font-bold">Emergency Request Form</h2>
            <p className="text-red-100 mt-2">
              Please post only genuine requests.
            </p>
          </div>

          <form onSubmit={submit} className="p-6 md:p-10 space-y-6">

            {error && (
              <p className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 text-sm">
                {error}
              </p>
            )}

            {success && (
              <p className="bg-green-50 text-green-700 border border-green-200 rounded-xl p-4 text-sm">
                {success}
              </p>
            )}

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className={labelStyle}>Patient name *</label>
                <input
                  name="patientName"
                  value={form.patientName}
                  onChange={change}
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>Hospital / Medical centre *</label>
                <input
                  name="hospital"
                  value={form.hospital}
                  onChange={change}
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>Required blood group *</label>
                <select
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={change}
                  className={inputStyle}
                  required
                >
                  <option value="">Select blood group</option>
                  {groups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelStyle}>Number of bags / units *</label>
                <input
                  type="number"
                  name="units"
                  value={form.units}
                  onChange={change}
                  min="1"
                  max="20"
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>Division *</label>
                <select
                  name="division"
                  value={form.division}
                  onChange={change}
                  className={inputStyle}
                  required
                >
                  <option value="">Select division</option>
                  {divisions.map((division) => (
                    <option key={division} value={division}>
                      {division}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelStyle}>District *</label>
                <input
                  name="district"
                  value={form.district}
                  onChange={change}
                  placeholder="e.g. Dhaka"
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>Upazila / Thana</label>
                <input
                  name="upazila"
                  value={form.upazila}
                  onChange={change}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className={labelStyle}>Urgency</label>
                <select
                  name="urgency"
                  value={form.urgency}
                  onChange={change}
                  className={inputStyle}
                >
                  <option>Critical</option>
                  <option>Urgent</option>
                  <option>Normal</option>
                </select>
              </div>

              <div>
                <label className={labelStyle}>Contact phone *</label>
                <input
                  name="contactPhone"
                  type="tel"
                  pattern="01[3-9][0-9]{8}"
                  title="Enter a valid Bangladeshi mobile number"
                  value={form.contactPhone}
                  onChange={change}
                  placeholder="01XXXXXXXXX"
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>Contact email *</label>
                <input
                  name="contactEmail"
                  type="email"
                  value={form.contactEmail}
                  onChange={change}
                  placeholder="you@example.com"
                  className={inputStyle}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelStyle}>Additional information</label>
                <textarea
                  name="details"
                  value={form.details}
                  onChange={change}
                  rows="4"
                  maxLength="1000"
                  placeholder="When is blood needed?"
                  className={inputStyle}
                />
              </div>

            </div>

            <p className="text-xs text-gray-500">
              Hospital professionals must confirm donor eligibility and blood
              compatibility.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#B42332] hover:bg-[#941C29] disabled:opacity-60 text-white font-bold py-4 rounded-xl transition"
            >
              {loading ? "Publishing request..." : "Publish emergency request →"}
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}