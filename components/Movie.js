import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar, faVideo } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Movie.module.css';

function Movie(props) {
  const [watchCount, setWatchCount] = useState(0);
  const [personalNote, setPersonalNote] = useState(0);

  // Average evaluation
  const stars = [];
  for (let i = 0; i < 10; i++) {
    let style = {};
    if (i < props.voteAverage - 1) {
      style = { 'color': '#f1c40f' };
    }
    stars.push(<FontAwesomeIcon key={i} icon={faStar} style={style} />);
  }

  // Watch movie
  const handleWatchMovie = () => {
    setWatchCount(watchCount + 1);
  };
  let videoIconStyle = { 'cursor': 'pointer' };
  if (watchCount > 0) {
    videoIconStyle = { 'color': '#e74c3c', 'cursor': 'pointer' };
  }

  // Like movie
  const handleLikeMovie = () => {
    props.updateLikedMovies(props.title);
  };
  let heartIconStyle = { 'cursor': 'pointer' };
  if (props.isLiked) {
    heartIconStyle = { 'color': '#e74c3c', 'cursor': 'pointer' };
  }

  // Personal note
  const personalStars = [];
  for (let i = 0; i < 10; i++) {
    let style = { 'cursor': 'pointer' };
    if (i < personalNote) {
      style = { 'color': '#2196f3', 'cursor': 'pointer' };
    }
    personalStars.push(<FontAwesomeIcon key={i} icon={faStar} onClick={() => setPersonalNote(i + 1)} style={style} className="note" />);
  }

  // Map genre IDs to names
  const mapGenreIdsToNames = () => {
    if (!props.genresData) {
      return '';
    }
    const genreNames = props.genresData
      .filter(genre => props.genre_ids.includes(genre.id))
      .map(genre => genre.name);
    return genreNames.join(', ');
  };

  return (
    <div className={styles.card}>
      <img className={styles.image} src={`https://image.tmdb.org/t/p/w500/${props.poster}`} alt={props.title} />
      <div className={styles.textContainer}>
        <div>
          <span className={styles.name}>{props.title}</span>
          <p className={styles.description}>{props.overview.length > 205 ? `${props.overview.slice(0, 250)}...` : props.overview}</p>
          <p className={styles.releaseDate}>{props.releaseDate}</p>
          <p className={styles.genres}>{mapGenreIdsToNames()}</p>
        </div>
        <div className={styles.iconContainer}>
          <span className={styles.vote}>Ratings: {stars}({props.voteCount})</span>
          <span>My note: {personalStars} ({personalNote})</span>
          <span>Watch count: <FontAwesomeIcon icon={faVideo} onClick={() => handleWatchMovie()} style={videoIconStyle} className="watch" />({watchCount}) </span>
          <span>I love it: <FontAwesomeIcon icon={faHeart} onClick={() => handleLikeMovie()} style={heartIconStyle} className="like" /></span>
        </div>
      </div>
    </div>
  );
}

export default Movie;
