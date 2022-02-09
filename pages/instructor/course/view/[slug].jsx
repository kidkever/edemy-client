import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import { Avatar, Tooltip, Button, Modal, List } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  UploadOutlined,
  ExclamationOutlined,
  CloseOutlined,
  QuestionOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import AddLessonForm from "../../../../components/forms/AddLessonForm";
import { toast } from "react-toastify";

const { Item } = List;

const CourseView = () => {
  const [course, setCourse] = useState({});
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({
    title: "",
    content: "",
    video: {},
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("Upload Video");
  const [progress, setProgress] = useState(null);
  const [students, setStudents] = useState(0);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  useEffect(() => {
    course && studentCount();
  }, [course]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse(data);
  };

  const studentCount = async () => {
    const { data } = await axios.post(`/api/instructor/student-count`, {
      courseId: course._id,
    });
    setStudents(data.length);
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `/api/course/lesson/${slug}/${course.instructor._id}`,
        values
      );

      setValues({ ...values, title: "", content: "", video: {} });
      setVisible(false);
      setUploadButtonText("Upload Video");
      setCourse(data);
      toast.success("Lesson added");
    } catch (err) {
      console.log(err);
      toast.error("Lesson add failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = async (e) => {
    try {
      const file = e.target.files[0];
      setUploadButtonText(file.name);
      setUploading(true);

      const videoData = new FormData();
      videoData.append("video", file);

      // save progress bar and send video as form data
      const { data } = await axios.post(
        `/api/course/video-upload/${course.instructor._id}`,
        videoData,
        {
          onUploadProgress: (e) => {
            setProgress(Math.round((100 * e.loaded) / e.total));
          },
        }
      );

      // once response is recieved
      console.log(data);
      setValues({ ...values, video: data });
    } catch (err) {
      console.log(err);
      toast.error("Video upload failed. Try again.");
    } finally {
      setUploading(false);
      setProgress(null);
    }
  };

  const handleVideoRemove = async () => {
    try {
      setRemoving(true);

      const { data } = await axios.post(
        `/api/course/video-remove/${course.instructor._id}`,
        {
          video: values.video,
        }
      );
      console.log(data);
      setValues({ ...values, video: {} });
      setUploadButtonText("Upload another video");
      //
    } catch (err) {
      console.log(err);
      toast.error("Video remove failed. Try again.");
    } finally {
      setRemoving(false);
    }
  };

  const handlePublish = async (e, slug) => {
    try {
      let answer = window.confirm(
        "Once you publish your course, it will be live on the marketplace for students to enroll."
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/publish/${slug}`);
      setCourse(data);
      toast.success("Congrats, Your course is now live");
    } catch (err) {
      console.log(err);
      toast.error("Course publish failed. Try again");
    }
  };

  const handleUnpublish = async (e, slug) => {
    try {
      let answer = window.confirm(
        "Once you unpublish your course, it will not be available for students to enroll."
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/unpublish/${slug}`);
      setCourse(data);
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
        <div>
          {course && (
            <div className="container-fluid pt-1">
              <div className="media pt-2">
                <Avatar
                  shape="square"
                  size={80}
                  src={course.image ? course.image.Location : "/course.png"}
                />

                <div className="media-body pl-2">
                  <div className="row">
                    <div className="col">
                      <h4 className="mt-2 mb-1 text-primary">{course.name}</h4>
                      <p style={{ marginTop: "-5px" }}>
                        {course.lessons && course.lessons.length} Lessons
                      </p>
                      <p
                        style={{
                          marginTop: "-15px",
                          fontSize: "13px",
                          color: "#999",
                        }}
                      >
                        {course.category}
                      </p>
                    </div>

                    <div className="d-flex pt-4">
                      <Tooltip title={`${students} Enrolled`}>
                        <UserSwitchOutlined className="h5 pointer text-info mr-4" />
                      </Tooltip>

                      <Tooltip title="Edit">
                        <EditOutlined
                          onClick={() =>
                            router.push(`/instructor/course/edit/${slug}`)
                          }
                          className="h5 pointer text-primary mr-4"
                        />
                      </Tooltip>

                      {course.lessons && course.lessons.length < 5 ? (
                        <Tooltip title="Min 5 lessons required to publish">
                          <QuestionOutlined className="h5 pointer text-info" />
                        </Tooltip>
                      ) : course.published ? (
                        <Tooltip title="Unpublish">
                          <CloseOutlined
                            onClick={(e) => handleUnpublish(e, course.slug)}
                            className="h5 pointer text-danger"
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Publish">
                          <CheckOutlined
                            onClick={(e) => handlePublish(e, course.slug)}
                            className="h5 pointer text-success "
                          />
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              <div className="row">
                <div className="col">
                  <div className="p-5 bg-light">
                    <ReactMarkdown children={course.description} />
                  </div>
                </div>
              </div>

              <div className="row my-4">
                <div className="col lesson-list">
                  <h5>
                    {course && course.lessons && course.lessons.length} Lessons
                  </h5>
                  <List
                    className="mb-3"
                    itemLayout="horizontal"
                    dataSource={course && course.lessons}
                    renderItem={(item, index) => (
                      <Item>
                        <Item.Meta
                          avatar={<Avatar>{index + 1}</Avatar>}
                          title={item.title}
                        ></Item.Meta>
                      </Item>
                    )}
                  ></List>

                  <Button
                    onClick={() => setVisible(true)}
                    className="col-md-4 offset-md-4 text-center mb-4"
                    type="primary"
                    shape="round"
                    icon={<UploadOutlined />}
                    size="large"
                  >
                    Add Lesson
                  </Button>

                  <Modal
                    title="+ Add Lesson"
                    centered
                    visible={visible}
                    onCancel={() => setVisible(false)}
                    footer={null}
                  >
                    <AddLessonForm
                      values={values}
                      setValues={setValues}
                      handleAddLesson={handleAddLesson}
                      uploading={uploading}
                      uploadButtonText={uploadButtonText}
                      handleVideoUpload={handleVideoUpload}
                      progress={progress}
                      handleVideoRemove={handleVideoRemove}
                      removing={removing}
                      loading={loading}
                    />
                  </Modal>
                </div>
              </div>
            </div>
          )}
        </div>
      </InstructorRoute>
    </>
  );
};

export default CourseView;
