import { Avatar, List } from "antd";

const { Item } = List;

const SingleCourseLessons = ({
  lessons,
  showModal,
  setShowModal,
  setPreview,
  loadMoreLessons,
  setLoadMoreLessons,
}) => {
  return (
    <div className="mt-5 lesson-list">
      {lessons && <h3>{lessons.length} Lessons</h3>}
      <hr />
      <List
        itemLayout="horizontal"
        dataSource={loadMoreLessons ? lessons : lessons.slice(0, 3)}
        renderItem={(item, index) => (
          <Item>
            <Item.Meta
              avatar={<Avatar>{index + 1}</Avatar>}
              title={item.title}
            />
            {item.free_preview && item.video && (
              <p
                style={{ cursor: "pointer", fontWeight: "500" }}
                className="text-primary"
                onClick={() => {
                  setShowModal(!showModal);
                  setPreview(item.video.Location);
                }}
              >
                Preview
              </p>
            )}
          </Item>
        )}
      />
      <div className="text-center mb-5">
        <p
          className="btn btn-sm btn-outline-primary mt-2"
          style={{ cursor: "pointer" }}
          onClick={() => setLoadMoreLessons(!loadMoreLessons)}
        >
          {loadMoreLessons ? "Show less ..." : "Show all lessons ..."}
        </p>
      </div>
    </div>
  );
};

export default SingleCourseLessons;
