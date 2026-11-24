
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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

const emptySearch = {
  blood: "",
  district: "",
};

const Home = () => {
 
  const [search, setSearch] = useState(emptySearch);

  const [donors, setDonors] = useState([]);


  const [emergencies, setEmergencies] = useState([]);

 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [phones, setPhones] = useState({});

  const [hasSearched, setHasSearched] = useState(false);

  const donorResultsRef = useRef(null);

  
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setPhones({});
  };

  const fetchDonors = async (params = {}) => {
    try {
      setLoading(true);
      setError("");

      const searchParams = {};

      if (params.bloodGroup) {
        searchParams.bloodGroup = params.bloodGroup;
      }

      if (params.district?.trim()) {
        searchParams.district = params.district.trim();
      }

      // Backend API request
      const response = await api.get("/api/donors", {
        params: searchParams,
      });

      const data = response.data;

     
      const donorList = Array.isArray(data.donors)
        ? data.donors
        : [];

      setDonors(donorList);

      console.log("FRONTEND API RESPONSE:", data);
      console.log("DONORS RECEIVED:", donorList);
      console.log("TOTAL DONORS:", donorList.length);

      return donorList;

    } catch (err) {
      console.log(
        "DONOR LOAD ERROR:",
        err.response?.data || err.message
      );

      setDonors([]);
      setError(
        "Could not load donors. Please check that the backend is running."
      );

      return [];

    } finally {
      setLoading(false);
    }
  };

  const fetchEmergencies = async () => {
    try {
      const { data } = await api.get("/api/emergencies");

      setEmergencies(
        Array.isArray(data.emergencies)
          ? data.emergencies
          : []
      );

    } catch (err) {
      console.log("Emergency Load Error:", err);
    }
  };

  useEffect(() => {
    fetchDonors();
    fetchEmergencies();
  }, []);

  
  const runSearch = async (values) => {
    // Search form-er value check
    const params = {
      bloodGroup: values.blood,
      district: values.district.trim(),
    };

   
    setHasSearched(true);

  
    await fetchDonors(params);

   
    setTimeout(() => {
      donorResultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };


  const handleSearch = (e) => {
    e.preventDefault();
    runSearch(search);
  };

  const handleReset = async () => {
    setSearch(emptySearch);
    setHasSearched(false);

    await fetchDonors();

 
    setTimeout(() => {
      donorResultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  
  const showPhone = async (id) => {
    try {
      const { data } = await api.get(`/api/donors/${id}/contact`);

      setPhones((previousPhones) => ({
        ...previousPhones,
        [id]: data.phone,
      }));

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Could not load phone number"
      );
    }
  };


  const inputStyle =
    "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600";

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-800">

      

      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex justify-between items-center">

          <Link to="/" className="flex items-center gap-2">
            <div className="bg-[#B42332] text-white w-11 h-11 rounded-xl flex items-center justify-center text-2xl">
              ♥
            </div>

            <span className="text-2xl font-extrabold text-gray-900">
              rokto<span className="text-[#B42332]">dai</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-gray-600">
            <a href="#home" className="hover:text-red-700">Home</a>
            <a href="#donors" className="hover:text-red-700">Find Donors</a>
            <a href="#requests" className="hover:text-red-700">Emergency</a>
            <a href="#tips" className="hover:text-red-700">Health Tips</a>
            <a href="#about" className="hover:text-red-700">About Us</a>
          </div>

          <div className="flex items-center gap-3">

            {user ? (
              <>
                <span className="hidden sm:block text-sm font-semibold text-gray-700">
                  Hi, {user.name}
                </span>

                <button
                  onClick={logout}
                  className="bg-[#B42332] hover:bg-[#941C29] text-white px-5 py-3 rounded-xl text-sm font-bold transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:block text-sm font-semibold text-gray-700 hover:text-red-700"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="bg-[#B42332] hover:bg-[#941C29] text-white px-5 py-3 rounded-xl text-sm font-bold transition"
                >
                  Become a Donor
                </Link>
              </>
            )}

          </div>
        </div>
      </nav>


      

      <section
        id="home"
        className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24"
      >
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          <div>

            <span className="bg-red-100 text-[#B42332] px-4 py-2 rounded-full text-sm font-bold">
              ♥ Voluntary Blood Donor Network
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mt-6">
              Donate Blood,
              <br />
              <span className="text-[#B42332]">Save a Life.</span>
            </h1>

            <p className="text-gray-500 mt-6 text-lg leading-8 max-w-xl">
              Rokto Dai connects voluntary blood donors with people in need
              across Bangladesh. Find a donor or send an emergency alert in
              minutes.
            </p>

            <div className="flex flex-wrap gap-4 mt-9">

              <Link
                to="/register"
                className="bg-[#B42332] text-white px-7 py-4 rounded-xl font-bold hover:bg-[#941C29] transition shadow-lg shadow-red-200"
              >
                Become a Donor →
              </Link>

              <Link
                to="/emergency-request"
                className="bg-white border border-[#B42332] text-[#B42332] px-7 py-4 rounded-xl font-bold hover:bg-red-50 transition"
              >
                🩸 Emergency Blood Request →
              </Link>

            </div>
          </div>



          <div className="relative">

            <div className="bg-[#B42332] rounded-[35px] p-8 md:p-12 text-white relative overflow-hidden min-h-[380px] flex flex-col justify-between">

              <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full border-[35px] border-white/10" />

              <div className="absolute -left-20 -bottom-28 w-80 h-80 rounded-full border-[40px] border-white/10" />

              <div className="relative z-10">

                <p className="text-red-100 font-semibold tracking-widest text-sm">
                  ROKTO DAI COMMUNITY
                </p>

                <h2 className="text-4xl md:text-5xl font-extrabold mt-8 leading-tight">
                  Every Drop
                  <br />
                  Counts.
                </h2>

                <p className="text-red-100 mt-5 leading-7 max-w-sm">
                  Your kindness could be the reason someone gets another chance at life.
                </p>

              </div>

              <div className="relative z-10 flex items-center justify-between mt-10">

                <div>
                  <p className="text-sm text-red-100">Our mission</p>
                  <p className="font-bold text-xl">Save More Lives</p>
                </div>

                <div className="w-20 h-20 rounded-full bg-white/15 flex items-center justify-center text-5xl">
                  ♥
                </div>

              </div>

            </div>

            <div className="absolute -bottom-5 -left-3 md:-left-8 bg-white p-5 rounded-2xl shadow-xl border border-gray-100">
              <p className="text-xs text-gray-500">A small act</p>
              <p className="text-lg font-extrabold text-[#B42332]">
                A big difference
              </p>
            </div>

          </div>
        </div>
      </section>


      

      <section
        id="donors"
        className="max-w-7xl mx-auto px-5 md:px-8 py-20"
      >

        <div className="text-center mb-10">

          <span className="text-[#B42332] font-bold text-sm tracking-widest">
            FIND BLOOD DONORS
          </span>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3">
            Search Blood Donors
          </h2>

          <p className="text-gray-500 mt-3">
            Find voluntary donors by blood group and location.
          </p>

        </div>


        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-9">

          <form onSubmit={handleSearch}>

            <div className="grid sm:grid-cols-2 gap-5">

              

              <div>

                <label className="block font-semibold text-sm mb-2">
                  Blood Group
                </label>

                <select
                  className={inputStyle}
                  value={search.blood}
                  onChange={(e) =>
                    setSearch({
                      ...search,
                      blood: e.target.value,
                    })
                  }
                >

                  <option value="">All Blood Groups</option>

                  {bloodGroups.map((blood) => (
                    <option key={blood} value={blood}>
                      {blood}
                    </option>
                  ))}

                </select>

              </div>


              

              <div>

                <label className="block font-semibold text-sm mb-2">
                  District
                </label>

                <input
                  type="text"
                  placeholder="Enter district name"
                  className={inputStyle}
                  value={search.district}
                  onChange={(e) =>
                    setSearch({
                      ...search,
                      district: e.target.value,
                    })
                  }
                />

              </div>

            </div>


            

            <div className="flex gap-4 mt-7">

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#B42332] hover:bg-[#941C29] disabled:opacity-60 text-white font-bold py-4 rounded-xl transition"
              >
                {loading ? "Searching..." : "Search Blood Donors →"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="px-8 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
              >
                Reset
              </button>

            </div>

          </form>
        </div>
      </section>


      

      <section className="bg-white py-20 border-y border-gray-100">

        <div className="max-w-7xl mx-auto px-5 md:px-8">

          <div className="text-center mb-12">

            <p className="text-[#B42332] font-bold text-sm tracking-widest">
              BLOOD GROUPS
            </p>

            <h2 className="text-3xl font-extrabold mt-3">
              Find Donors by Blood Group
            </h2>

            <p className="text-gray-500 mt-3">
              Choose a blood group to start your search.
            </p>

          </div>


          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">

            {bloodGroups.map((blood) => (

              <button
                key={blood}
                onClick={() => {
                  const nextSearch = {
                    ...search,
                    blood,
                  };

                  setSearch(nextSearch);
                  runSearch(nextSearch);
                }}
                className={`border border-red-100 rounded-2xl p-6 text-center hover:bg-[#B42332] hover:text-white hover:border-[#B42332] transition ${
                  search.blood === blood
                    ? "bg-[#B42332] text-white"
                    : "bg-red-50 text-[#B42332]"
                }`}
              >

                <span className="text-3xl font-extrabold">
                  {blood}
                </span>

                <p className="text-xs mt-2 font-semibold">
                  Blood Group
                </p>

              </button>

            ))}

          </div>
        </div>
      </section>


     

      <section
        ref={donorResultsRef}
        className="max-w-7xl mx-auto px-5 md:px-8 py-20 scroll-mt-24"
      >

        <div className="flex flex-wrap justify-between items-end gap-4 mb-10">

          <div>

            <p className="text-[#B42332] font-bold text-sm tracking-widest">
              DONOR NETWORK
            </p>

            <h2 className="text-3xl font-extrabold mt-3">
              Voluntary Blood Donors
            </h2>

            <p className="text-gray-500 mt-2">
              Registered donors of the Rokto Dai platform.
            </p>

            {!loading && !error && (
              <p className="text-sm text-green-700 font-semibold mt-3">
                {donors.length} donor(s) found
              </p>
            )}

          </div>

          <Link to="/register" className="text-[#B42332] font-bold">
            Become a Donor →
          </Link>

        </div>



        {loading && (
          <p className="text-center text-gray-500 py-10">
            Loading donors...
          </p>
        )}


     

        {error && (
          <p className="text-center text-red-600 py-4">
            {error}
          </p>
        )}


      

        {!loading && !error && (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {donors.map((donor) => (

              <div
                key={donor._id}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition"
              >

                <div className="flex justify-between items-center">

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-full bg-red-100 text-[#B42332] flex items-center justify-center text-2xl font-bold">
                      {donor.name?.charAt(0).toUpperCase() || "D"}
                    </div>

                    <div>

                      <h3 className="font-bold text-lg">
                        {donor.name}
                      </h3>

                      <p className="text-gray-500 text-sm">
                        Voluntary Donor
                      </p>

                    </div>

                  </div>

                  <span className="bg-red-50 text-[#B42332] rounded-xl px-4 py-3 text-xl font-extrabold">
                    {donor.bloodGroup}
                  </span>

                </div>


                <div className="border-t border-gray-100 mt-6 pt-5 space-y-3">

                  <p className="text-sm text-gray-600">
                    📍{" "}
                    {[
                      donor.upazila,
                      donor.district,
                      donor.division,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  <p className="text-sm text-green-700 font-semibold">
                    ✓ Available for contact
                  </p>

                </div>


              

                {user ? (

                  phones[donor._id] ? (

                    <a
                      href={`tel:${phones[donor._id]}`}
                      className="block text-center mt-5 bg-green-600 text-white py-3 rounded-xl font-bold"
                    >
                      📞 {phones[donor._id]}
                    </a>

                  ) : (

                    <button
                      onClick={() => showPhone(donor._id)}
                      className="block w-full text-center mt-5 border border-[#B42332] text-[#B42332] hover:bg-[#B42332] hover:text-white py-3 rounded-xl font-bold transition"
                    >
                      Show Phone Number
                    </button>

                  )

                ) : (

                  <Link
                    to="/login"
                    className="block text-center mt-5 border border-[#B42332] text-[#B42332] hover:bg-[#B42332] hover:text-white py-3 rounded-xl font-bold transition"
                  >
                    Sign In to Contact
                  </Link>

                )}

              </div>

            ))}


         

            {donors.length === 0 && (

              <p className="col-span-full text-center text-gray-500 py-10">
                No matching donors found. Try another search.
              </p>

            )}

          </div>

        )}

      </section>



      <section id="requests" className="bg-[#FFF4F4] py-20">

        <div className="max-w-7xl mx-auto px-5 md:px-8">

          <div className="text-center mb-12">

            <p className="text-[#B42332] font-bold text-sm tracking-widest">
              EMERGENCY BROADCAST
            </p>

            <h2 className="text-3xl md:text-4xl font-extrabold mt-3">
              Emergency Blood Requests
            </h2>

            <p className="text-gray-500 mt-3">
              Help patients find voluntary blood donors.
            </p>

          </div>


          <div className="grid md:grid-cols-2 gap-6">

            {emergencies.map((request) => (

              <div
                key={request._id}
                className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm"
              >

                <div className="flex justify-between items-center">

                  <span className="bg-red-100 text-[#B42332] text-2xl font-extrabold px-5 py-4 rounded-xl">
                    {request.bloodGroup}
                  </span>

                  <span className="bg-red-50 text-red-700 text-xs font-bold px-4 py-2 rounded-full">
                    {request.urgency}
                  </span>

                </div>

                <h3 className="text-xl font-bold mt-5">
                  {request.patientName}
                </h3>

                <div className="text-gray-500 text-sm space-y-2 mt-3">

                  <p>🏥 {request.hospital}</p>

                  <p>
                    📍{" "}
                    {[request.upazila, request.district]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  <p>🩸 Required: {request.units} Bag(s)</p>

                </div>

                {user ? (

                  <p className="text-xs text-gray-400 mt-6">
                    Contact details were sent to matching donors by email.
                  </p>

                ) : (

                  <Link
                    to="/login"
                    className="block text-center mt-6 bg-[#B42332] text-white py-3 rounded-xl font-bold hover:bg-[#941C29] transition"
                  >
                    Sign In to Volunteer
                  </Link>

                )}

              </div>

            ))}


            {emergencies.length === 0 && (

              <p className="col-span-full text-center text-gray-500 py-6">
                No emergency requests right now.
              </p>

            )}

          </div>


          <div className="text-center mt-10">

            <Link
              to="/emergency-request"
              className="bg-[#B42332] hover:bg-[#941C29] text-white font-bold px-7 py-4 rounded-xl inline-block transition"
            >
              🩸 Post Emergency Request →
            </Link>

          </div>

        </div>
      </section>


      

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-20">

        <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12">

          <div className="text-center mb-12">

            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
              🛡 Safety First
            </span>

            <h2 className="text-3xl font-extrabold mt-5">
              Important Safety Notice
            </h2>

            <p className="text-gray-500 mt-3">
              Blood donation is a humanitarian service, not a business.
            </p>

          </div>


          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">

            {[
              [
                "Voluntary Donation",
                "Blood donation should always be voluntary and based on informed consent.",
              ],
              [
                "No Financial Transactions",
                "Never buy or sell blood. Do not pay anyone for arranging a donor.",
              ],
              [
                "Medical Safety",
                "Donation eligibility must be assessed by qualified medical professionals.",
              ],
              [
                "Protect Privacy",
                "Do not share personal information or exact residential addresses publicly.",
              ],
            ].map(([title, description]) => (

              <div key={title} className="text-center">

                <div className="w-14 h-14 bg-green-50 text-green-700 rounded-2xl flex items-center justify-center text-2xl mx-auto">
                  ✓
                </div>

                <h3 className="font-bold mt-5">
                  {title}
                </h3>

                <p className="text-sm text-gray-500 mt-3 leading-6">
                  {description}
                </p>

              </div>

            ))}

          </div>

        </div>
      </section>


      {/* ================= HEALTH TIPS ================= */}

      <section id="tips" className="bg-white border-y border-gray-100 py-20">

        <div className="max-w-7xl mx-auto px-5 md:px-8">

          <div className="text-center mb-12">

            <p className="text-[#B42332] font-bold text-sm tracking-widest">
              HEALTH & EDUCATION
            </p>

            <h2 className="text-3xl font-extrabold mt-3">
              Blood Donation Tips & Guidelines
            </h2>

            <p className="text-gray-500 mt-3">
              Learn how to prepare for and recover from blood donation.
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-7">

            {[
              [
                "Why Donate Blood?",
                "Understand the importance of voluntary blood donation and its impact on the community.",
                "01",
              ],
              [
                "Before Blood Donation",
                "Learn about preparation, hydration and discussing eligibility with medical staff.",
                "02",
              ],
              [
                "After Blood Donation",
                "Follow professional aftercare advice and take time to recover.",
                "03",
              ],
            ].map(([title, description, number]) => (

              <article
                key={number}
                className="border border-gray-200 rounded-2xl p-7 hover:shadow-lg transition"
              >

                <div className="bg-red-50 text-[#B42332] w-14 h-14 rounded-xl flex items-center justify-center text-xl font-extrabold">
                  {number}
                </div>

                <h3 className="text-xl font-bold mt-6">
                  {title}
                </h3>

                <p className="text-gray-500 leading-7 mt-3">
                  {description}
                </p>

                <a
                  href="#about"
                  className="inline-block mt-6 text-[#B42332] font-bold"
                >
                  Learn More →
                </a>

              </article>

            ))}

          </div>
        </div>
      </section>


     

      <section className="bg-[#B42332] text-white py-16">

        <div className="max-w-5xl mx-auto text-center px-5">

          <h2 className="text-3xl md:text-4xl font-extrabold">
            Be Someone's Hero Today.
          </h2>

          <p className="text-red-100 mt-5 text-lg">
            Join the Rokto Dai community and help connect voluntary blood donors with people in need.
          </p>

          <Link
            to="/register"
            className="inline-block mt-8 bg-white text-[#B42332] px-8 py-4 rounded-xl font-extrabold hover:bg-red-50 transition"
          >
            Register as a Donor →
          </Link>

        </div>
      </section>


    

      <footer id="about" className="bg-[#191919] text-white pt-16 pb-8">

        <div className="max-w-7xl mx-auto px-5 md:px-8">

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">

            

            <div>

              <Link to="/" className="text-3xl font-extrabold">
                rokto<span className="text-red-500">dai</span>
              </Link>

              <p className="text-gray-400 text-sm leading-7 mt-5">
                Connecting voluntary blood donors with people in need across Bangladesh. Together, we can save lives.
              </p>

            </div>


          

            <div>

              <h3 className="font-bold text-lg mb-5">
                Quick Links
              </h3>

              <div className="space-y-3 text-gray-400 text-sm flex flex-col">

                <a href="#home" className="hover:text-white">
                  Home
                </a>

                <a href="#donors" className="hover:text-white">
                  Find Donors
                </a>

                <a href="#requests" className="hover:text-white">
                  Emergency Requests
                </a>

                <Link to="/register" className="hover:text-white">
                  Become a Donor
                </Link>

              </div>
            </div>


            

            <div>

              <h3 className="font-bold text-lg mb-5">
                Blood Groups
              </h3>

              <div className="grid grid-cols-4 gap-2">

                {bloodGroups.map((blood) => (

                  <span
                    key={blood}
                    className="bg-white/10 text-white text-center py-2 rounded-lg text-sm"
                  >
                    {blood}
                  </span>

                ))}

              </div>
            </div>


         

            <div>

              <h3 className="font-bold text-lg mb-5">
                Contact
              </h3>

              <div className="space-y-4 text-gray-400 text-sm">

                <p>📍 Bangladesh</p>

                <p>♥ Donate Blood, Save Lives</p>

                <Link to="/login" className="block hover:text-white">
                  Sign In
                </Link>

              </div>
            </div>

          </div>


         

          <div className="border-t border-white/10 pt-7 flex flex-col md:flex-row justify-between gap-4 text-gray-500 text-sm">

            <p>
              © {new Date().getFullYear()} Rokto Dai. All rights reserved.
            </p>

            <p>
              Made with ♥ for humanity in Bangladesh.
            </p>

          </div>

        </div>
      </footer>

    </div>
  );
};

export default Home;
