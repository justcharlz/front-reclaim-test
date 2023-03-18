import { fetchGoogleInfo } from '@app/redux/google/actions';
import {Link} from '@app/redux/links/types';
import { LoadingState } from '@app/redux/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface GoogleState {
  email: string | undefined;
  accessToken: string | undefined;
  expiresAt: number | undefined;
  loading: LoadingState;
}

const initialState: GoogleState = {
  email: undefined,
  accessToken: undefined,
  expiresAt: undefined,
  loading: LoadingState.IDLE
};

const googleSlice = createSlice({
  name: 'google',
  initialState,
  reducers: {
    setGoogleInfo: (state, action: PayloadAction<Omit<GoogleState, 'loading' | 'expiresAt'>>) => ({
      ...state,
      ...action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGoogleInfo.pending, (state, action) => ({
      ...state,
      loading: LoadingState.PENDING,
    }));
    builder.addCase(fetchGoogleInfo.fulfilled, (state, action) => ({
      ...state,
      loading: LoadingState.SUCCESS,
      expiresAt: Date.now() + 60*60*1000
     }));
    builder.addCase(fetchGoogleInfo.rejected, (state, action) => ({
      ...state,
      loading: LoadingState.FAILURE
    }));
  }
});

export const {setGoogleInfo} = googleSlice.actions;
export default googleSlice.reducer;
