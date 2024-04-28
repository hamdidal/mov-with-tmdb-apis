import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context";
import "./App.css";
import MovieDetails from "./pages/details";
import MovieList from "./pages/movies";

const App = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/details/:id" element={<MovieDetails />} />
        <Route path="/movies" element={<MovieList />} />
      </Routes>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default App;
