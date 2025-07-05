import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { validateEmail } from "../../utils/helper";

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!name) {
      setError("Please enter full name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Enter a valid email address");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setError(""); // clear errors

    try {
      // TODO: Add actual signup API logic here
      console.log({ name, email, password, profilePic });
      // navigate("/dashboard"); // after success, if needed
    } catch (error) {
      if (error.response && error.response.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h3>
      <p className="text-sm text-gray-600 mb-6">
        Please enter your details to register.
      </p>

      <form onSubmit={handleSignUp} className="space-y-4">
        {/* Profile Picture */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
        </div>

        {/* Name */}
        <Input
          value={name}
          onChange={({ target }) => setName(target.value)}
          label="Full Name"
          placeholder="e.g. Arkaprava Ghosh"
          type="text"
        />

        {/* Email */}
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email Address"
          placeholder="arka1234@gmail.com"
          type="text"
        />

        {/* Password */}
        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Enter at least 8 characters"
          type="password"
        />

        {/* Error Display */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Sign Up
        </button>

        {/* Switch to Login */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => setCurrentPage("login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
