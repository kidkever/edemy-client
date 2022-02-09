import {
  CloseCircleFilled,
  DeleteOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Select,
  Button,
  Image,
  Badge,
  List,
  Avatar,
  Tooltip,
  Switch,
} from "antd";

const { Option } = Select;
const { Item } = List;

const CourseCreateForm = ({
  handleSubmit,
  handleChange,
  handleImageUpload,
  values,
  setValues,
  imagePreview,
  uploadButtonText,
  handleImageRemove,
  uploading,
  removing,
  loading,
  handleDrag,
  handleDrop,
  handleLessonDelete,
  editPage = false,
  setVisible,
  setCurrentLesson,
}) => {
  const children = [];
  for (let i = 9.99; i <= 100; i += 5) {
    children.push(<Option key={i.toFixed(2)}>${i.toFixed(2)}</Option>);
  }

  return (
    <>
      {values && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Course name"
              value={values.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <textarea
              name="description"
              cols="7"
              rows="7"
              value={values.description}
              placeholder="Course description"
              className="form-control"
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-row">
            <div className={values.paid ? "col-9" : "col"}>
              <div className="form-group">
                <Select
                  style={{ width: "100%" }}
                  size="large"
                  value={values.paid}
                  onChange={(v) => setValues({ ...values, paid: v, price: 0 })}
                >
                  <Option value={true}>Paid</Option>
                  <Option value={false}>Free</Option>
                </Select>
              </div>
            </div>

            {values.paid && (
              <div className="col-3">
                <div className="form-group">
                  <Select
                    defaultValue="$9.99"
                    style={{ width: "100%" }}
                    onChange={(v) => setValues({ ...values, price: v })}
                    tokenSeparators={[,]}
                    size="large"
                  >
                    {children}
                  </Select>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="category"
              className="form-control"
              placeholder="Course category"
              value={values.category}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="col">
              <div className="form-group d-flex justify-content-center mb-2">
                <label className="btn btn-outline-secondary btn-block text-left">
                  {uploading ? "uploading..." : uploadButtonText}
                  <input
                    type="file"
                    name="image"
                    onChange={handleImageUpload}
                    accept="image/*"
                    hidden
                  />
                </label>
                {imagePreview && (
                  <Tooltip title="Remove Image">
                    <CloseCircleFilled
                      className="text-danger mt-2 ml-2"
                      style={{
                        fontSize: "25px",
                      }}
                      onClick={handleImageRemove}
                    />
                  </Tooltip>
                )}
              </div>
            </div>
          </div>

          {imagePreview && (
            <div className="text-center">
              {removing ? (
                <div className="text-center">
                  <SyncOutlined spin />
                </div>
              ) : (
                <>
                  <Image width={350} src={imagePreview} />
                </>
              )}
            </div>
          )}

          {editPage && (
            <div className="mt-4 mb-3">
              <h5>
                {values && values.lessons && values.lessons.length} Lessons
                (drag and drop to rearrange)
              </h5>
              <List
                onDragOver={(e) => e.preventDefault()}
                itemLayout="horizontal"
                dataSource={values && values.lessons}
                renderItem={(item, index) => (
                  <Item
                    draggable
                    onDragStart={(e) => handleDrag(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <Item.Meta
                      avatar={<Avatar>{index + 1}</Avatar>}
                      title={item.title}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setVisible(true);
                        setCurrentLesson(item);
                      }}
                    ></Item.Meta>
                    <Tooltip title="Free Preview">
                      <Switch
                        className="mr-2"
                        size="small"
                        disabled={uploading}
                        checked={values.lessons[index].free_preview}
                        name="free_preview"
                        onChange={(v) => {
                          const s = { ...values };
                          s.lessons[index].free_preview = v;
                          setValues(s);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Delete Lesson">
                      <DeleteOutlined
                        className="text-danger"
                        onClick={() => handleLessonDelete(index)}
                      />
                    </Tooltip>
                  </Item>
                )}
              ></List>
            </div>
          )}

          <div className="row">
            <div className="col">
              <Button
                onClick={handleSubmit}
                disabled={
                  loading ||
                  uploading ||
                  !values.name ||
                  !values.description ||
                  !values.category
                }
                loading={loading}
                type="primary"
                size="large"
                shape="round"
              >
                {loading ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default CourseCreateForm;
