import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // state
  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  // router
  const router = useRouter();

  useEffect(() => {
    if (user) return router.push("/");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/login`, {
        email,
        password,
      });
      // toast.success("Registration was successful. Please login.");
      dispatch({
        type: "LOGIN",
        payload: data,
      });

      // save to local storage
      window.localStorage.setItem("user", JSON.stringify(data));

      // redirect
      router.push("/user");
    } catch (err) {
      toast.error(err.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron rounded-0 text-white text-center">Login</h1>
      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Your Email"
            required
            className="form-control mb-4"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Your Password"
            required
            className="form-control mb-4"
          />
          <hr />
          <button
            type="submit"
            disabled={!email || !password || loading}
            className="btn btn-block btn-primary"
          >
            {loading ? <SyncOutlined spin /> : "Login"}
          </button>
        </form>

        <p className="float-left pt-3">
          Not yet Registered?{" "}
          <Link href="/register">
            <a>Register</a>
          </Link>
        </p>
        <p className="float-right pt-3">
          <Link href="/forgot-password">
            <a>Forgot Password?</a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
