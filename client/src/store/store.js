import { configureStore } from '@reduxjs/toolkit'
import studentReducer from '../store/studentSlice' // Ensure correct path
import teacherReducer from '../store/teacherSlice' // Ensure correct path

export const store = configureStore({
  reducer: {
    student: studentReducer, // Assigning the stuent slice reducer
    teacher: teacherReducer, // Assigning the teacher slice reducer
  },
})

export default store; // Optional: Export store for easy imports
