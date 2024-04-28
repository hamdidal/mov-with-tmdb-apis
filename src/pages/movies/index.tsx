import { Flex, Row, Select, Typography } from "antd";
import Header from "../../layout/Header";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { MovieModel } from "../../models";
import {
  getDiscoverMovies,
  getPopularMovies,
} from "../../services/tmdbServices";
import ColComponent from "../../components/Col";
import { convertDate, GenreList } from "../../helpers";
import { useNavigate } from "react-router-dom";
import "../dashboard/Dashboard.css";
import "./Movies.css";
import Spinner from "../../components/Spinner";

const MovieList = () => {
  const [movies, setMovies] = useState<MovieModel[] | []>([]);
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<number>(0);
  const navigate = useNavigate();

  const fetchData = async (genre = selectedGenre, initialPage = 1) => {
    const data = await (genre === 0
      ? getPopularMovies(initialPage)
      : getDiscoverMovies(genre, initialPage));
    setMovies((prevMovies) =>
      initialPage === 1 ? data.results : [...prevMovies, ...data.results]
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setPage(1);
    fetchData(selectedGenre);
  }, [selectedGenre]);

  const handleGenreChange = (genre: number) => {
    setSelectedGenre(genre);
  };

  return (
    <Flex vertical>
      <Header />
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
            <Typography.Title className="common-text-color" level={3}>
              {movies[0]?.title}
            </Typography.Title>
            <Typography.Paragraph
              className="common-text-color"
              ellipsis={{ rows: 3, expandable: true }}
            >
              {movies[0]?.overview}
            </Typography.Paragraph>
            <Typography.Title className="common-text-color" level={5}>
              {convertDate(movies[0]?.release_date)}
            </Typography.Title>
          </div>
        </div>
      </Row>
      <Select
        className="select-genre"
        size="large"
        placeholder="Select a genre"
        optionFilterProp="children"
        onChange={handleGenreChange}
        options={GenreList.map((genre) => ({
          value: genre.id,
          label: genre.name,
        }))}
      />

      <InfiniteScroll
        dataLength={movies.length}
        next={() => {
          setPage(page + 1);
          fetchData(selectedGenre, page + 1);
        }}
        hasMore={true}
        loader={<Spinner/>}
        className="dashboard-cards"
      >
        <Row className="movies-row" gutter={[32, 16]}>
          {movies.slice(1).map((movie: MovieModel) => (
            <ColComponent movie={movie} />
          ))}
        </Row>
      </InfiniteScroll>
    </Flex>
  );
};

export default MovieList;
