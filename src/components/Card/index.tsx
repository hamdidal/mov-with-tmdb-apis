import React, { useContext } from "react";
import { CastCrewModel } from "../../models";
import { Card } from "antd";
import nonProfile from "../../assets/non-profile.jpg";
import "./Card.css";
import { ThemeContext } from "../../context";

const CardComponent: React.FC<CastCrewModel> = ({
  name,
  profile_path,
  job,
  character,
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <Card
      style={{
        border: "none",
        background: theme === "dark" ? "#333" : "#f0f2f5",
      }}
      className="card"
      cover={
        profile_path ? (
          <img
            width={200}
            height={300}
            alt={name}
            src={`https://image.tmdb.org/t/p/w500${profile_path}`}
          />
        ) : (
          <img width={200} height={300} alt={name} src={nonProfile}></img>
        )
      }
    >
      <Card.Meta title={name} description={job || character} />
    </Card>
  );
};

export default CardComponent;
