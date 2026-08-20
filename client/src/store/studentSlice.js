import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  student: null
}

export const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudentDetails: (state, action) => {
      state.student = action.payload; // Correct and clean
    }
  }
})

// Exporting actions and reducer
export const { setStudentDetails } = studentSlice.actions
export default studentSlice.reducer
