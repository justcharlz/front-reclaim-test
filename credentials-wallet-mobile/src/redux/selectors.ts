import { isGoogleInfoLoading } from "@app/redux/google/selectors";
import { isLinksLoading } from "@app/redux/links/selectors";
import { createSelector } from "@reduxjs/toolkit";

export const isAppLoading = createSelector(
    isGoogleInfoLoading,
    isLinksLoading,
    (...args) => {
        return args.some(arg => arg);
    }
)