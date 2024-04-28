import { useState, useEffect } from 'react';
import { Popover } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { CgCloseR } from "react-icons/cg";
import { Link } from 'react-router-dom';
import Movie from './Movie';
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../reducers/user';
import Swal from 'sweetalert2'



function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

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
  const [signUpError, setSignUpError] = useState('');
  const [signInError, setSignInError] = useState('');


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

  // Fetch movies, TV shows, and genres data
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
        likedMovies={likedMovies}
        updateLikedMovies={updateLikedMovies}
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

  // Fetch sign up and sign in data
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signInUsername, setSignInUsername] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const handleSignUp = () => {
    fetch('https://my-movies-backend-iota.vercel.app/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          console.log('Success:', data);
          dispatch(login({ username: username, token: data.token }));
          setUsername('');
          setPassword('');
          setOpen(false);
        } else {
          console.log('User already exists');
          setSignUpError('User already exists. Please sign in instead.');

        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const handleSignIn = () => {
    fetch('https://my-movies-backend-iota.vercel.app/users/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: signInUsername, password: signInPassword }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          console.log('Success:', data);
          dispatch(login({ username: signInUsername, token: data.token }));
          setSignInUsername('');
          setSignInPassword('');
          setOpen(false);
          Swal.fire({
            icon: 'success',
            title: 'Signed in successfully',
            showConfirmButton: false,
            timer: 1500
          })
        } else {
          setSignInError('Invalid username or password');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const handleSignOut = () => {
    dispatch(logout());
    console.log('Logged out');
    Swal.fire({
      icon: 'success',
      title: 'Signed out successfully',
      showConfirmButton: false,
      timer: 1500
    })
  }

  return (
    <>
      <div className={styles.main}>
        <div className={styles.loginHeader}>
          {!user.token ? (
            <button className={styles.login} onClick={handleOpen}>Login</button>
          ) : (
            <>
              <div className={styles.welcome}>Welcome, {user.username}!</div>
              <div className={styles.logoutContainer}>
                <button className={styles.login} onClick={handleSignOut}>Logout</button>
              </div>
            </>
          )}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="Login modal"
          >
            <Box sx={modalstyle}>
              <div className={styles.registerContainer}>

                <div className={styles.closeBtnContainer}>
                  <CgCloseR size={25} className={styles.closeBtn} onClick={handleClose} />
                </div>

                <div className={styles.registerSection}>
                  <p className={styles.modalTitle}>Don't have an account yet?</p>
                  <input className={styles.input} type="text" placeholder="Username" id="username" onChange={(e) => setUsername(e.target.value)} value={username} />
                  <input className={styles.input} type="password" placeholder="Password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                  <button className={styles.modalBtn} id="signup" onClick={() => handleSignUp()}>Sing Up</button>
                  {signUpError && <p className={styles.error}>{signUpError}</p>}
                </div>
                <div className={styles.registerSection}>
                  <p className={styles.modalTitle}>Already have an account</p>
                  <input className={styles.input} type="text" placeholder="Username" id="signInUsername" onChange={(e) => setSignInUsername(e.target.value)} value={signInUsername} />
                  <input className={styles.input} type="password" placeholder="Password" id="signInPassword" onChange={(e) => setSignInPassword(e.target.value)} value={signInPassword} />
                  <button className={styles.modalBtn} id="signin" onClick={() => handleSignIn()}>Sign In</button>
                  {signInError && <p className={styles.error}>{signInError}</p>}
                </div>
              </div>
            </Box>
          </Modal>
        </div>

        {user.token ? (
          <div className={styles.popoverHeader}>
            <Popover title="Liked movies" content={popoverContent} className={styles.popover} trigger="click">
              <button>♥ {likedMovies.length} movie(s) / show(s)</button>
            </Popover>
          </div>
        ) : (<></>)}

        <div className={styles.header}>
          <div className={styles.buttonIconCinema} onClick={() => setSelectedCategory("MOVIES")}><img src='cinemaIcon.png' alt="icon" className={styles.icon} /></div>
          <div className={styles.buttonIconTv} onClick={() => setSelectedCategory("TV")}><img src='tvIcon.png' alt="icon" className={styles.icon} /></div>
          <img src='ScreenSeekerRoundLogoSmall.png' alt="logo" className={styles.logo} />
        </div>
        <div>

        </div>
        {selectedCategory === "MOVIES" && (
          <>
            <div className={styles.movieHeader}>
              <div className={styles.buttonHeader}>
                <a className={styles.button} onClick={() => setSelectedTab("LASTRELEASES")}>New Movies</a>
                <a className={styles.button} onClick={() => setSelectedTab("TOPRATED")}>Best Movies</a>
              </div>
              <Popover content={genrePopover} className={styles.popover} trigger="click">
                <a className={styles.genresBtn}>{genresButtonContent}</a>
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
                <a className={styles.genresBtn}>{genresButtonContent}</a>
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