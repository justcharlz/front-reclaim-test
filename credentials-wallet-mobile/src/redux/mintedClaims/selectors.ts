import { RootState } from "@app/redux/config";
import { Claim } from "../links/types";

export const getLocalClaims = (state: RootState) => state.mintedClaim.creds;

export const getLocalClaimById = (id: number) => (state: RootState) => {
  return getLocalClaims(state).find(cred => cred.id === id);
}