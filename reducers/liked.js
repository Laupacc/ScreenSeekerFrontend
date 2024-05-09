import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: [],
};

export const likedSlice = createSlice({
    name: 'liked',
    initialState,
    reducers: {
        addLikedMovie: (state, action) => {
            state.value.push(action.payload);
        },
        removeLikedMovie: (state, action) => {
            state.value = state.value.filter(movie => movie.title !== action.payload.title);
        },
        removeAllLikedMovies: (state) => {
            state.value = [];
        },
    },
});

export const { addLikedMovie, removeLikedMovie, removeAllLikedMovies } = likedSlice.actions;
export default likedSlice.reducer;
