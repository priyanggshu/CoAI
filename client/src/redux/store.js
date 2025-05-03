import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import roomReducer from "./slices/roomSlice";
import themeReducer from "./slices/themeSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        room: roomReducer,
        theme: themeReducer
    },
});

