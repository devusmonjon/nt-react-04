import React, { useEffect, useState } from "react";
import { login, tokenRefresh } from "./service/api.service";
import { ILogin } from "./interfaces/auth.interface";
import useAuthStore from "./store/auth.store";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState<string>("");
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

    if (username.trim() && password.trim()) {
      const response: ILogin = await login(username, password);
      if (response?.success && response?.data) {
        setStatus({
          text: "Login successful, redirecting...",
          color: "lightgreen",
        });

        setLoading(false);
        setIsAuthenticated(true);
        setAccessToken(response?.data?.access);
        setRefreshToken(response?.data?.refresh);
        localStorage.setItem("accessToken", response?.data?.access);
        localStorage.setItem("refreshToken", response?.data?.refresh);
      } else {
        console.log(response);
        setLoading(false);
        setStatus({ text: response.message, color: "red" });
      }
    } else {
      setLoading(false);
      setStatus({ text: "Please enter username and password", color: "red" });
    }
  };
  return (
    <div className="container mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col mt-10 gap-4">
        <input
          type="text"
          placeholder="Enter your username"
          className="p-4 border-black border-solid border-2 bg-transparent outline-none text-lg rounded-md"
          onChange={(event) => setUsername(event.target.value)}
          value={username}
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
          {loading ? "Loading..." : "Login"}
        </button>
        <Link
          to="/register"
          className={`p-4 bg-black text-white border-2 border-black outline-none rounded-md duration-300 hover:bg-white hover:text-black hover:border-black font-medium text-lg text-center`}
        >
          Register
        </Link>
      </form>
      <p style={{ color: status.color }} className="text mt-4">
        {status.text}
      </p>
    </div>
  );
};

export default Login;
