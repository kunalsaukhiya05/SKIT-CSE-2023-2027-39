import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  teacher: null
}

export const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    setTeacherDetails: (state, action) => {
      state.teacher = action.payload; // Correct and clean
    }
  }
})

// Exporting actions and reducer
export const { setTeacherDetails } = teacherSlice.actions
export default teacherSlice.reducer
