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
  const [likedMovies, setLikedMovies] = useState([]);
  const [moviesData, setMoviesData] = useState([]);
  const [tvData, setTvData] = useState([]);
  const [genresData, setGenresData] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const [topRatedMovies, setTopRatedMovies] = useState([]);

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


  // Filter movies by genre
  const genreSelected = (genreId) => {
    console.log('Selected genre:', genreId);
    if (activeGenre === genreId) {
      setActiveGenre(null);
      setMoviesData([]);
    } else {
      setActiveGenre(genreId);
      const genreMovies = moviesData.filter(movie => movie.genre_ids.includes(genreId));
      setMoviesData(genreMovies);
    }
  };

  // Movies list map
  const movies = moviesData.map((data, i) => {
    const isLiked = likedMovies.some(movie => movie === data.title);
    return <Movie key={i} updateLikedMovies={updateLikedMovies} isLiked={isLiked} title={data.title} overview={data.overview} poster={data.poster_path} voteAverage={data.vote_average} voteCount={data.vote_count} genre_ids={data.genre_ids} genresData={genresData} />;
  });

  // Tv shows list map
  const tv = tvData.map((data, i) => {
    return <Movie key={i} title={data.name} overview={data.overview} poster={data.poster_path} voteAverage={data.vote_average} voteCount={data.vote_count} genre_ids={data.genre_ids} genresData={genresData} />;
  });

  // Genres map
  const genrePopover = genresData.map((data, i) => {
    const isActive = activeGenre === data.id;
    return (
      <div key={i} className={`${styles.genreContent} ${isActive ? styles.activeGenre : ''}`} onClick={() => genreSelected(data.id)}>
        {data.name}
      </div>
    );
  });

  // Top rated movies list map
  const topRated = topRatedMovies.map((data, i) => {
    return <Movie key={i} title={data.title} overview={data.overview} poster={data.poster_path} voteAverage={data.vote_average} voteCount={data.vote_count} genre_ids={data.genre_ids} genresData={genresData} />;
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