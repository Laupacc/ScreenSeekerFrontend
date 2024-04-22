import { useState, useEffect } from 'react';
import { Popover, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Movie from './Movie';
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css';



function Home() {
  const [selectedCategory, setSelectedCategory] = useState("MOVIES");
  const [selectedTab, setSelectedTab] = useState("LASTRELEASES");
  const [selectedTabShow, setSelectedTabShow] = useState("LASTRELEASESSHOWS");
  const [likedMovies, setLikedMovies] = useState([]);
  const [moviesData, setMoviesData] = useState([]);
  const [tvData, setTvData] = useState([]);
  const [genresData, setGenresData] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [topRatedTvShows, setTopRatedTvShows] = useState([]);


  // fetch movies list
  useEffect(() => {
    fetch('https://my-movies-backend-iota.vercel.app/movies')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setMoviesData(data.movies);
      });
  }, []);

  // fetch tv shows list
  useEffect(() => {
    fetch('https://my-movies-backend-iota.vercel.app/tv')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setTvData(data.tv);
      });
  }, []);

  // fetch genres list
  useEffect(() => {
    fetch('https://my-movies-backend-iota.vercel.app/genres')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setGenresData(data.genres);
      });
  }, []);

  // fetch top rated movies list
  useEffect(() => {
    fetch('https://my-movies-backend-iota.vercel.app/topratedmovies')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setTopRatedMovies(data.topratedmovies);
      });
  }, []);

  // fetch top rated tv shows list
  useEffect(() => {
    fetch('https://my-movies-backend-iota.vercel.app/topratedtv')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setTopRatedTvShows(data.topratedtv);
      });
  }, []);


  // Liked movies (inverse data flow)
  const updateLikedMovies = (movieTitle) => {
    if (likedMovies.find(movie => movie === movieTitle)) {
      setLikedMovies(likedMovies.filter(movie => movie !== movieTitle));
    } else {
      setLikedMovies([...likedMovies, movieTitle]);
    }
  };

  // Liked movies popover content
  const likedMoviesPopover = likedMovies.map((data, i) => {
    return (
      <div key={i} className={styles.likedMoviesContainer}>
        <span className="likedMovie">{data}</span>
        <FontAwesomeIcon icon={faCircleXmark} onClick={() => updateLikedMovies(data)} className={styles.crossIcon} />
      </div>
    );
  });

  // Liked movies popover
  const popoverContent = (
    <div className={styles.popoverContent}>
      {likedMoviesPopover}
    </div>
  );

  // Function to toggle selected genres
  const toggleGenre = (genreId) => {
    console.log(genreId);
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter(id => id !== genreId));
    } else {
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  // Function to filter movies based on selected genres
  const filterMoviesByGenres = (movies) => {
    if (selectedGenres.length === 0) return movies;
    return movies.filter(movie =>
      movie.genre_ids.some(genreId => selectedGenres.includes(genreId))
    );
  };

  // Movies list map
  const filteredMovies = filterMoviesByGenres(moviesData);
  const movies = filteredMovies.map((data, i) => {
    const isLiked = likedMovies.some(movie => movie === data.title);
    return <Movie key={i} updateLikedMovies={updateLikedMovies} isLiked={isLiked} title={data.title} overview={data.overview} poster={data.poster_path} voteAverage={data.vote_average} voteCount={data.vote_count} genre_ids={data.genre_ids} genresData={genresData} />;
  });

  // Function to filter TV shows based on selected genres
  const filterTvShowsByGenres = (tvShows) => {
    if (selectedGenres.length === 0) return tvShows;
    return tvShows.filter(show =>
      show.genre_ids.some(genreId => selectedGenres.includes(genreId))
    );
  };

  // TV shows list map
  const filteredTvShows = filterTvShowsByGenres(tvData);
  const tv = filteredTvShows.map((data, i) => {
    return <Movie key={i} title={data.name} overview={data.overview} poster={data.poster_path} voteAverage={data.vote_average} voteCount={data.vote_count} genre_ids={data.genre_ids} genresData={genresData} />;
  });

  // Top rated movies list map
  const topRated = topRatedMovies.map((data, i) => {
    return <Movie key={i} title={data.title} overview={data.overview} poster={data.poster_path} voteAverage={data.vote_average} voteCount={data.vote_count} genre_ids={data.genre_ids} genresData={genresData} />;
  });

  // Top rated tv shows list map
  const topRatedTv = topRatedTvShows.map((data, i) => {
    return <Movie key={i} title={data.name} overview={data.overview} poster={data.poster_path} voteAverage={data.vote_average} voteCount={data.vote_count} genre_ids={data.genre_ids} genresData={genresData} />;
  });

  // Genres map
  const genrePopover = genresData.map((data, i) => {
    const isSelected = selectedGenres.includes(data.id);
    return (
      <div key={i} className={`${styles.genreContent} ${isSelected ? styles.selectedGenre : ''}`} onClick={() => toggleGenre(data.id)}>
        {data.name}
      </div>
    );
  });

  return (
    <>
      <div className={styles.main}>
        <div className={styles.mainHeader}>
          <img src='ScreenSeekerLogoSmall.png' alt="logo" className={styles.logo} />
        </div>
        <div className={styles.categories}>
          <Button className={styles.button} onClick={() => setSelectedCategory("MOVIES")}>Movies</Button>
          <Button className={styles.button} onClick={() => setSelectedCategory("TV")}>Tv</Button>
          <Popover title="Liked movies" content={popoverContent} className={styles.popover} trigger="click">
            <Button>♥ {likedMovies.length} movie(s)</Button>
          </Popover>
        </div>
        {selectedCategory === "MOVIES" && (
          <>
            <div className={styles.movieHeader}>
              <Button className={styles.button} onClick={() => setSelectedTab("LASTRELEASES")}>Last Releases</Button>
              <Button className={styles.button} onClick={() => setSelectedTab("TOPRATED")}>Top Rated Movies</Button>
              <Popover content={genrePopover} className={styles.popover} trigger="click">
                <Button className={styles.button}>Genres</Button>
              </Popover>
            </div>
            {selectedTab === "LASTRELEASES" && (
              <div className={styles.moviesContainer}>
                {moviesData.length > 0 ? movies : <p>Loading...</p>}
              </div>
            )}
            {selectedTab === "TOPRATED" && (
              <div className={styles.moviesContainer}>
                {topRatedMovies.length > 0 ? topRated : <p>Loading...</p>}
              </div>
            )}
          </>
        )}
        {selectedCategory === "TV" && (
          <>
            <div className={styles.movieHeader}>
              <Button className={styles.button} onClick={() => setSelectedTabShow("LASTRELEASESSHOWS")}>Last Releases Shows</Button>
              <Button className={styles.button} onClick={() => setSelectedTabShow("TOPRATEDSHOWS")}>Top Rated Shows</Button>
              <Popover content={genrePopover} className={styles.popover} trigger="click">
                <Button className={styles.button}>Genres</Button>
              </Popover>
            </div>
            {selectedTabShow === "LASTRELEASESSHOWS" && (
              <div className={styles.moviesContainer}>
                {tvData.length > 0 ? tv : <p>Loading...</p>}
              </div>
            )}
            {selectedTabShow === "TOPRATEDSHOWS" && (
              <div className={styles.moviesContainer}>
                {topRatedTvShows.length > 0 ? topRatedTv : <p>Loading...</p>}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Home;