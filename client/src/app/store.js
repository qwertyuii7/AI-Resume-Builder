// redux/store.js
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/authSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer, // ✅ changed from authReducer → auth
    },
})
