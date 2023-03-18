import { RootState } from "@app/redux/config";
import { LoadingState } from "@app/redux/types";

export const getGoogleInfo = (state: RootState) => state.google;

export const isGoogleInfoLoaded = (state: RootState) => 
    getGoogleInfo(state).loading === LoadingState.SUCCESS;

export const isGoogleInfoLoading = (state: RootState) => 
    getGoogleInfo(state).loading === LoadingState.PENDING;

export const isGoogleTokenExpired = (state: RootState) => {
    const expiresAt = getGoogleInfo(state).expiresAt;

    return expiresAt && expiresAt < Date.now();
}