import { CloudSyncOutlined } from "@ant-design/icons";
import UserRoute from "../../components/routes/UserRoute";

const StripeCancel = () => {
  return (
    <UserRoute showNav={false}>
      <div className="container">
        <div className="row mt-5 text-center">
          <div className="col-md-9 mt-5">
            <CloudSyncOutlined className="display-2 text-danger p-3" />
            <p className="lead" style={{ fontWeight: "400" }}>
              Payment failed. Try again.
            </p>
          </div>
        </div>
      </div>
    </UserRoute>
  );
};

export default StripeCancel;
