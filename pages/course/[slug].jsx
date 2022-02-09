import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

import SingleCourseJumbotron from "../../components/cards/SingleCourseJumbotron";
import SingleCourseLessons from "../../components/cards/SingleCourseLessons";
import PreviewModal from "../../components/modals/PreviewModal";
import { Context } from "../../context/index";

export async function getServerSideProps({ query }) {
  const { data } = await axios.get(`${process.env.API}/course/${query.slug}`);
  return {
    props: {
      course: data,
    },
  };
}

const SingleCourse = ({ course }) => {
  const { description } = course;

  // state
  const [showModal, setShowModal] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [loadMoreLessons, setLoadMoreLessons] = useState(false);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState({});

  // context
  const {
    state: { user },
  } = useContext(Context);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (user && course) checkEnrollment();
  }, [user, course]);

  const checkEnrollment = async () => {
    const { data } = await axios.get(`/api/check-enrollment/${course._id}`);
    setEnrolled(data);
  };

  const handlePaidEnrollment = async (e) => {
    e.preventDefault();
    try {
      if (!user) return router.push("/login");
      if (enrolled.status)
        return router.push(`/user/course/${enrolled.course.slug}`);
      setLoading(true);

      const { data } = await axios.post(`/api/paid-enrollment/${course._id}`);
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
      stripe.redirectToCheckout({ sessionId: data });

      // toast.success("Congrats! You have enrolled successfully");
      // router.push(`/user/course/${data.slug}`);
    } catch (err) {
      console.log(err);
      toast.error("Enrollment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFreeEnrollment = async (e) => {
    e.preventDefault();
    try {
      if (!user) return router.push("/login");
      if (enrolled.status)
        return router.push(`/user/course/${enrolled.course.slug}`);
      setLoading(true);
      const { data } = await axios.post(`/api/free-enrollment/${course._id}`);
      toast.success("Congrats! You have enrolled successfully");
      router.push(`/user/course/${data.slug}`);
    } catch (err) {
      console.log(err);
      toast.error("Enrollment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SingleCourseJumbotron
        course={course}
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
        setPreview={setPreview}
        loading={loading}
        user={user}
        handlePaidEnrollment={handlePaidEnrollment}
        handleFreeEnrollment={handleFreeEnrollment}
        enrolled={enrolled}
        setEnrolled={setEnrolled}
      />
      <PreviewModal
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
      />

      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-8">
            <h3>Course Description</h3>
            <div className="p-4 bg-light">
              <ReactMarkdown
                children={
                  readMore
                    ? description
                    : description.substring(0, 350) + " ..."
                }
              />
              <div className="text-center">
                <p
                  className="btn btn-sm btn-outline-primary mt-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => setReadMore(!readMore)}
                >
                  {readMore ? "Read less ..." : "Read more ..."}
                </p>
              </div>
            </div>

            {course.lessons && (
              <SingleCourseLessons
                lessons={course.lessons}
                setShowModal={setShowModal}
                showModal={showModal}
                setPreview={setPreview}
                loadMoreLessons={loadMoreLessons}
                setLoadMoreLessons={setLoadMoreLessons}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleCourse;
