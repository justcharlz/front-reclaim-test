import { ProviderType } from '@app/providers';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { Claim } from '../links/types';

interface MintedClaimsState {
    creds: Claim[]
}

const initialState: MintedClaimsState = {
    creds: []
};

const mintedClaimsSlice = createSlice({
    name: 'mintedCreds',
    initialState,
    reducers: {
        addMintedClaim: (state, action: PayloadAction<Claim>) => ({
            ...state,
            creds: [...state.creds, action.payload], 
        }),
    }
})

export const {addMintedClaim} = mintedClaimsSlice.actions;
export default mintedClaimsSlice.reducer;