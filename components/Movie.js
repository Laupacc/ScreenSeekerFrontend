import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar, faVideo, faCircleDown, faPercentage } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Movie.module.css';

function Movie(props) {
  const [watchCount, setWatchCount] = useState(0);
  const [personalNote, setPersonalNote] = useState(0);

  // Average evaluation
  // const stars = [];
  // for (let i = 0; i < 10; i++) {
  //   let style = {};
  //   if (i < props.voteAverage - 1) {
  //     style = { 'color': '#f1c40f' };
  //   }
  //   stars.push(<FontAwesomeIcon key={i} icon={faStar} style={style} />);
  // }

  const percentage = Math.round((props.voteAverage / 10) * 100);
  let percentageColor = '';
  if (percentage >= 90) {
    percentageColor = '#7FFF00'; // bright green
  } else if (percentage >= 80) {
    percentageColor = '#2ecc71'; // green
  } else if (percentage >= 70) {
    percentageColor = '#00bdeb'; // blue
  } else if (percentage >= 60) {
    percentageColor = '#2980b9'; // dark blue
  } else if (percentage >= 50) {
    percentageColor = '#f39c12'; // orange
  } else if (percentage >= 40) {
    percentageColor = '#f1c40f'; // yellow
  } else {
    percentageColor = '#e74c3c'; // red
  };

  // Watch movie
  const handleWatchMovie = (action) => {
    if (action === 'add') {
      setWatchCount(watchCount + 1);
    } else if (action === 'sub') { // Add functionality to subtract one from watch count
      if (watchCount > 0) {
        setWatchCount(watchCount - 1);
      }
    }
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
  if (props.likedMovies.includes(props.title)) {
    heartIconStyle = { 'color': '#e74c3c', 'cursor': 'pointer' };
  }

  // Personal note
  const personalStars = [];
  for (let i = 0; i < 10; i++) {
    let style = { 'cursor': 'pointer' };
    if (i < personalNote) {
      style = { 'color': '#2196f3', 'cursor': 'pointer' };
    }
    personalStars.push(
      <FontAwesomeIcon
        key={i}
        icon={faStar}
        onClick={() => {
          if (i + 1 === personalNote) {
            // Deselect the star if it's already selected
            setPersonalNote(0);
          } else {
            // Otherwise, select the star
            setPersonalNote(i + 1);
          }
        }}
        style={style}
        className="note"
      />
    );
  }


  // Map genre IDs to names
  const mapGenreIdsToNames = () => {
    if (!props.genresData) {
      return '';
    }
    const genreNames = props.genresData
      .filter(genre => props.genre_ids && props.genre_ids.includes(genre.id))
      .map(genre => genre.name);
    return genreNames.join(', ');
  };

  const generateGoogleSearchLink = () => {
    return `https://www.google.com/search?q=${encodeURIComponent(props.title)}`;
  };

  return (
    <div className={styles.card}>
      <a href={generateGoogleSearchLink()} target="_blank" rel="noopener noreferrer">
        <img className={styles.image} src={`https://image.tmdb.org/t/p/w500/${props.poster}`} alt={props.title} />
      </a>
      <div className={styles.textContainer}>
        <div>
          <a href={generateGoogleSearchLink()} target="_blank" rel="noopener noreferrer" className={styles.name}>{props.title}</a>
          <p className={styles.description}>{props.overview && props.overview.length > 205 ? `${props.overview.slice(0, 250)}...` : props.overview}</p>

          <p className={styles.releaseDate}>{props.releaseDate}</p>
          <p className={styles.genres}>{mapGenreIdsToNames()}</p>
        </div>
        <div className={styles.iconContainer}>
          <div className={styles.percentageCircle} style={{ borderColor: percentageColor }}>
            <span style={{ color: percentageColor }}>{percentage}%</span>
          </div>
          <span>Vote count: ({props.voteCount})</span>
          <span>My note: {personalStars} ({personalNote})</span>
          <span>Watch count: <FontAwesomeIcon icon={faVideo} onClick={() => handleWatchMovie('add')} style={videoIconStyle} />
            ({watchCount})
            <FontAwesomeIcon icon={faCircleDown} onClick={() => handleWatchMovie('sub')} style={{ 'cursor': 'pointer', 'color': '780000' }} /> (-1)
          </span>
          <span>I love it:
            <FontAwesomeIcon icon={faHeart} onClick={() => handleLikeMovie()} style={heartIconStyle} />
          </span>
        </div>
      </div>
    </div>
  );
}

export default Movie;
