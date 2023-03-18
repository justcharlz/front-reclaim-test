import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface GithubState {
  accessToken: string | null;
  userName: string | null;
}

const initialState: GithubState = {
  accessToken: null,
  userName: null,
};

const githubSlice = createSlice({
  name: 'github',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => ({
      ...state,
      accessToken: action.payload,
    }),
    setUserName: (state, action: PayloadAction<string>) => ({
      ...state,
      userName: action.payload,
    }),
  },
});

export const {setAccessToken} = githubSlice.actions;
export const {setUserName} = githubSlice.actions;
export default githubSlice.reducer;
