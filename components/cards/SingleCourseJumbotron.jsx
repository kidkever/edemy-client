import { Badge, Button } from "antd";
import { currencyFormatter } from "../../utils/helpers";
import ReactPlayer from "react-player";
import { SafetyOutlined } from "@ant-design/icons";

const SingleCourseJumbotron = ({
  course,
  showModal,
  setShowModal,
  preview,
  setPreview,
  loading,
  user,
  handlePaidEnrollment,
  handleFreeEnrollment,
  enrolled,
  setEnrolled,
}) => {
  const {
    name,
    description,
    instructor,
    updatedAt,
    lessons,
    image,
    price,
    paid,
    category,
  } = course;
  return (
    <div className="jumbotron rounded-0 text-white p-4">
      <div className="row">
        <div className="col-md-8">
          <h2 className="text-light">{name}</h2>
          <p className="lead">
            {description && description.substring(0, 160)}...
          </p>
          <Badge
            count={category}
            style={{
              backgroundColor: "#03a9f4",
              fontSize: "14px",
            }}
            className="mb-2"
          />
          <p>Created by {instructor.name}</p>
          <p>Last updated {new Date(updatedAt).toLocaleDateString()}</p>
          <h4 className="text-light">
            {paid
              ? currencyFormatter({ amount: price, currency: "usd" })
              : "Free"}
          </h4>
        </div>
        <div className="col-md-4">
          {lessons[0].video && lessons[0].video.Location ? (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                setPreview(lessons[0].video.Location);
                setShowModal(!showModal);
              }}
            >
              <ReactPlayer
                url={lessons[0].video.Location}
                light={image.Location}
                width="100%"
                height="225px"
              />
            </div>
          ) : (
            <>
              <img src={image.Location} alt={name} className="img img-fluid" />
            </>
          )}
          <Button
            className="my-3"
            type="primary"
            block
            shape="round"
            icon={<SafetyOutlined />}
            size="large"
            loading={loading}
            disabled={loading}
            onClick={paid ? handlePaidEnrollment : handleFreeEnrollment}
          >
            {user
              ? enrolled.status
                ? "Go to course"
                : "Enroll"
              : "Login to enroll"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SingleCourseJumbotron;
