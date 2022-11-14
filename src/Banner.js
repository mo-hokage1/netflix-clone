import React, { useEffect, useState } from "react";
import axios from "./axios";
import requests from "./requests";
import "./banner.css";
import YouTube from "react-youtube";
// import movieTrailer from "movie-trailer";

const Banner = () => {
  const [movie, setMovie] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchTrending);
      const random = Math.floor(
        Math.random() * request.data.results.length - 1
      );

      setMovie(request.data.results[random]);
    }
    fetchData();
  }, []);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  const handleClick = async () => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      let trailerurl = await axios.get(
        `/movie/${movie.id}/videos?api_key=fb34530271b349314af0de263d16ab5a`
      );
      setTrailerUrl(trailerurl.data.results[0]?.key);
    }
  };

  return (
    <div>
      <header
        className="banner"
        style={{
          backgroundSize: "cover",
          backgroundImage: `url("https://image.tmdb.org/t/p/original${movie?.backdrop_path}")`,
          backdropPosition: "center center",
        }}
      >
        <div className="banner_contents">
          {/* title */}
          <h1 className="banner_title">
            {movie?.title || movie?.name || movie?.original_name}
          </h1>
          {/* 2 buttons */}
          <div className="banner_buttons">
            <button onClick={handleClick} className="banner_button">
              <span className={trailerUrl ? "fa fa-play" : "fa fa-play"}></span>
              {trailerUrl ? "Close" : "Play"}
            </button>
            {/* <button className="banner_button">My List</button> */}
          </div>
          {/* description */}
          <h1 className="banner_description">{movie.overview}</h1>
        </div>
        <div className="banner--fadebottom"></div>
      </header>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
};

export default Banner;
