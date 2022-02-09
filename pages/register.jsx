import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // state
  const {
    state: { user },
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
      const { data } = await axios.post(`/api/register`, {
        name,
        email,
        password,
      });
      setName("");
      setEmail("");
      setPassword("");
      router.push("/login");
      toast.success("Registration was successful. Please login.");
    } catch (err) {
      toast.error(err.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron rounded-0 text-white text-center">Register</h1>
      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Your Name"
            required
            className="form-control mb-4"
          />
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
            disabled={!name || !email || !password || loading}
            className="btn btn-block btn-primary"
          >
            {loading ? <SyncOutlined spin /> : "Register"}
          </button>
        </form>
        <p className="float-left pt-3">
          Already have an account?{" "}
          <Link href="/login">
            <a>Login</a>
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

export default Register;
