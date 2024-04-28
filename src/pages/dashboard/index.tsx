import { useEffect, useState } from "react";
import { getPopularMovies } from "../../services/tmdbServices";
import { Row, Typography } from "antd";
import Header from "../../layout/Header";
import InfiniteScroll from "react-infinite-scroll-component";
import ColComponent from "../../components/Col";
import { MovieModel } from "../../models";
import { convertDate } from "../../helpers";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import "./Dashboard.css";

const Dashboard = () => {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<MovieModel[] | []>([]);

  const navigate = useNavigate();

  const getPopular = async () => {
    const data = await getPopularMovies(page);
    if (page === 1) {
      setMovies(data.results);
    } else setMovies([...movies, ...data.results]);
  };

  useEffect(() => {
    getPopular();
  }, [page]);

  return (
    <div>
      <Header />
      <>
        <Row gutter={[32, 16]}>
          <div
            onClick={() => navigate(`/details/${movies[0].id}`)}
            className="first-movie"
            style={{
              width: "100%",
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), #828276), url(https://image.tmdb.org/t/p/w1280${
                movies![0]?.backdrop_path
              })`,
            }}
          >
            <div className="first-movie-detail">
              <Typography.Title className="film-title" level={3}>
                {movies[0]?.title}
              </Typography.Title>
              <Typography.Paragraph
                className="film-overview"
                ellipsis={{ rows: 3, expandable: true }}
              >
                {movies[0]?.overview}
              </Typography.Paragraph>
              <Typography.Title className="film-release-date" level={5}>
                {convertDate(movies[0]?.release_date)}
              </Typography.Title>
            </div>
          </div>
        </Row>
        <InfiniteScroll
          dataLength={page * movies.length}
          next={() => {
            setPage(page + 1);
          }}
          hasMore={true}
          loader={<Spinner />}
          className="dashboard-cards"
        >
          <Row className="dashboard-row" gutter={[32, 16]}>
            {movies.slice(1).map((movie: MovieModel) => (
              <ColComponent movie={movie} />
            ))}
          </Row>
        </InfiniteScroll>
      </>
      )
    </div>
  );
};

export default Dashboard;
