import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../layout/Header";
import {
  getMovieCredits,
  getMovieDetails,
  rateMovie,
} from "../../services/tmdbServices";
import { CreditModel, MovieDetailModel } from "../../models";
import { Button, Divider, Flex, Rate, Space, Typography } from "antd";
import { convertDate } from "../../helpers";
import {
  ClockCircleOutlined,
  FrownOutlined,
  MehOutlined,
  SmileOutlined,
  StarOutlined,
} from "@ant-design/icons";
import "./Details.css";
import Spinner from "../../components/Spinner";
import CardComponent from "../../components/Card";
import { ThemeContext } from "../../context";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const MovieDetails = () => {
  const [details, setDetails] = useState<MovieDetailModel | undefined>(
    undefined
  );
  const [credits, setCredits] = useState<CreditModel | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(0);
  const { id } = useParams();
  const { theme } = useContext(ThemeContext);
  const customIcons = [
    <FrownOutlined />,
    <FrownOutlined />,
    <MehOutlined />,
    <SmileOutlined />,
    <SmileOutlined />,
  ];
  const sessionId = localStorage.getItem("sessionId");
  const getMovieDetail = async () => {
    setIsLoading(true);
    const data = await getMovieDetails(Number(id));
    const movieCredit = await getMovieCredits(Number(id));
    setIsLoading(false);
    return setDetails(data), setCredits(movieCredit);
  };

  const rateTheMovie = async () => {
    await rateMovie(Number(id), value, sessionId!).then(
      (res) =>
        res?.status === 201 &&
        toast.success("Congratulations! You have rated the movie.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        })
    );

  };

  useEffect(() => {
    getMovieDetail();
  }, [id]);

  return (
    <Flex vertical>
      <Header />
      {isLoading ? (
        <Spinner />
      ) : (
        <div
          className="movie-detail-container"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), #828276), url(https://image.tmdb.org/t/p/w1280${details?.backdrop_path})`,
          }}
        >
          <Space className="movie-detail-detail-page">
            <Typography.Title className="common-text-color" level={3}>
              {details?.title}( {details?.release_date.slice(0, 4)} )
            </Typography.Title>
            <Typography.Paragraph
              className="common-text-color"
              ellipsis={{ rows: 3, expandable: true }}
            >
              {details?.genres.map((genre) => genre.name).join(", ")}
            </Typography.Paragraph>
            <Typography.Title className="common-text-color" level={5}>
              <StarOutlined />
              {details?.vote_average.toFixed(1)}
              <Divider
                style={{ background: "#f0f2f5" }}
                className="common-text-color"
                type="vertical"
              />
              <ClockCircleOutlined />
              {details?.runtime} minute
              <Divider
                style={{ background: "#f0f2f5" }}
                className="common-text-color"
                type="vertical"
              />
              {convertDate(details?.release_date ?? "")}
            </Typography.Title>
            <Flex gap="middle" align="center">
              <Rate
                defaultValue={details && (details?.vote_average / 2 ?? 0)}
                onChange={(value) => setValue(value * 2)}
                character={({ index = 0 }) => customIcons[index ?? 0]}
              />
              <Button
                onClick={rateTheMovie}
                type="text"
                className="common-text-color"
              >
                Rate it
              </Button>
            </Flex>
          </Space>
        </div>
      )}
      <Space className="film-detail">
        <Typography.Title
          style={{
            color: theme === "dark" ? "#f0f2f5" : "#333",
          }}
          level={4}
        >
          Overview
        </Typography.Title>
        <Typography.Paragraph>{details?.overview}</Typography.Paragraph>
        <Typography.Title
          style={{
            color: theme === "dark" ? "#f0f2f5" : "#333",
          }}
          level={4}
        >
          Director
        </Typography.Title>

        <Space className="film-director">
          {credits?.crew
            .filter((crew) => crew.job === "Director")
            .map((crew) => (
              <CardComponent
                key={crew.id}
                job={crew.job}
                name={crew.name}
                profile_path={crew.profile_path}
              />
            ))}
        </Space>
        <Typography.Title
          style={{
            color: theme === "dark" ? "#f0f2f5" : "#333",
          }}
          level={4}
        >
          Cast
        </Typography.Title>
        <Space className="film-cast">
          {credits?.cast
            .sort((a, b) => (a.cast_id ?? 0) - (b.cast_id ?? 0))
            .slice(0, 25)
            .map((cast) => (
              <CardComponent
                key={cast.cast_id}
                job=""
                character={cast.character}
                name={cast.name}
                profile_path={cast.profile_path}
              />
            ))}
        </Space>
      </Space>
    </Flex>
  );
};

export default MovieDetails;
