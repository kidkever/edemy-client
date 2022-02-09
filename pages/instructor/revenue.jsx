import { useState, useEffect, useContext } from "react";
import { Context } from "../../context";
import InstructorRoute from "../../components/routes/InstructorRoute";
import axios from "axios";
import {
  DollarOutlined,
  SettingOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { stripeCurrencyFormatter } from "../../utils/helpers";
import { toast } from "react-toastify";

const InstructorRevenue = () => {
  const [balance, setBalance] = useState({ pending: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sendBalanceRequest();
  }, []);

  const sendBalanceRequest = async () => {
    const { data } = await axios.get("/api/instructor/balance");
    setBalance(data);
  };

  const handlePayoutSettings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/instructor/payout-settings");
      window.location.href = data;
    } catch (err) {
      console.log(err);
      toast.error("Unable to access payout settings. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron rounded-0 mb-0 text-white text-center">
        Instructor Dashboard
      </h1>
      <InstructorRoute>
        <div className="container">
          <div className="row mt-3">
            <div className="col-md-8 offset-1 bg-light p-4">
              <h2>
                Revenue report <DollarOutlined className="float-right" />
              </h2>
              <p className="lead">
                You get paid directly from stripe to your bank account every 48
                hours.
              </p>
              <hr />
              <br />
              <h3>
                Pending balance
                {balance.pending &&
                  balance.pending.map((bp, i) => (
                    <span key={i} className="float-right">
                      {stripeCurrencyFormatter(bp)}
                    </span>
                  ))}
              </h3>
              <p className="lead">For last 48 hours</p>
              <h3>
                Payouts{" "}
                {loading ? (
                  <LoadingOutlined spin className="float-right" />
                ) : (
                  <SettingOutlined
                    className="float-right"
                    onClick={handlePayoutSettings}
                  />
                )}
              </h3>
              <p className="lead">
                Update your stripe account details or view previous payouts
              </p>
            </div>
          </div>
        </div>
      </InstructorRoute>
    </>
  );
};

export default InstructorRevenue;
