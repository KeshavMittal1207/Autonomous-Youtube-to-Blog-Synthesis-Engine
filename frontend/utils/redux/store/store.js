import { configureStore } from '@reduxjs/toolkit'
import selectedOptionReducer from "../slice/selectedOptionSlice.js";
import signInButtonReducer from "../slice/signInButtonSlice.js"
import profileDataReducer from "../slice/profileDataSlice.js"
import logOutButtonReducer from "../slice/logOutSlice.js"
export const store = configureStore({
  reducer: {
     selectedOption : selectedOptionReducer,
     signInButton : signInButtonReducer,
     profileData : profileDataReducer,
     logOutButton : logOutButtonReducer 
  }
})