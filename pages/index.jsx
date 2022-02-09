import axios from "axios";
import CourseCard from "../components/cards/CourseCard";

export async function getServerSideProps() {
  const { data } = await axios.get(`${process.env.API}/courses`);
  return {
    props: {
      courses: data,
    },
  };
}

const Index = ({ courses }) => {
  return (
    <>
      <h1 className="jumbotron rounded-0 text-white text-center">
        Online Education Marketplace
      </h1>
      <div className="container">
        <div className="row">
          {courses.map((course) => (
            <div key={course._id} className="col-md-3">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Index;
