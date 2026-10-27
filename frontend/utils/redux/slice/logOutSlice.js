import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0
}

const logOutButtonSlice = createSlice({
  name: 'logOutButton',
  initialState,
  reducers: {
    setLogOutButton : (state) => {
        state.value == 1 ? state.value = 0 : state.value = 1;
    }
  }
})

export const { setLogOutButton } = logOutButtonSlice.actions

export default logOutButtonSlice.reducer