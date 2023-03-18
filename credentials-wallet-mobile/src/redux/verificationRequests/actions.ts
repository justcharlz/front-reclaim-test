import { typedCreateAsyncThunk } from "@app/redux/extraConfig";
import { getUserPrivateKey } from "../userWallet/selectors";
import getClient from "@app/lib/client";
import { VerificationReqObject } from "@questbook/reclaim-client-sdk";
import { Claim } from "../links/types";
import { useReduxSelector } from "@app/redux/config";
import { getLocalClaimById } from "../mintedClaims/selectors";
import { getEphemeralPrivateKey } from "../userWallet/selectors";
import { ClaimProofInterface } from "@questbook/reclaim-client-sdk";

export const getVerificationRequestDetails = typedCreateAsyncThunk<
VerificationReqObject,
{ verificationReqId: string }
>(
'verificationRequests/getVerificationRequestDetails',
async ({ verificationReqId }, { getState }) => {
    const state = getState();
    const privateKey = getUserPrivateKey(state);
    const client = getClient(privateKey);
    const verificationRequest = await client.getVerificationReq(
        verificationReqId,
        1,
        10,
    );
    return verificationRequest.requestsList[0];
});

export const rejectVerificationRequest = typedCreateAsyncThunk<
boolean,
{ verificationReqId: string }
>(
'verificationRequests/rejectVerificationRequest',
async ({ verificationReqId }, { getState }) => {
    const state = getState();
    const privateKey = getUserPrivateKey(state);
    const client = getClient(privateKey, true);
    try{
        await client.rejectVerificationRequest(verificationReqId);
        return true;
    } catch (e) {
        console.log(e);
        return false;
      }
});

export const acceptVerificationRequest = typedCreateAsyncThunk<
boolean,
{ verificationReqId: string, claims: Claim[], communicationPublicKey: string }
>(
'verificationRequests/acceptVerificationRequest',
async ({ verificationReqId, claims, communicationPublicKey }, { getState }) => {
    const state = getState();
    const ephemeralPrivateKey = getEphemeralPrivateKey(state);
    const privateKey = getUserPrivateKey(state);
    const client = getClient(privateKey, true);

    const data: [ClaimProofInterface] = claims.map(claim =>{
        const claimDetails = getLocalClaimById(claim.id)(state);

        if(claimDetails === undefined) throw('Claim is not available locally');
        if(claimDetails.signatures === undefined) throw("Signatures aren't available");
        if(claimDetails.params === undefined) throw("params aren't available");
        
        return({
            id: claimDetails.id,
            parameters: claimDetails.params,
            signaturesList: claimDetails.signatures,
        });
    });

    try{
        await client.acceptVerificationRequest(
            verificationReqId,
            communicationPublicKey,
            ephemeralPrivateKey,
            data,
            );
        return true;
    } catch (e) {
        console.log(e);
        return false;
      }
});