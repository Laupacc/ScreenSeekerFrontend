import { useState, useEffect } from 'react';
import { Popover, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Movie from './Movie';
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


function Home() {
  const [selectedCategory, setSelectedCategory] = useState("MOVIES");
  const [selectedTab, setSelectedTab] = useState("LASTRELEASES");
  const [selectedTabShow, setSelectedTabShow] = useState("LASTRELEASESSHOWS");
  const [likedMovies, setLikedMovies] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [moviesData, setMoviesData] = useState([]);
  const [tvData, setTvData] = useState([]);
  const [genresData, setGenresData] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedTvShows, setTopRatedTvShows] = useState([]);
  const [open, setOpen] = useState(false);


  const modalstyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };





  useEffect(() => {
    Promise.all([
      fetch('https://my-movies-backend-iota.vercel.app/movies'),
      fetch('https://my-movies-backend-iota.vercel.app/tv'),
      fetch('https://my-movies-backend-iota.vercel.app/genres'),
      fetch('https://my-movies-backend-iota.vercel.app/topratedmovies'),
      fetch('https://my-movies-backend-iota.vercel.app/topratedtv')
    ])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(data => {
        console.log(data);
        const [moviesData, tvData, genresData, topRatedMoviesData, topRatedTvData] = data;
        setMoviesData(moviesData.movies);
        setTvData(tvData.tv);
        setGenresData(genresData.genres);
        setTopRatedMovies(topRatedMoviesData.topratedmovies);
        setTopRatedTvShows(topRatedTvData.topratedtv);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
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

  // Generic function to filter items based on selected genres
  const filterItemsByGenres = (items, selectedGenres) => {
    if (selectedGenres.length === 0) return items;
    return items.filter(item =>
      item.genre_ids.some(genreId => selectedGenres.includes(genreId))
    );
  };

  // Function to map filtered items to components
  const mapFilteredItemsToComponents = (filteredItems, Component) => {
    return filteredItems.map((data, i) => (
      <Component
        key={i}
        title={data.title || data.name}
        overview={data.overview}
        poster={data.poster_path}
        voteAverage={data.vote_average}
        voteCount={data.vote_count}
        genre_ids={data.genre_ids}
        releaseDate={data.release_date}
        genresData={genresData}
      />
    ));
  };

  // Filter movies, TV shows, top rated movies, and top rated TV shows
  const filteredMovies = filterItemsByGenres(moviesData, selectedGenres);
  const movies = mapFilteredItemsToComponents(filteredMovies, Movie);

  const filteredTvShows = filterItemsByGenres(tvData, selectedGenres);
  const tv = mapFilteredItemsToComponents(filteredTvShows, Movie);

  const filteredTopRatedMovies = filterItemsByGenres(topRatedMovies, selectedGenres);
  const topRated = mapFilteredItemsToComponents(filteredTopRatedMovies, Movie);

  const filteredTopRatedTvShows = filterItemsByGenres(topRatedTvShows, selectedGenres);
  const topRatedTv = mapFilteredItemsToComponents(filteredTopRatedTvShows, Movie);

  // Genres map
  const genrePopover = genresData.map((data, i) => {
    const isSelected = selectedGenres.includes(data.id);
    return (
      <div key={i} className={`${styles.genreContent} ${isSelected ? styles.selectedGenre : ''}`} onClick={() => toggleGenre(data.id)}>
        {data.name}
      </div>
    );
  });

  // Genres button content
  const selectedGenresCount = selectedGenres.length;
  const genresButtonContent = selectedGenresCount > 0 ? `Genres (${selectedGenresCount} selected)` : 'Genres';

  // Login modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.mainHeader}>
          <div className={styles.topButtonsHeader}>
            <a className={styles.buttonIconCinema} onClick={() => setSelectedCategory("MOVIES")}><img src='cinemaIcon.png' alt="icon" className={styles.icon} /></a>
            <a className={styles.buttonIconTv} onClick={() => setSelectedCategory("TV")}><img src='tvIcon.png' alt="icon" className={styles.icon} /></a>
          </div>
          <div className={styles.loginHeader}>
            <a className={styles.login} onClick={handleOpen}>Login</a>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modalstyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Sing in
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                </Typography>
                <Button>Submit</Button>
                <a onClick={handleClose}>Close</a>
              </Box>
            </Modal>

            <img src='ScreenSeekerRoundLogoSmall.png' alt="logo" className={styles.logo} />
          </div>
        </div>
        {/* <div>
          <Popover title="Liked movies" content={popoverContent} className={styles.popover} trigger="click">
            <Button>♥ {likedMovies.length} movie(s)</Button>
          </Popover>
        </div> */}
        {selectedCategory === "MOVIES" && (
          <>
            <div className={styles.movieHeader}>
              <div className={styles.buttonHeader}>
                <a className={styles.button} onClick={() => setSelectedTab("LASTRELEASES")}>New Movies</a>
                <a className={styles.button} onClick={() => setSelectedTab("TOPRATED")}>Best Movies</a>
              </div>
              <Popover content={genrePopover} className={styles.popover} trigger="click">
                <a className={styles.genres}>{genresButtonContent}</a>
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
              <div className={styles.buttonHeader}>
                <a className={styles.button} onClick={() => setSelectedTabShow("LASTRELEASESSHOWS")}>New Shows</a>
                <a className={styles.button} onClick={() => setSelectedTabShow("TOPRATEDSHOWS")}>Best Shows</a>
              </div>
              <Popover content={genrePopover} className={styles.popover} trigger="click">
                <a className={styles.genres}>{genresButtonContent}</a>
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