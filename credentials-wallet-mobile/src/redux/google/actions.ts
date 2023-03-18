import {googleLogin} from '@app/lib/utils/googleAuth';
import {setGoogleInfo} from '@app/redux/google';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchGoogleInfo = createAsyncThunk(
  'google/fetchGoogleInfoStatus',
  async (arg , thunkAPI) => {
    const googleInfo = await googleLogin();
    if(!googleInfo) return;
    
    const { email, accessToken } = googleInfo;
    if(!email) return;

    thunkAPI.dispatch(setGoogleInfo({email, accessToken}));
  }
);