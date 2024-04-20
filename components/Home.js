import { useState, useEffect } from 'react';
import { Popover, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Movie from './Movie';
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css';

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("MOVIES");
  const [likedMovies, setLikedMovies] = useState([]);

  // Liked movies (inverse data flow)
  const updateLikedMovies = (movieTitle) => {
    if (likedMovies.find(movie => movie === movieTitle)) {
      setLikedMovies(likedMovies.filter(movie => movie !== movieTitle));
    } else {
      setLikedMovies([...likedMovies, movieTitle]);
    }
  };

  const likedMoviesPopover = likedMovies.map((data, i) => {
    return (
      <div key={i} className={styles.likedMoviesContainer}>
        <span className="likedMovie">{data}</span>
        <FontAwesomeIcon icon={faCircleXmark} onClick={() => updateLikedMovies(data)} className={styles.crossIcon} />
      </div>
    );
  });

  const popoverContent = (
    <div className={styles.popoverContent}>
      {likedMoviesPopover}
    </div>
  );

  // Movies list
  const [moviesData, SetMoviesData] = useState([]);

  useEffect(() => {
    fetch('https://my-movies-backend-iota.vercel.app/movies')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        SetMoviesData(data.movies);
      });
  }, []);

  // Tv shows list
  const [tvData, setTvData] = useState([]);

  useEffect(() => {
    fetch('https://my-movies-backend-iota.vercel.app/tv')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setTvData(data.tv);
      });
  }, []);

  // Genres list
  const [genresData, setGenresData] = useState([]);

  useEffect(() => {
    fetch('https://my-movies-backend-iota.vercel.app/genres')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setGenresData(data.genres);
      });
  }, []);

  const genrePopover = genresData.map((data, i) => {
    return <div key={i}>{data.name}</div>;
  });

  const movies = moviesData.map((data, i) => {
    const isLiked = likedMovies.some(movie => movie === data.title);
    return <Movie key={i} updateLikedMovies={updateLikedMovies} isLiked={isLiked} title={data.title} overview={data.overview} poster={data.poster_path} voteAverage={data.vote_average} voteCount={data.vote_count} />;
  });

  const tv = tvData.map((data, i) => {
    return <Movie key={i} title={data.name} overview={data.overview} poster={data.poster_path} voteAverage={data.vote_average} voteCount={data.vote_count} />;
  });


  return (
    <>
      <div className={styles.main}>
        <div className={styles.header}>
          <Button className={styles.button} onClick={() => setSelectedCategory("MOVIES")}>Movies</Button>
          <Button className={styles.button} onClick={() => setSelectedCategory("TV")}>Tv</Button>
          <Popover title="Liked movies" content={popoverContent} className={styles.popover} trigger="click">
            <Button>♥ {likedMovies.length} movie(s)</Button>
          </Popover>
        </div>
        {selectedCategory === "MOVIES" && (
          <>
            <div className={styles.movieHeader}>
              <div className={styles.title}>LAST RELEASES</div>
              <Popover title="genres" content={genrePopover} className={styles.popover} trigger="click">
                <Button className={styles.button}>Genres</Button>
              </Popover>
            </div>
            <div className={styles.moviesContainer}>
              {movies}
            </div>
          </>
        )}
        {selectedCategory === "TV" && (
          <>
            <div className={styles.title}>TV SHOWS</div>
            <div className={styles.moviesContainer}>
              {tv}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Home;