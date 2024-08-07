import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { IUser } from "./interfaces/user.interface";
import { getUser, tokenRefresh } from "./service/api.service";
import useAuthStore from "./store/auth.store";

const Users = () => {
  let { id } = useParams();
  const [user, setUser] = useState<IUser>();

  const {
    isAuthenticated,
    setIsAuthenticated,
    setAccessToken,
    setRefreshToken,
  } = useAuthStore();

  const navigate = useNavigate();

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
          const getUserr = async () => {
            // @ts-ignore
            setUser(await getUser(id, accessToken).data);
          };
          getUserr();
        } else {
          setIsAuthenticated(false);
          setAccessToken("");
          setRefreshToken("");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/login");
        }
        return response;
      };

      check();

      setIsAuthenticated(true);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      const getUserr = async () => {
        // @ts-ignore
        const res = await getUser(id, accessToken);
        setUser(res.data);
      };
      getUserr();
      console.log("Sds");
    } else {
      navigate("/login");
    }
  }, [isAuthenticated]);
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto mt-10">
      <div className="flex gap-10">
        <img
          src={user?.profile_photo}
          alt={user?.first_name}
          className="rounded w-[300px] object-cover h-[500px]"
        />
        <div>
          <h1 className="text-3xl font-bold mb-4">
            {user?.first_name} {user?.last_name}
          </h1>
          <p>
            <span className="font-bold">Email: </span>
            {user?.email}
          </p>
          <p>
            <span className="font-bold">username: </span>
            {user?.username}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Users;
