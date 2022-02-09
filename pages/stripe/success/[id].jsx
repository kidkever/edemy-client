import { useEffect } from "react";
import { SyncOutlined } from "@ant-design/icons";
import UserRoute from "../../../components/routes/UserRoute";
import { useRouter } from "next/router";
import axios from "axios";

const StripeSuccess = () => {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) successRequest();
  }, [id]);

  const successRequest = async () => {
    const { data } = await axios.get(`/api/stripe-success/${id}`);
    router.push(`/user/course/${data.slug}`);
  };

  return (
    <UserRoute showNav={false}>
      <div className="container">
        <div className="row mt-5 text-center">
          <div className="col-md-9 mt-5">
            <SyncOutlined spin className="display-2 text-primary p-3 mb-3" />
            <p className="lead" style={{ fontWeight: "400" }}>
              Payment Successful
            </p>
          </div>
        </div>
      </div>
    </UserRoute>
  );
};

export default StripeSuccess;
