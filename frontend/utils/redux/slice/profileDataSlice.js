import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {
    payload:{
       email:"",
       password:"",
       name:"",
       profilePic:"",
       history:[]
    }
  }
}

const profileDataSlice = createSlice({
  name: 'profileData',
  initialState,
  reducers: {
    setProfileData : (state,val) => {
        state.value = val;
    }
  }
})

export const { setProfileData } = profileDataSlice.actions

export default profileDataSlice.reducer