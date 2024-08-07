import React, { useEffect, useState } from "react";
import { register, tokenRefresh } from "./service/api.service";
import { IRegister } from "./interfaces/auth.interface";
import useAuthStore from "./store/auth.store";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [first_name, setFirstname] = useState<string>("");
  const [last_name, setLastname] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profile_photo, setProfilePhoto] = useState<File>();
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{ text: string; color: string }>({
    text: "",
    color: "",
  });

  const navigate = useNavigate();

  const {
    setIsAuthenticated,
    setAccessToken,
    setRefreshToken,
    isAuthenticated,
  } = useAuthStore();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (accessToken && refreshToken) {
      const check = async function () {
        const response = await tokenRefresh(refreshToken);
        if (response?.access) {
          setIsAuthenticated(true);
          setAccessToken(response?.access);
          localStorage.setItem("accessToken", response?.access);
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          setIsAuthenticated(false);
          setAccessToken("");
          setRefreshToken("");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
        return response;
      };

      check();
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  }, [isAuthenticated]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (
      first_name.trim() &&
      password.trim() &&
      email.trim() &&
      username.trim() &&
      profile_photo
    ) {
      const response: IRegister = await register(
        {
          first_name,
          last_name,
          username,
          email,
          password,
        },
        profile_photo
      );
      if (response?.success && response?.data) {
        setStatus({
          text: "Login successful, redirecting...",
          color: "lightgreen",
        });
        setLoading(false);
        setIsAuthenticated(true);
        setAccessToken(response?.data?.tokens?.access);
        setRefreshToken(response?.data?.tokens.refresh);
        localStorage.setItem("accessToken", response?.data?.tokens?.access);
        localStorage.setItem("refreshToken", response?.data?.tokens.refresh);
      } else {
        console.log(response);
        setStatus({ text: response.message, color: "red" });
        setLoading(false);
      }
    } else {
      setLoading(false);
      setStatus({ text: "Please fill all fields", color: "red" });
    }
  };
  return (
    <div className="container mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col mt-10 gap-4">
        <input
          type="text"
          placeholder="First Name"
          className="p-4 border-black border-solid border-2 bg-transparent outline-none text-lg rounded-md"
          onChange={(event) => setFirstname(event.target.value)}
          value={first_name}
        />
        <input
          type="text"
          placeholder="Last Name"
          className="p-4 border-black border-solid border-2 bg-transparent outline-none text-lg rounded-md"
          onChange={(event) => setLastname(event.target.value)}
          value={last_name}
        />
        <input
          type="text"
          placeholder="username"
          className="p-4 border-black border-solid border-2 bg-transparent outline-none text-lg rounded-md"
          onChange={(event) => setUsername(event.target.value)}
          value={username}
        />
        <input
          type="email"
          placeholder="Email"
          className="p-4 border-black border-solid border-2 bg-transparent outline-none text-lg rounded-md"
          onChange={(event) => setEmail(event.target.value)}
          value={email}
        />
        <input
          type="file"
          accept="image/*"
          placeholder="file"
          className="p-4 border-black border-solid border-2 bg-transparent outline-none text-lg rounded-md"
          onChange={(event) => {
            event.target.files && setProfilePhoto(event.target.files[0]);
          }}
        />
        <input
          type="password"
          placeholder="Enter your password"
          className="p-4 border-black border-solid border-2 bg-transparent outline-none text-lg rounded-md"
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
        <button
          type="submit"
          disabled={loading}
          className={`p-4 bg-black text-white border-2 border-black outline-none rounded-md duration-300 hover:bg-white hover:text-black hover:border-black font-medium text-lg text-center ${
            loading && "cursor-not-allowed opacity-50"
          }`}
        >
          {loading ? "Loading..." : "Register"}
        </button>
        <Link
          to="/login"
          className="p-4 bg-black text-white border-2 border-black outline-none rounded-md duration-300 hover:bg-white hover:text-black hover:border-black font-medium text-lg text-center"
        >
          Login
        </Link>
      </form>
      <p style={{ color: status.color }} className="text mt-4">
        {status.text}
      </p>
    </div>
  );
};

export default Register;
