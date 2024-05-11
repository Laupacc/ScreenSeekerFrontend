import { useState, useEffect } from 'react';
import { Popover } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { CgCloseR } from "react-icons/cg";
import Movie from './Movie';
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../reducers/user';
import { addLikedMovie, removeLikedMovie } from '../reducers/liked';
import Swal from 'sweetalert2'
import { ColorRing } from 'react-loader-spinner'
import { PiArrowFatLinesUpDuotone } from "react-icons/pi";
import { TbArrowBigUpLinesFilled } from "react-icons/tb";
import { IoFilter } from "react-icons/io5";
import { BiCategoryAlt } from "react-icons/bi";


function Home() {
  // Redux
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const liked = useSelector((state) => state.liked.value);

  // State variables
  const [selectedCategory, setSelectedCategory] = useState("MOVIES");
  const [selectedTab, setSelectedTab] = useState("LASTRELEASES");
  const [selectedTabShow, setSelectedTabShow] = useState("LASTRELEASESSHOWS");
  const [selectedGenres, setSelectedGenres] = useState([]);

  // Data variables
  const [moviesData, setMoviesData] = useState([]);
  const [tvData, setTvData] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedTvShows, setTopRatedTvShows] = useState([]);
  const [genresMovieData, setGenresMovieData] = useState([]);
  const [genresTvData, setGenresTvData] = useState([]);

  // Filter and order variables
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');

  // Login modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Sign up and sign in variables
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signInUsername, setSignInUsername] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
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

  ColorRing.defaultProps = {
    visible: true,
    height: 100,
    width: 100,
    ariaLabel: 'color-ring-loading',
    wrapperStyle: {},
    wrapperClass: 'color-ring-wrapper',
    colors: ['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87'],
  };

  // Fetch movies, TV shows, and genres data
  useEffect(() => {
    Promise.all([
      fetch('https://screenseeker-backend.vercel.app/movies'),
      fetch('https://screenseeker-backend.vercel.app/tv'),
      fetch('https://screenseeker-backend.vercel.app/genresmovie'),
      fetch('https://screenseeker-backend.vercel.app/genrestv'),
      fetch('https://screenseeker-backend.vercel.app/topratedmovies'),
      fetch('https://screenseeker-backend.vercel.app/topratedtv')
    ])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(data => {
        console.log(data);
        const [moviesData, tvData, genresMovieData, genresTvData, topRatedMoviesData, topRatedTvData] = data;
        setMoviesData(moviesData.movies);
        setTvData(tvData.tv);
        setGenresMovieData(genresMovieData.genres);
        setGenresTvData(genresTvData.genres);
        setTopRatedMovies(topRatedMoviesData.topratedmovies);
        setTopRatedTvShows(topRatedTvData.topratedtv);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);


  // Sign up and sign in functions
  const handleSignUp = () => {
    fetch('https://screenseeker-backend.vercel.app/users/signup', {
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
    fetch('https://screenseeker-backend.vercel.app/users/signin', {
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
          });
        } else {
          setSignInError('Invalid username or password');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  // Sign out function
  const handleSignOut = () => {
    dispatch(logout());
    console.log('Logged out');
    Swal.fire({
      icon: 'success',
      title: 'Signed out successfully',
      showConfirmButton: false,
      timer: 1500
    });
  }

  // Function to update liked movies
  const updateLikedMovies = (movieTitle) => {
    if (liked.find(movie => movie.title === movieTitle)) {
      dispatch(removeLikedMovie({ title: movieTitle }));
    } else {
      dispatch(addLikedMovie({ title: movieTitle }));
    }
  };

  // Liked movies popover content
  const likedMoviesPopover = liked.map((movie, i) => (
    <div key={i} className={styles.likedMoviesContainer}>
      <span>{movie.title}</span>
      <FontAwesomeIcon icon={faCircleXmark} onClick={() => updateLikedMovies(movie.title)} className={styles.crossIcon} />
    </div>
  ));

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


  // Genres popover content
  const genrePopover = (
    <div className={styles.selectedGenreContainer} >
      {selectedGenres && (
        <button className={styles.clearGenresButton} onClick={() => setSelectedGenres([])}>
          Clear All Genres
        </button>
      )}
      {selectedCategory === "MOVIES" && genresMovieData.map((data, i) => {
        const isSelected = selectedGenres.includes(data.id);
        return (
          <div
            key={i}
            className={`${styles.genreContent} ${isSelected ? styles.selectedGenre : ''}`}
            onClick={() => toggleGenre(data.id)}
          >
            {data.name}
          </div>
        );
      })}
      {selectedCategory === "TV" && genresTvData.map((data, i) => {
        const isSelected = selectedGenres.includes(data.id);
        return (
          <div
            key={i}
            className={`${styles.genreContent} ${isSelected ? styles.selectedGenre : ''}`}
            onClick={() => toggleGenre(data.id)}
          >
            {data.name}
          </div>
        );
      })}
    </div>
  );

  // Genres button content
  const selectedGenresCount = selectedGenres.length;
  const genresButtonContent = selectedGenresCount > 0 ? `Genres (${selectedGenresCount})` : 'Genres';

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  // Function to apply filter based on criteria and sortOrder
  const applyFilter = (filter, order) => {
    setSelectedFilter(filter);
    setSelectedOrder(order);

    // Helper function to sort data array
    const sortDataArray = (dataArray, compareFunction) => {
      return [...dataArray].sort(compareFunction);
    };

    // Compare functions for sorting based on selectedFilter and selectedOrder
    const compareFunctions = {
      date: (a, b) => order === "asc" ? new Date(a.release_date) - new Date(b.release_date) : new Date(b.release_date) - new Date(a.release_date),
      vote: (a, b) => order === "asc" ? a.vote_average - b.vote_average : b.vote_average - a.vote_average,
      popularity: (a, b) => order === "asc" ? a.popularity - b.popularity : b.popularity - a.popularity
    };

    // Sort each data array based on the selectedFilter and selectedOrder
    setMoviesData(sortDataArray(moviesData, compareFunctions[filter]));
    setTvData(sortDataArray(tvData, compareFunctions[filter]));
    setTopRatedMovies(sortDataArray(topRatedMovies, compareFunctions[filter]));
    setTopRatedTvShows(sortDataArray(topRatedTvShows, compareFunctions[filter]));
  };

  // Function to clear filters
  const clearFilters = () => {
    if (selectedCategory === "MOVIES" && selectedTab === "LASTRELEASES") {
      applyFilter('popularity', 'desc');
    } else if (selectedCategory === "MOVIES" && selectedTab === "TOPRATED") {
      applyFilter('vote', 'desc');
    } else if (selectedCategory === "TV" && selectedTabShow === "LASTRELEASESSHOWS") {
      applyFilter('popularity', 'desc');
    } else if (selectedCategory === "TV" && selectedTabShow === "TOPRATEDSHOWS") {
      applyFilter('vote', 'desc');
    }
  };

  // Filter popover content
  const filterPopover = (
    <div className={styles.selectedFilterContainer}>
      <button className={styles.clearGenresButton} onClick={clearFilters}>Reset Filter</button>
      {selectedCategory !== "TV" && (
        <>
          <div className={selectedFilter === "date" && selectedOrder === "asc" ? styles.selectedFilter : styles.filterPopoverContent} onClick={() => applyFilter("date", "asc")}>Release date ↑</div>
          <div className={selectedFilter === "date" && selectedOrder === "desc" ? styles.selectedFilter : styles.filterPopoverContent} onClick={() => applyFilter("date", "desc")}>Release date ↓</div>
        </>
      )}
      <div className={selectedFilter === "vote" && selectedOrder === "asc" ? styles.selectedFilter : styles.filterPopoverContent} onClick={() => applyFilter("vote", "asc")}>Vote average ↑</div>
      <div className={selectedFilter === "vote" && selectedOrder === "desc" ? styles.selectedFilter : styles.filterPopoverContent} onClick={() => applyFilter("vote", "desc")}>Vote average ↓</div>
      <div className={selectedFilter === "popularity" && selectedOrder === "asc" ? styles.selectedFilter : styles.filterPopoverContent} onClick={() => applyFilter("popularity", "asc")}>Popularity ↑</div>
      <div className={selectedFilter === "popularity" && selectedOrder === "desc" ? styles.selectedFilter : styles.filterPopoverContent} onClick={() => applyFilter("popularity", "desc")}>Popularity ↓</div>
    </div>
  );

  // Function to format date
  const formatedDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  // Function to map filtered items to components
  const mapFilteredItemsToComponents = (filteredItems, Component) => {
    return filteredItems.map((data, i) => (
      <Component
        key={i}
        title={data && (data.title || data.name)}
        overview={data && data.overview}
        poster={data && data.poster_path}
        voteAverage={data && data.vote_average}
        voteCount={data && data.vote_count}
        genre_ids={data && data.genre_ids}
        releaseDate={selectedCategory === "MOVIES" ? data && formatedDate(data.release_date) : data && formatedDate(data.first_air_date)}
        popularity={data && data.popularity}
        genresData={selectedCategory === "MOVIES" ? genresMovieData : genresTvData}
        likedMovies={liked}
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
              <button>♥ {liked.length} movie(s) / show(s)</button>
            </Popover>
          </div>
        ) : (<></>)}

        <div className={styles.header}>
          <div className={styles.buttonIconCinema} onClick={() => setSelectedCategory("MOVIES")} data-text="Movies"><img src='cinemaIcon.png' alt="icon" className={styles.icon} /></div>
          <div className={styles.buttonIconTv} onClick={() => setSelectedCategory("TV")} data-text="TV Shows" ><img src='tvIcon.png' alt="icon" className={styles.icon} /></div>
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

              <div className={styles.popoverSection}>
                <Popover content={genrePopover} trigger="click" className={styles.bottomPopovers}>
                  <a className={styles.bottomPopoversBtn}>{genresButtonContent} <BiCategoryAlt className={styles.miniIcon} /></a>
                </Popover>

                <Popover placement="bottom" content={filterPopover} trigger="click" className={styles.bottomPopovers}>
                  <a className={styles.bottomPopoversBtn}>Filter<IoFilter className={styles.miniIcon} /></a>
                </Popover>
              </div>

            </div>
            {selectedTab === "LASTRELEASES" && (
              <div className={styles.moviesContainer}>
                {moviesData.length > 0 ? (
                  filterItemsByGenres(moviesData, selectedGenres).length > 0 ?
                    movies :
                    <p className={styles.loading}>Sorry, there are no matches for the selected genre</p>
                ) : <ColorRing />
                }
              </div>

            )}
            {selectedTab === "TOPRATED" && (
              <div className={styles.moviesContainer}>
                {topRatedMovies.length > 0 ? (
                  filterItemsByGenres(topRatedMovies, selectedGenres).length > 0 ?
                    topRated :
                    <p className={styles.loading}>Sorry, there are no matches for the selected genre</p>
                ) : <ColorRing />
                }
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
              <div className={styles.popoverSection}>
                <Popover content={genrePopover} trigger="click" className={styles.bottomPopovers}>
                  <a className={styles.bottomPopoversBtn}>{genresButtonContent} <BiCategoryAlt className={styles.miniIcon} /></a>
                </Popover>

                <Popover placement="bottom" content={filterPopover} trigger="click" className={styles.bottomPopovers}>
                  <a className={styles.bottomPopoversBtn}>Filter<IoFilter className={styles.miniIcon} /></a>
                </Popover>
              </div>
            </div>
            {selectedTabShow === "LASTRELEASESSHOWS" && (
              <div className={styles.moviesContainer}>
                {tvData.length > 0 ? (
                  filterItemsByGenres(tvData, selectedGenres).length > 0 ?
                    tv :
                    <p className={styles.loading}>Sorry, there are no matches for the selected genre</p>
                ) : <ColorRing />
                }
              </div>
            )}
            {selectedTabShow === "TOPRATEDSHOWS" && (
              <div className={styles.moviesContainer}>
                {topRatedTvShows.length > 0 ?
                  (filterItemsByGenres(topRatedTvShows, selectedGenres).length > 0 ?
                    topRatedTv :
                    <p className={styles.loading}>Sorry, there are no matches for the selected genre</p>
                  ) : <ColorRing />
                }
              </div>
            )}
          </>
        )}
      </div>
      <TbArrowBigUpLinesFilled onClick={scrollToTop} className={styles.backToTopBtn} size={40} color='#548b9f' />
    </>
  );
}

export default Home;