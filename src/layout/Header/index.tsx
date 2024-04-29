import { ChangeEvent, useContext, useEffect, useState } from "react";
import {
  Button,
  Col,
  Drawer,
  Input,
  Modal,
  Row,
  Space,
  Switch,
  Tooltip,
  Typography,
} from "antd";
import {
  BulbFilled,
  BulbOutlined,
  CloseOutlined,
  MenuOutlined,
  SearchOutlined,
  UserAddOutlined,
  VideoCameraOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { ThemeContext } from "../../context";
import "./Header.css";
import _debounce from "lodash/debounce";
import { useNavigate } from "react-router-dom";
import {
  createSession,
  endSession,
  getReqToken,
  searchMovies,
} from "../../services/tmdbServices";
import { MovieModel } from "../../models";
import { useLoading } from "../../hooks";
import ColComponent from "../../components/Col";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { setLoadingStatus } = useLoading();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [filterText, setFilterText] = useState<string>("");
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<MovieModel[] | []>([]);
  const [open, setOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const reqToken = localStorage.getItem("reqToken");
  const approvedToken = new URLSearchParams(window.location.search).get(
    "approved"
  );
  const sessiınId = localStorage.getItem("sessionId");

  const getData = async () => {
    setLoading(true);
    const data = await getReqToken();
    setLoading(false);
    return localStorage.setItem("reqToken", data.request_token);
  };

  const getSession = async () => {
    try {
      const response = await createSession(reqToken!);

      if (response.status === 200) {
        const session = response.data;
        localStorage.setItem("sessionId", session.session_id);

        toast.success("Congratulations! You have created the session.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const deleteSession = async () => {
    await endSession(sessiınId!).then(
      (res) =>
        res?.status === 200 &&
        toast.success("Congratulations! You have delete the session.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        })
    );
    return localStorage.removeItem("sessionId");
  };

  useEffect(() => {
    if (approvedToken) {
      getSession();
    }
  }, [approvedToken]);

  const showModal = () => {
    setOpen(true);
    if (!reqToken) getData();
  };

  const showDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  const handleDeleteSession = () => {
    deleteSession();
    localStorage.removeItem("reqToken");
    setOpenDeleteModal(false);
  };

  const handleOpenTMDbAuth = () => {
    const url = `https://www.themoviedb.org/authenticate/${reqToken}?redirect_to=https://brilliant-licorice-e50540.netlify.app`;
    window.open(url, "_self");
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleDeleteModalCancel = () => {
    setOpenDeleteModal(false);
  };

  const navigate = useNavigate();

  const getSearchMovie = async () => {
    setLoadingStatus(true);
    const data = await searchMovies(filterText, page);

    if (page === 1) {
      setMovies(data.results);
    } else setMovies([...movies, ...data.results]);
    setLoadingStatus(false);
  };

  useEffect(() => {
    getSearchMovie();
  }, [page, filterText]);

  const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
    _debounce(() => {
      setFilterText(e.currentTarget.value);
    }, 1500)();
  };

  const handleMenuClick = () => {
    setDrawerVisible(!drawerVisible);
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
  };

  const handleSearchClick = () => {
    setSearchVisible(!searchVisible);
    setFilterText("");
  };

  return (
    <>
      <Row
        style={{
          backgroundColor: theme === "light" ? "#f0f2f5" : "#333",
          width: "100%",
        }}
        className="header"
      >
        <Col onClick={() => navigate("/")} className="title" span={12}>
          MOV
          {searchVisible ? (
            <Col
              className="search-input-large"
              style={{
                display: "flex",
                alignItems: "end",
                marginBottom: "0.5rem",
                justifyContent: "space-between",
              }}
              span={6}
            >
              <Typography>
                <Input
                  style={{ background: "#f5f5f5", width: "100%" }}
                  size="middle"
                  placeholder="Search a movie"
                  variant="borderless"
                  onChange={(e) => handleFilter(e)}
                />
              </Typography>
              <Typography>
                <CloseOutlined
                  style={{
                    color: theme === "dark" ? "#f0f2f5" : "#333",
                    fontSize: "24px",
                    cursor: "pointer",
                  }}
                  onClick={handleSearchClick}
                />
              </Typography>
            </Col>
          ) : (
            <Col
              className="search-input-large"
              onClick={handleSearchClick}
              span={3}
            >
              <Typography
                style={{
                  color: theme === "dark" ? "#f0f2f5" : "#333",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                <Tooltip title="Search a movie">
                  <SearchOutlined />
                </Tooltip>
              </Typography>
            </Col>
          )}
        </Col>
        <Row className="right-row">
          <Col span={3}>
            <Typography
              className="movie-icon-wrapper"
              onClick={() => navigate("/movies")}
            >
              <Tooltip title="Movies">
                <VideoCameraOutlined className="movie-icon" />
              </Tooltip>
            </Typography>
          </Col>
          <Col span={3}>
            <Typography
              style={{
                color: theme === "dark" ? "#f0f2f5" : "#333",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              {reqToken ? (
                <Tooltip title="Log out">
                  <UserDeleteOutlined
                    onClick={showDeleteModal}
                    style={{ color: "orange" }}
                  />{" "}
                </Tooltip>
              ) : (
                <Tooltip title="Log in">
                  <UserAddOutlined onClick={showModal} />
                </Tooltip>
              )}
            </Typography>
          </Col>
          <Col span={3}>
            <Typography
              style={{
                color: theme === "dark" ? "#f0f2f5" : "#333",
                fontSize: "24px",
                cursor: "pointer",
              }}
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <Tooltip title="Turn off the lights">
                  <BulbOutlined />
                </Tooltip>
              ) : (
                <Tooltip title="Turn on the lights">
                  <BulbFilled />
                </Tooltip>
              )}
            </Typography>
          </Col>
        </Row>
        <Col className="hamburger" span={3} style={{ textAlign: "right" }}>
          <MenuOutlined
            onClick={handleMenuClick}
            style={{
              fontSize: "20px",
              cursor: "pointer",
              color: theme === "dark" ? "#f0f2f5" : "#333",
            }}
          />
        </Col>
        <Space className="search-input-sm">
          <Input
            placeholder="Search Movies"
            variant="borderless"
            allowClear
            style={{ background: "#f5f5f5" }}
            size="large"
            onChange={(e) => handleFilter(e)}
          />
        </Space>
      </Row>
      <Drawer
        style={{ zIndex: "9999" }}
        placement="left"
        onClose={handleCloseDrawer}
        open={drawerVisible}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <Typography.Title onClick={() => navigate("/movies")} level={1}>
            Movies
          </Typography.Title>
          <Typography.Title level={1}>
            {reqToken ? (
              <Typography.Title onClick={showDeleteModal} level={1}>
                Log out{" "}
              </Typography.Title>
            ) : (
              <Typography.Title onClick={showModal} level={1}>
                Log in{" "}
              </Typography.Title>
            )}
          </Typography.Title>
          <Switch
            className={`${theme === "light" ? "light-switch" : "dark-switch"}`}
            style={{
              width: "30%",
              height: "2.5rem",
            }}
            onClick={toggleTheme}
            checked={theme === "light"}
          />
        </div>
      </Drawer>

      {movies.length > 0 && (
        <Space className="list">
          <InfiniteScroll
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
            dataLength={page * movies.length}
            next={() => {
              setPage(page + 1);
            }}
            hasMore={true}
            loader={
              <Button
                type="text"
                style={{ width: "100%" }}
                onClick={() => setPage(page + 1)}
              >
                <Typography.Title level={4}>Load more</Typography.Title>
              </Button>
            }
          >
            <Row style={{ padding: "3rem" }} gutter={[32, 16]}>
              {movies.map((movie: MovieModel) => (
                <ColComponent movie={movie} />
              ))}
            </Row>
          </InfiniteScroll>
        </Space>
      )}

      <Modal
        title="Confirm token"
        open={reqToken && reqToken?.length > 0 ? open : false}
        onOk={handleOpenTMDbAuth}
        confirmLoading={loading}
        onCancel={handleCancel}
      >
        <Typography.Text> Please click to confirm your token</Typography.Text>
      </Modal>
      <Modal
        title="Delete token"
        open={openDeleteModal}
        onOk={handleDeleteSession}
        confirmLoading={loading}
        onCancel={handleDeleteModalCancel}
      >
        <Typography.Text>Please confirm deletion of your token</Typography.Text>
      </Modal>
    </>
  );
};

export default Header;
