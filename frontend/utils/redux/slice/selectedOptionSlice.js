import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {
    payload:1
  }
}

const selectedOptionSlice = createSlice({
  name: 'selectedOption',
  initialState,
  reducers: {
    setSelectedOption : (state,val) => {
        state.value = val;
    }
  }
})

export const { setSelectedOption } = selectedOptionSlice.actions

export default selectedOptionSlice.reducer