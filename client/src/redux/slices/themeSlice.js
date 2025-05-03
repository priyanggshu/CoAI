import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        
        // user preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
    }
    return 'light';
};

const initialState = {
    theme: getInitialTheme(),
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            // when theme changes
            if (typeof window !== 'undefined') {
                localStorage.setItem('theme', state.theme);
            }
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('theme', state.theme);
            }
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

// Selector
export const selectTheme = (state) => state.theme.theme;

export default themeSlice.reducer;