import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SyncOutlined } from "@ant-design/icons";
import InstructorNav from "../nav/InstructorNav";

const InstructorRoute = ({ children }) => {
  // state
  const [ok, setOk] = useState(false);

  // router
  const router = useRouter();

  useEffect(() => {
    fetchInstructor();
  }, []);

  const fetchInstructor = async () => {
    try {
      const { data } = await axios.get("/api/current-instructor");
      if (data.ok) setOk(true);
    } catch (err) {
      console.log(err);
      setOk(false);
      router.push("/user");
    }
  };

  return (
    <>
      {!ok ? (
        <div className="w-25 h-25 mt-5 pt-5 mx-auto text-center">
          <SyncOutlined spin className="display-4 text-primary" />
        </div>
      ) : (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              <InstructorNav />
            </div>
            <div className="col-md-10">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstructorRoute;
