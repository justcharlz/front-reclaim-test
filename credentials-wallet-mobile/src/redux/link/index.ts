// import {Link, Claim} from '../links/types';
import { Link } from '@questbook/reclaim-client-sdk';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface LinkState {
  link: Link;
}

const initialState: LinkState = {
  link: {
    id: '',
    claims: [],
    createdAtS: 0,
    name: '',
    userId: '',
    views: 0,
  }
};

const linksSlice = createSlice({
  name: 'link',
  initialState,
  reducers: {
    setLinkDetails: (state, action: PayloadAction<Link>) => ({
      ...state,
      link: action.payload,
    }),
  }
});

export const {setLinkDetails} = linksSlice.actions;
export default linksSlice.reducer;
