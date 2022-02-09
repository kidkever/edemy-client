import { Card, Badge } from "antd";
import Link from "next/link";
import { useState } from "react";
import { currencyFormatter } from "../../utils/helpers";

const { Meta } = Card;

const CourseCard = ({ course }) => {
  const { name, instructor, price, image, slug, paid, category } = course;
  const [loading, setLoading] = useState(false);

  return (
    <Link href={`/course/${slug}`}>
      <a>
        <Card
          className="mb-4 ant-card-padding"
          hoverable
          cover={
            <img
              height={150}
              style={{ objectFit: "cover" }}
              src={image ? image.Location : "/course.png"}
              alt={name}
            />
          }
        >
          <h5>{name}</h5>
          <div className="d-flex justify-content-between">
            <p className="mb-1">by {instructor.name}</p>
            <h6 className="m-0">
              {paid
                ? currencyFormatter({ amount: price, currency: "usd" })
                : "Free"}
            </h6>
          </div>
          <Badge
            count={category}
            style={{ backgroundColor: "#03a9f4" }}
            className="mt-1"
          />
        </Card>
      </a>
    </Link>
  );
};

export default CourseCard;
