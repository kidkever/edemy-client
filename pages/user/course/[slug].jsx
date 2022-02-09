import { useState, useEffect, createElement } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Button, Menu, Avatar } from "antd";
import ReactPlayer from "react-player";
import ReactMarkdown from "react-markdown";

const { Item } = Menu;

import StudentRoute from "../../../components/routes/StudentRoute";
import {
  CheckCircleFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MinusCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

const SingleCourse = () => {
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(-1);
  const [collapsed, setCollapsed] = useState(false);
  const [course, setCourse] = useState({ lessons: [] });
  const [completedLessons, setCompletedLessons] = useState([]);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) loadCourse();
  }, [slug]);

  useEffect(() => {
    if (course) loadCompletedLessons();
  }, [course]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/user/course/${slug}`);
    setCourse(data);
  };

  const loadCompletedLessons = async () => {
    const { data } = await axios.post(`/api/list-completed`, {
      courseId: course._id,
    });
    setCompletedLessons(data);
  };

  const markCompleted = async () => {
    const { data } = await axios.post(`/api/mark-completed`, {
      courseId: course._id,
      lessonId: course.lessons[clicked]._id,
    });

    setCompletedLessons([...completedLessons, course.lessons[clicked]._id]);
  };

  const markIncompleted = async () => {
    const { data } = await axios.post(`/api/mark-incompleted`, {
      courseId: course._id,
      lessonId: course.lessons[clicked]._id,
    });
    const all = [...completedLessons];
    const index = all.indexOf(course.lessons[clicked]._id);
    if (index > -1) {
      all.splice(index, 1);
      setCompletedLessons(all);
    }
  };

  return (
    <StudentRoute>
      <div className="row">
        <div style={{ maxWidth: "320" }}>
          <Button
            className="text-primary mt-1 btn-block mb-2"
            onClick={() => setCollapsed(!collapsed)}
          >
            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
            {!collapsed && "Lessons"}
          </Button>
          <Menu
            defaultSelectedKeys={[clicked]}
            inlineCollapsed={collapsed}
            mode="inline"
            style={{ height: "88vh", overflow: "scroll" }}
          >
            {course.lessons.map((lesson, index) => (
              <Item
                onClick={() => setClicked(index)}
                key={lesson._id}
                icon={<Avatar>{index + 1}</Avatar>}
              >
                {lesson.title.substring(0, 30)}{" "}
                {completedLessons.includes(lesson._id) ? (
                  <CheckCircleFilled
                    className="text-primary float-right ml-2 mr-0"
                    style={{ fontSize: "16px", marginTop: "13px" }}
                  />
                ) : (
                  <MinusCircleOutlined
                    className="float-right ml-2 mr-0 text-info"
                    style={{ fontSize: "16px", marginTop: "13px" }}
                  />
                )}
              </Item>
            ))}
          </Menu>
        </div>

        <div className="col">
          {clicked !== -1 ? (
            <>
              <div className="col alert clearfix">
                <h4 className="float-left">{course.lessons[clicked].title}</h4>
                {completedLessons.includes(course.lessons[clicked]._id) ? (
                  <span
                    className="float-right btn btn-outline-secondary btn-sm"
                    onClick={markIncompleted}
                  >
                    Mark as incompleted
                  </span>
                ) : (
                  <span
                    className="float-right btn btn-outline-primary btn-sm"
                    onClick={markCompleted}
                  >
                    Mark as completed
                  </span>
                )}
              </div>

              {course.lessons[clicked].video &&
                course.lessons[clicked].video.Location && (
                  <div className="d-flex justify-content-center my-5">
                    <ReactPlayer
                      url={course.lessons[clicked].video.Location}
                      width="960px"
                      height="450px"
                      controls
                      onEnded={markCompleted}
                    />
                  </div>
                )}

              <div className="text-center mx-auto w-50">
                <ReactMarkdown children={course.lessons[clicked].content} />
              </div>
            </>
          ) : (
            <div className="d-flex justify-content-center p-5">
              <div className="text-center p-5">
                <PlayCircleOutlined className="text-primary display-3 p-5" />
                <h5>Click on a lesson to start learning</h5>
              </div>
            </div>
          )}
        </div>
      </div>
    </StudentRoute>
  );
};

export default SingleCourse;
