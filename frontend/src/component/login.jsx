
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:4001/user/login",
        formData
      );

      const data = response.data;

      if (data.success) {

        localStorage.setItem("token", data.token);

       
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        alert("Login successful!");

      
        navigate("/");

      }
      
} catch (error) {

  console.log("Login Error:", error);

  if (error.response?.data?.needVerify) {
    navigate("/verify-email", {
      state: { email: error.response.data.email }
    });
    return;
  }

  alert(
    error.response?.data?.message ||
    "Login failed. Please try again."
  );

}

    finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-[#F8F7F4] min-h-screen">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 md:px-16 py-5 bg-white border-b border-gray-200">

        <Link to="/" className="flex items-center gap-2">

          <div className="bg-[#B42332] text-white p-2 rounded-xl">
            ♥
          </div>

          <span className="text-xl font-bold text-[#252525]">
            rokto<span className="text-[#B42332]">dai</span>
          </span>

        </Link>

        <div className="text-sm text-gray-600">
          Don't have an account?

          <Link
            to="/register"
            className="text-[#B42332] font-semibold ml-1"
          >
            Sign up
          </Link>
        </div>

      </nav>


   
      <main className="min-h-[85vh] flex items-center justify-center px-5 py-12">

        <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200">


      
          <div className="bg-red-800 text-white p-10 flex flex-col justify-between min-h-[600px]">

            <div>

              <p className="text-sm font-semibold tracking-widest text-red-100">
                ROKTO DAI COMMUNITY
              </p>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight mt-8">
                Your one donation can save a life.
              </h1>

              <p className="text-red-100 mt-5 leading-7">
                Connect with blood donors, find emergency
                blood support and become someone's hope.
              </p>

            </div>


            <div className="mt-12 border-t border-red-300/40 pt-6">

              <div className="flex items-center gap-3">

                <div className="bg-white/15 p-3 rounded-full">
                  ♥
                </div>

                <div>

                  <p className="font-semibold">
                    Give blood, save lives.
                  </p>

                  <p className="text-sm text-red-100">
                    Together we can make a difference.
                  </p>

                </div>

              </div>

            </div>

          </div>


         
          <div className="p-8 md:p-14 flex flex-col justify-center">

            <div className="mb-8">

              <p className="text-sm text-[#B42332] font-semibold">
                WELCOME BACK
              </p>

              <h2 className="text-3xl font-bold text-[#252525] mt-2">
                Sign in to your account
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                Enter your details to continue.
              </p>

            </div>


            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              
              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl outline-none focus:border-[#B42332] focus:ring-2 focus:ring-red-100 transition"
                />

              </div>


              
              <div>

                <div className="flex justify-between mb-2">

                  <label className="text-sm font-semibold text-gray-700">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#B42332] font-medium"
                  >
                    Forgot password?
                  </Link>

                </div>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl outline-none focus:border-[#B42332] focus:ring-2 focus:ring-red-100 transition"
                />

              </div>


              <div className="flex items-center gap-2">

                <input
                  type="checkbox"
                  id="remember"
                  className="accent-[#B42332] w-4 h-4"
                />

                <label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </label>

              </div>


              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#B42332] hover:bg-[#941C29] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition duration-200"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

            </form>


            <p className="text-center text-sm text-gray-500 mt-7">

              Don't have an account?

              <Link
                to="/register"
                className="text-[#B42332] font-semibold ml-1"
              >
                Create account
              </Link>

            </p>

          </div>

        </div>

      </main>

    </div>
  );
};

export default Login;
