import { Badge, Button, Progress, Tooltip, List, Avatar, Switch } from "antd";
import { CloseCircleFilled, SyncOutlined } from "@ant-design/icons";
import ReactPlayer from "react-player";

const AddLessonForm = ({
  values,
  setValues,
  handleAddLesson,
  uploading,
  uploadButtonText,
  handleVideoUpload,
  progress,
  handleVideoRemove,
  removing,
  loading,
  editPage = false,
}) => {
  let textCentered = uploading || removing ? "text-center pb-2" : "text-left";

  return (
    <div className="container pt-3">
      <form onSubmit={handleAddLesson}>
        <input
          type="text"
          className="form-control"
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          value={values.title}
          placeholder="Title"
          autoFocus
          required
        />
        <textarea
          className="form-control mt-3"
          cols="7"
          rows="7"
          onChange={(e) => setValues({ ...values, content: e.target.value })}
          value={values.content}
          placeholder="Content"
        ></textarea>

        <div className="d-flex justify-content-center">
          <label
            className={`btn btn-outline-dark btn-block mt-3 ${textCentered}`}
          >
            {uploading || removing ? <SyncOutlined spin /> : uploadButtonText}
            <input
              type="file"
              name="video"
              onChange={handleVideoUpload}
              accept="video/*"
              hidden
            />
          </label>
          {!uploading && values && values.video && values.video.Location && (
            <Tooltip title="Remove Video">
              <CloseCircleFilled
                className="text-danger mt-4 ml-2"
                style={{
                  fontSize: "25px",
                }}
                onClick={handleVideoRemove}
              />
            </Tooltip>
          )}
        </div>

        {!uploading && values && values.video && values.video.Location && (
          <div className="mt-3" style={{ position: "relative" }}>
            <ReactPlayer url={values.video.Location} width="442px" controls />
          </div>
        )}

        {progress && progress > 0 && (
          <Progress
            className="d-flex justify-content-center pt-2"
            percent={progress}
            steps={10}
          />
        )}

        <Button
          onClick={handleAddLesson}
          className="col mt-3"
          size="large"
          type="primary"
          loading={loading}
          shape="round"
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default AddLessonForm;
