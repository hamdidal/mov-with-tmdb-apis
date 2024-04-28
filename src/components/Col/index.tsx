import { Col, Typography } from "antd";
import { CardComponentModel } from "../../models";
import { convertDate } from "../../helpers";
import "./Col.css";
import { useNavigate } from "react-router-dom";
import nonPoster from "../../assets/no-poster.jpg";
import { useContext } from "react";
import { ThemeContext } from "../../context";

const ColComponent: React.FC<CardComponentModel> = ({ movie }) => {
  const { title, backdrop_path, vote_average, release_date, id } = movie;
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  return (
    <Col
      className="movie-card"
      style={{
        border: "none",
        background: theme === "dark" ? "#333" : "#f0f2f5",
      }}
      key={id}
      lg={{ span: 6 }}
      onClick={() => navigate(`/details/${id}`)}
    >
      {backdrop_path ? (
        <img
          alt={title}
          src={`https://image.tmdb.org/t/p/w300${backdrop_path}`}
        />
      ) : (
        <img width={370} height={200} alt={title} src={nonPoster} />
      )}
      <div style={{ alignItems: "center" }} className="movie-detail">
        <Typography.Title
          style={{
            color: theme === "dark" ? "#f0f2f5" : "#333",
          }}
          className="movie-detail-title"
          level={4}
        >
          {title}
        </Typography.Title>
        <Typography.Title
          style={{
            color: theme === "dark" ? "#f0f2f5" : "#333",
          }}
          level={5}
        >
          {vote_average.toFixed(1)}
        </Typography.Title>
        <Typography.Title
          style={{
            color: theme === "dark" ? "#f0f2f5" : "#333",
          }}
          level={5}
        >
          {convertDate(release_date)}
        </Typography.Title>
      </div>
    </Col>
  );
};
export default ColComponent;
