import { useContext, useState } from "react";
import { Context } from "../../context";
import { Button } from "antd";
import {
  SettingOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import axios from "axios";
import UserRoute from "../../components/routes/UserRoute";

const BecomeInstructor = () => {
  // state
  const [loading, setLoading] = useState(false);
  const {
    state: { user },
  } = useContext(Context);

  const becomeInstructorHandler = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/make-instructor");
      window.location.href = res.data;
      console.log("res", res, "location href", window.location.href);
    } catch (err) {
      console.log(err.response.status);
      toast.error("Stripe onboarding failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron rounded-0 text-white text-center">
        Become Instructor
      </h1>
      <div className="container">
        <div className="row">
          <div className="col-md-8 offset-md-2 text-center">
            <div className="pt-3">
              <UserSwitchOutlined className="display-2 pb-3" />
              <br />
              <h2>Setup payout to start publishing courses on Edemy</h2>
              <p className="lead">
                Edemy partners with stripe to transfer earnings to your bank
                account.
              </p>
              <Button
                className="mt-2 mb-3 px-5"
                type="primary"
                shape="round"
                icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
                size="large"
                onClick={becomeInstructorHandler}
                disabled={
                  (user && user.role && user.role.includes("Instructor")) ||
                  loading
                }
              >
                {loading ? "Processing..." : "Payout Setup"}
              </Button>
              <p className="text-muted">
                You will be redirected to stripe to complete onboarding process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BecomeInstructor;
