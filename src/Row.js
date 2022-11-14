import React, { useEffect, useState } from "react";
import axios from "./axios";
import "./row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const Row = ({ title, fetchUrl, isLargeRow }) => {
  const ApiKey = "api_key=1cf50e6248dc270629e802686245c2c8";
  const BaseUrl = "https://api.themoviedb.org/3";
  const ApiUrl = BaseUrl + "/discover/movie?sort_by=popularity.desc&" + ApiKey;
  const searchUrl = BaseUrl + "/search/movie?" + ApiKey;

  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  // A snippet of code which runs based on a specific condition/variable
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      //   console.table(request.data.results);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  });

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  const handleClick = async (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      movieTrailer(movie?.name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((err) => console.log(err));
    }
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      let trailerurl = await axios.get(
        `/movie/${movie.id}/videos?api_key=fb34530271b349314af0de263d16ab5a`
      );
      setTrailerUrl(trailerurl.data.results[0]?.key);
    }
  };

  const imgUrl = "https://image.tmdb.org/t/p/w500";

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchTerm = e.target.value;
    if (searchTerm) {
      setMovies(searchUrl + "&query=" + searchTerm);
    } else {
      setMovies(ApiUrl);
    }
  };

  return (
    <div className="row">
      <form action="" className="form" onSubmit={() => handleSubmit}>
        <input
          className="search "
          name="query"
          placeholder="search"
          type="text"
        />
      </form>
      <h2>{title}</h2>
      <div className="row_posters">
        {movies.map((movie) => {
          return (
            // <h2>{movie.title}</h2>
            <img
              key={movie.id}
              onClick={() => handleClick(movie)}
              className={`row_poster ${isLargeRow && "row_posterLarge"}`}
              src={` ${imgUrl}${
                isLargeRow ? movie.poster_path : movie.backdrop_path
              } `}
              alt={movie.name}
            />
          );
        })}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
};

export default Row;
