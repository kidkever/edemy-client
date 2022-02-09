import { useState, useEffect } from "react";
import axios from "axios";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

import InstructorRoute from "../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../components/forms/CourseCreateForm";

const CourseCreate = () => {
  // state
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "9.99",
    paid: true,
    category: "",
  });
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload image");

  // router
  const router = useRouter();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/course", { ...values, image });
      toast.success("Great! Now you can start adding lessons.");
      router.push("/instructor");
    } catch (err) {
      console.log(err);
      toast(err.response.data);
    } finally {
      setLoading(false);
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
            />
          </div>
        </div>
      </InstructorRoute>
    </>
  );
};

export default CourseCreate;
