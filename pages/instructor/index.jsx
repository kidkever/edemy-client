import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Card, Avatar, Tooltip, Button, Skeleton } from "antd";
import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  QuestionOutlined,
  SettingOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Context } from "../../context";
import Link from "next/link";

const { Meta } = Card;

import InstructorRoute from "../../components/routes/InstructorRoute";
import { toast } from "react-toastify";

const InstructorIndex = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    state: { user },
  } = useContext(Context);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    const { data } = await axios.get("/api/instructor-courses");
    setCourses(data);
    setLoading(false);
  };

  const handlePublish = async (e, slug, courseIndex) => {
    try {
      let answer = window.confirm(
        "Once you publish your course, it will be live on the marketplace for students to enroll."
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/publish/${slug}`);

      let arr = [...courses];
      arr[courseIndex] = data;
      setCourses(arr);

      toast.success("Congrats, Your course is now live");
    } catch (err) {
      console.log(err);
      toast.error("Course publish failed. Try again");
    }
  };

  const handleUnpublish = async (e, slug, courseIndex) => {
    try {
      let answer = window.confirm(
        "Once you unpublish your course, it will not be available for students to enroll."
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/unpublish/${slug}`);

      let arr = [...courses];
      arr[courseIndex] = data;
      setCourses(arr);

      toast.success("Your course is now unpublished.");
    } catch (err) {
      console.log(err);
      toast.error("Course unpublish failed. Try again");
    }
  };

  return (
    <>
      <h1 className="jumbotron rounded-0 mb-0 text-white text-center">
        Instructor Dashboard
      </h1>
      <InstructorRoute>
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
                          href={`/instructor/course/view/${course.slug}`}
                          className="pointer"
                        >
                          <a className="h5 text-primary ">{course.name}</a>
                        </Link>
                        <p className="mb-0">{course.lessons.length} Lessons</p>
                        {course.lessons.length < 5 ? (
                          <p className="mb-0 text-muted">
                            at least 5 lessons are required to publish a course.
                          </p>
                        ) : course.published ? (
                          <p className="mb-0 text-muted">
                            Your course is live in the market place.
                          </p>
                        ) : (
                          <p className="mb-0 text-muted">
                            Your course is ready to be published.
                          </p>
                        )}
                      </div>
                      <div className="col-md-3 text-center">
                        {course.lessons && course.lessons.length < 5 ? (
                          <Tooltip title="Min 5 lessons required to publish">
                            <QuestionOutlined className="h5 mt-3 pointer text-info" />
                          </Tooltip>
                        ) : course.published ? (
                          <Tooltip title="Unpublish">
                            <CloseOutlined
                              onClick={(e) =>
                                handleUnpublish(e, course.slug, index)
                              }
                              className="h5 mt-3 pointer text-danger"
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Publish">
                            <CheckOutlined
                              onClick={(e) =>
                                handlePublish(e, course.slug, index)
                              }
                              className="h5 mt-3 pointer text-success "
                            />
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </InstructorRoute>
    </>
  );
};

export default InstructorIndex;

{
  /* <div key={course._id} className="col-md-4 mt-4">
                  <Card
                    hoverable
                    style={{ cursor: "default" }}
                    cover={
                      <img
                        alt={course.name}
                        height={200}
                        src={
                          course.image ? course.image.Location : "/course.png"
                        }
                      />
                    }
                    actions={[
                      <SettingOutlined key="setting" />,
                      <EditOutlined key="edit" />,
                      <Link href={`/instructor/course/view/${course.slug}`}>
                        <a>
                          <EyeOutlined key="view" />
                        </a>
                      </Link>,
                      <>
                        {course.lessons.length < 5 ? (
                          <Tooltip
                            title="At least 5 lessons are required to publish a course."
                            color="geekblue"
                          >
                            <ExclamationCircleOutlined />
                          </Tooltip>
                        ) : course.published ? (
                          <Tooltip
                            title="Unpublish this course"
                            color="geekblue"
                          >
                            <Link
                              href={`/instructor/course/view/${course._id}`}
                            >
                              <a>
                                <CloseCircleOutlined />
                              </a>
                            </Link>
                          </Tooltip>
                        ) : (
                          <Tooltip
                            title="Publish this course."
                            color="geekblue"
                          >
                            <CheckCircleOutlined />
                          </Tooltip>
                        )}
                      </>,
                    ]}
                  >
                    <Skeleton loading={loading} avatar active>
                      <Meta
                        avatar={
                          <Avatar
                            // src={user.picture}
                            icon={<UserOutlined />}
                          />
                        }
                        title={
                          <Link href={`/instructor/course/view/${course.slug}`}>
                            <a>{course.name}</a>
                          </Link>
                        }
                        description={
                          course.description.substring(0, 100) + "..."
                        }
                      />
                      <p className="text-muted ml-5 mt-3 mb-0">
                        {course.lessons.length} lessons
                      </p>
                    </Skeleton>
                  </Card>
                </div> */
}
