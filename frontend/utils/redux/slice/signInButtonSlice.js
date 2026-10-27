import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0
}

const signInButtonSlice = createSlice({
  name: 'signInButton',
  initialState,
  reducers: {
    setSignInButton : (state) => {
        state.value == 1 ? state.value = 0 : state.value = 1;
    }
  }
})

export const { setSignInButton } = signInButtonSlice.actions

export default signInButtonSlice.reducer