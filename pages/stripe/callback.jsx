import { useContext, useEffect } from "react";
import { Context } from "../../context";
import { SyncOutlined } from "@ant-design/icons";
import axios from "axios";

const StripeCallback = () => {
  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  useEffect(() => {
    if (user) {
      axios
        .post("/api/get-account-status")
        .then((res) => {
          dispatch({
            type: "LOGIN",
            payload: res.data,
          });
          window.localStorage.setItem("user", JSON.stringify(res.data));
          window.location.href = "/instructor";
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  return (
    <div className="w-25 h-25 mt-5 pt-5 mx-auto text-center">
      <SyncOutlined spin className="display-4 mt-5 text-primary" />
    </div>
  );
};

export default StripeCallback;
