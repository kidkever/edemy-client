import { useState, useEffect } from "react";
import axios from "axios";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { Modal } from "antd";

import InstructorRoute from "../../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import AddLessonForm from "../../../../components/forms/AddLessonForm";

const CourseEdit = () => {
  // state for course update
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "9.99",
    paid: true,
    category: "",
    lessons: [],
  });
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload image");

  // state for lesson update
  const [visible, setVisible] = useState(false);
  const [currentLesson, setCurrentLesson] = useState({});
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoRemoving, setVideoRemoving] = useState(false);
  const [updateLessonLoading, setUpdateLessonLoading] = useState(false);
  const [videoUploadButtonText, setVideoUploadButtonText] =
    useState("Upload Video");
  const [videoUploadProgress, setVideoUploadProgress] = useState(null);

  // router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  // console.log(currentLesson);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    if (data) setValues(data);
    if (data && data.image) {
      setImage(data.image);
      setImagePreview(data.image.Location);
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    if (image) {
      await handleImageRemove();
    }

    const file = e.target.files[0];
    setUploading(true);

    // resize
    Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
      try {
        const { data } = await axios.post("/api/course/upload-image", {
          image: uri,
        });
        setImagePreview(window.URL.createObjectURL(file));
        setUploadButtonText(file.name);
        setImage(data);
        console.log("image uploaded", data);
      } catch (err) {
        console.log(err);
        toast.error("Image upload failed. Try again.");
      } finally {
        setUploading(false);
      }
    });
  };

  const handleImageRemove = async () => {
    try {
      setRemoving(true);
      const res = await axios.post("/api/course/remove-image", { image });
      setImage({});
      setImagePreview("");
      setUploadButtonText("Upload image");
      //
    } catch (err) {
      console.log(err);
      toast.error("Image remove failed. Try again.");
    } finally {
      setRemoving(false);
    }
  };

  const handleDrag = (e, index) => {
    e.dataTransfer.setData("itemIndex", index);
  };

  const handleDrop = async (e, index) => {
    const movingItemIndex = e.dataTransfer.getData("itemIndex");
    const targetItemIndex = index;

    let allLessons = values.lessons;
    let movingItem = allLessons[movingItemIndex];

    allLessons.splice(movingItemIndex, 1);
    allLessons.splice(targetItemIndex, 0, movingItem);

    setValues({ ...values, lessons: [...allLessons] });
  };

  const handleLessonDelete = async (index) => {
    const answer = window.confirm("Are you sure you want to delete?");
    if (!answer) return;

    let allLessons = values.lessons;
    const removed = allLessons.splice(index, 1)[0];

    setValues({ ...values, lessons: allLessons });
    await axios.put(`/api/course/${slug}/${removed._id}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      });
      toast.success("Course updated successfully.");
      router.push(`/instructor/course/view/${slug}`);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data);
    } finally {
      setLoading(false);
    }
  };

  // lesson update functions

  const handleEditLesson = async (e) => {
    e.preventDefault();
    setUpdateLessonLoading(true);
    console.log("first values", values);
    try {
      const { data } = await axios.put(
        `/api/course/lesson/${slug}/${currentLesson._id}`,
        currentLesson
      );
      setVisible(false);
      console.log("data", data);
      if (data.ok) {
        let arr = values.lessons;
        const index = arr.findIndex((el) => el._id === currentLesson._id);
        arr[index] = currentLesson;
        setValues({ ...values, lessons: arr });
        console.log("values", values);
        toast.success("Lesson Updated");
      }
    } catch (err) {
      console.log(err);
      toast.error("Lesson edit failed. Try again.");
    } finally {
      setUpdateLessonLoading(false);
    }
  };

  const handleVideoUpload = async (e) => {
    try {
      if (currentLesson.video) {
        await handleVideoRemove();
      }

      const file = e.target.files[0];
      setVideoUploadButtonText(file.name);
      setVideoUploading(true);

      const videoData = new FormData();
      videoData.append("video", file);

      // save progress bar and send video as form data
      const { data } = await axios.post(
        `/api/course/video-upload/${values.instructor._id}`,
        videoData,
        {
          onUploadProgress: (e) => {
            setVideoUploadProgress(Math.round((100 * e.loaded) / e.total));
          },
        }
      );

      // once response is recieved
      console.log(data);
      // update course lesson - video
      const s = { ...values };
      s.lessons.filter((l) => l._id === currentLesson._id)[0].video = data;
      setValues(s);
      // update current lesson - video
      setCurrentLesson({ ...currentLesson, video: data });
    } catch (err) {
      console.log(err);
      toast.error("Video upload failed. Try again.");
    } finally {
      setVideoUploading(false);
      setVideoUploadProgress(null);
    }
  };

  const handleVideoRemove = async () => {
    try {
      setVideoRemoving(true);
      const { data } = await axios.post(
        `/api/course/video-remove/${values.instructor._id}`,
        {
          video: currentLesson.video,
        }
      );
      console.log(data);

      // update course lesson - video to empty
      const s = { ...values };
      s.lessons.filter((l) => l._id === currentLesson._id)[0].video = {};
      setValues(s);
      // update current lesson - video to empty
      setCurrentLesson({ ...currentLesson, video: {} });

      setVideoUploadButtonText("Upload another video");
    } catch (err) {
      console.log(err);
      toast.error("Video remove failed. Try again.");
    } finally {
      setVideoRemoving(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron rounded-0 mb-0 text-white text-center">
        Instructor Dashboard
      </h1>
      <InstructorRoute>
        <div className="row py-4">
          <div className="col-md-6 offset-md-3">
            <CourseCreateForm
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              handleImageUpload={handleImageUpload}
              values={values}
              setValues={setValues}
              imagePreview={imagePreview}
              uploadButtonText={uploadButtonText}
              handleImageRemove={handleImageRemove}
              uploading={uploading}
              removing={removing}
              loading={loading}
              handleDrag={handleDrag}
              handleDrop={handleDrop}
              handleLessonDelete={handleLessonDelete}
              editPage={true}
              setVisible={setVisible}
              currentLesson={currentLesson}
              setCurrentLesson={setCurrentLesson}
            />
          </div>
        </div>
        <Modal
          title="Update Lesson"
          centered
          visible={visible}
          footer={null}
          onCancel={() => setVisible(false)}
        >
          <AddLessonForm
            values={currentLesson}
            setValues={setCurrentLesson}
            handleAddLesson={handleEditLesson}
            uploading={videoUploading}
            uploadButtonText={videoUploadButtonText}
            handleVideoUpload={handleVideoUpload}
            progress={videoUploadProgress}
            handleVideoRemove={handleVideoRemove}
            removing={videoRemoving}
            loading={updateLessonLoading}
            editPage={true}
          />
        </Modal>
      </InstructorRoute>
    </>
  );
};

export default CourseEdit;
