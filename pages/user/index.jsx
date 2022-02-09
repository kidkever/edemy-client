import { useContext, useEffect, useState } from "react";
import UserRoute from "../../components/routes/UserRoute";
import { Context } from "../../context";
import axios from "axios";
import { Avatar } from "antd";
import Link from "next/link";
import { SyncOutlined, PlayCircleOutlined } from "@ant-design/icons";

const UserIndex = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    state: { user },
  } = useContext(Context);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/user-courses");
      setCourses(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron rounded-0 text-white mb-0 text-center">
        User Dashboard
      </h1>
      <UserRoute>
        {loading ? (
          <div className="text-center mt-4">
            <SyncOutlined spin className="display-3 text-primary p-4 mr-5" />
          </div>
        ) : (
          <div className="container">
            {courses &&
              courses.map((course, index) => (
                <div key={course._id}>
                  <div className="media mt-3">
                    <Avatar
                      shape="square"
                      size={80}
                      src={course.image ? course.image.Location : "/course.png"}
                    />
                    <div className="media-body pl-2">
                      <div className="row mt-2">
                        <div className="col">
                          <Link
                            href={`/user/course/${course.slug}`}
                            className="pointer"
                          >
                            <a className="h5 text-primary ">{course.name}</a>
                          </Link>
                          <p className="mb-0" style={{ fontWeight: "400" }}>
                            {course.lessons.length} Lessons
                          </p>
                          <p className="mb-0">By {course.instructor.name}</p>
                        </div>
                        <div className="col-md-3 text-center">
                          <Link
                            href={`/user/course/${course.slug}`}
                            className="pointer"
                          >
                            <a>
                              <PlayCircleOutlined className="h3 pt-3 text-primary" />
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </UserRoute>
    </>
  );
};

export default UserIndex;
