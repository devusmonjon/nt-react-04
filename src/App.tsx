import React, { useEffect, useState } from "react";
import {
  deleteUser,
  getUsers,
  login,
  tokenRefresh,
} from "./service/api.service";
import { ILogin } from "./interfaces/auth.interface";
import useAuthStore from "./store/auth.store";
import { Link, useNavigate } from "react-router-dom";
import { IUser } from "./interfaces/user.interface";
import { IPost } from "./interfaces/post.interface";

const App = () => {
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [status, setStatus] = useState<{ text: string; color: string }>({
    text: "",
    color: "",
  });
  const [users, setUsers] = useState<IUser[]>([]);
  const [posts, setPosts] = useState<IPost[]>([]);

  const navigate = useNavigate();

  const {
    setIsAuthenticated,
    setAccessToken,
    setRefreshToken,
    isAuthenticated,
    accessToken,
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
          const responseUsers = await getUsers(accessToken);
          console.log(responseUsers);
          setUsers(responseUsers?.data);
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
    } else {
      navigate("/login");
    }
  }, [isAuthenticated]);
  const deleteHandler = async (id: number, e: any) => {
    e.target.textContent = "Loading...";
    e.target.disabled = true;
    const response = await deleteUser(id, accessToken);
    if (response === 204) {
      const responseUsers = await getUsers(accessToken);
      setUsers((prev) => prev.filter((user) => user?.id !== id));
    }
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim() && desc.trim() && price.trim()) {
      setPosts((prev) => [...prev, { id: Date.now(), title, desc, price }]);
      setTitle("");
      setDesc("");
      setPrice("");
      setStatus({ text: "Successfully added", color: "lightgreen" });
    } else {
      setStatus({ text: "Please enter title, desc and price", color: "red" });
    }
  };
  if (!isAuthenticated) return null;
  return (
    <>
      <div className="container mx-auto mt-5 text-right">
        <button
          className="btn btn-error"
          onClick={() => {
            setIsAuthenticated(false);
            setAccessToken("");
            setRefreshToken("");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }}
        >
          Logout
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex gap-4 my-10 container mx-auto flex-col"
      >
        <div className="flex gap-2 w-full">
          <input
            type="text"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full max-w-xs"
          />
          <input
            type="text"
            placeholder="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="input input-bordered w-full max-w-xs"
          />
          <input
            type="number"
            placeholder="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input input-bordered w-full max-w-xs"
          />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
        <p className="text" style={{ color: status.color }}>
          {status.text}
        </p>
      </form>
      <div className="container mx-auto mb-10 flex flex-wrap gap-4 justify-between">
        {posts?.length > 0 ? (
          posts.map((post: IPost) => (
            <div
              className="card bg-primary text-primary-content w-full md:w-[30%]"
              key={post?.id}
            >
              <div className="card-body">
                <h2 className="card-title">{post?.title}</h2>
                <p>{post?.desc}</p>
                <p className="text-sm text-white">$ {post?.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text">No posts</p>
        )}
      </div>
      <div className="container mx-auto h-[500px] overflow-y-auto">
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>
                  <label>
                    <input title="check" type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>Name</th>
                <th>username</th>
                <th>email</th>
                <th>Role</th>
                <th></th>
                <th>DELETE</th>
              </tr>
            </thead>
            <tbody>
              {users ? (
                users.map((user: IUser) => (
                  <tr key={user?.id}>
                    <th>
                      <label>
                        <input
                          title="check"
                          type="checkbox"
                          className="checkbox"
                        />
                      </label>
                    </th>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src={user?.profile_photo}
                              alt="Avatar Tailwind CSS Component"
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">
                            {user?.first_name} {user?.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{user?.username}</td>
                    <td>{user?.email}</td>
                    <td>{user?.role}</td>
                    <th>
                      <Link
                        to={"/users/" + user?.id}
                        className="btn btn-ghost btn-xs"
                      >
                        details
                      </Link>
                    </th>
                    <th>
                      <button
                        className="btn btn-error"
                        onClick={(e) => deleteHandler(user?.id, e)}
                      >
                        <span className="loading loading-spinner loading-lg hidden"></span>
                        Delete
                      </button>
                    </th>
                  </tr>
                ))
              ) : (
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>No access to users</th>
                  <th></th>
                  <th></th>
                </tr>
              )}
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Job</th>
                <th>Favorite Color</th>
                <th></th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
};

export default App;
