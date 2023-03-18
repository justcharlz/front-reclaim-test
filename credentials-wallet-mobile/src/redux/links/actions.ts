import { AppThunk } from "@app/redux/config";

import { fetchGoogleInfo } from "@app/redux/google/actions";
import { getGoogleInfo, isGoogleInfoLoaded, isGoogleTokenExpired } from "@app/redux/google/selectors";
import { addLink, setTempLink, updateClaim, updateLink } from "@app/redux/links";
import { ClaimStatus, Link } from "@app/redux/links/types";
import { TemplateClaim } from "@app/redux/templates/types";
import { getUserPrivateKey, getUserPublicKey } from "@app/redux/userWallet/selectors";
import { Claim } from "@app/redux/links/types";
import {getClient, getNewClientInstance } from "@app/lib/client";
import { generateWallet, getWalletFromPrivateKey } from "@app/lib/utils/crypto";
import { createClaim } from "@questbook/reclaim-node";
import { createChannel, createClient } from "nice-grpc-web";
import { CommonTransport } from "@questbook/common-grpc-web-transport";
import { Socket } from "net";
import { TLSSocket } from "tls";
import { ReclaimWitnessDefinition } from "@questbook/reclaim-node/lib/proto/api";
import { createRedactedString } from "@app/lib/utils/helpers";
import uuid from 'react-native-uuid';
import { getTempLink } from "@app/redux/links/selectors";
import { typedCreateAsyncThunk } from "@app/redux/extraConfig";

export const submitTempLink = typedCreateAsyncThunk<
    void,
    { }
>(
    'links/submitTempLinkStatus',
    async ({ }, { dispatch, getState }) => {
        const tempLink = getTempLink(getState());
        const privateKey = getUserPrivateKey(getState());

        const claimsListOutput = tempLink.claims.map(claim => {
            return {
              id: claim.id,
              chainId: 5,
              provider: claim.provider as string,
              redactedParameters: claim.redactedParameters,
              ownerPublicKey: Buffer.from(claim.ownerPublicKey, 'hex'),
              timestampS: claim.timestampS,
              witnessAddresses: claim.witnessAddresses,
            };
        });

        const client = getClient(privateKey);

        const response = await client.createLink({
            name: tempLink.name,
            claims: claimsListOutput
        });

        const claimsListInput = tempLink.claims.map(claim => {
            return {
                ...claim,
                ownerpublickey: Buffer.from(claim.ownerPublicKey).toString('hex'),
            }
        });

        const link = {
            ...tempLink,
            createdAtS: Math.floor(Date.now() / 1000),
            id: response.id,
            claims: claimsListInput,
        };

        dispatch(addLink(link));
    }
)

export const addTemplateClaim = typedCreateAsyncThunk<
    void, 
    { claim: TemplateClaim, link: Link } 
>(
    'links/addClaimStatus',
    async ({ claim, link }, { dispatch, getState }) => {
        const publicKey = getUserPublicKey(getState());
        const privateKey = getUserPrivateKey(getState());
        console.log(claim, link);
        if(claim.provider === 'google-login'){        
            const googleInfoLoaded = isGoogleInfoLoaded(getState());
            const googleTokenExpired = isGoogleTokenExpired(getState());

            if(!googleInfoLoaded || googleTokenExpired) await dispatch(fetchGoogleInfo());
            
            const { email, accessToken } = getGoogleInfo(getState());
            if(!email || !accessToken) throw('Google info not found');
    
            const googleClaim: Claim = {
                internalId: claim.id,
                id: 0,
                chainId: 5,
                title: 'untitled',
                provider: claim.provider,
                params: {
                    emailAddress: email,
                },
                status: ClaimStatus.PENDING,
                ownerPublicKey: publicKey,
                timestampS: Math.floor(Date.now() / 1000),
                redactedParameters: '',
                witnessAddresses: []
            };

            const updatedLink = {
                ...link,
                claims: [
                    ...link.claims,
                    googleClaim
                ]
            };
    
            dispatch(updateLink(updatedLink));

            // TODO: start minting 
            const client = getClient(privateKey);
            const requestor = await client.getServiceMetadata();
            
            const ephemeralPrivateKey = (await generateWallet()).privateKey;
            const ephemeralWallet = getWalletFromPrivateKey(ephemeralPrivateKey);
            const ephemeralWalletClient = getNewClientInstance(ephemeralWallet.privateKey);

            const response = await createClaim({
                name: 'google-login',
                params: { emailAddress: email },
                secretParams: { token: accessToken! },
                makeGrpcClient: grpcUrl => {
                    const channel = createChannel(
                      grpcUrl,
                      CommonTransport({
                        makeSocket: () => new Socket(),
                        makeTLSSocket: socket => new TLSSocket(socket),
                      }),
                    );
                    const client = createClient(ReclaimWitnessDefinition, channel);
                    return client;
                  },
                  requestCreate: async infoHash => {
                    const result = await ephemeralWalletClient.startClaimCreation(
                      ephemeralWallet,
                      requestor.walletAddress,
                      infoHash,
                    );
                    return result;
                  },
            })

            if(response){
                const claimData = response.claimData
                const paramObj = JSON.parse(claimData.parameters)
                const paramKey = Object.keys(paramObj)[0]
                const claim: Claim = {
                    ...googleClaim,
                    id: claimData.claimId,
                    signatures: response.signatures,
                    timestampS: claimData.timestampS,
                    witnessAddresses: response.witnessHosts,
                    ownerPublicKey: publicKey,
                    status: ClaimStatus.MINTED,
                    redactedParameters: createRedactedString(paramObj[paramKey])   
                }

                dispatch(updateClaim({link: updatedLink, claim: claim }));
            }      
        }
    }
);

export const createNewLink = (publicKey: string): AppThunk => dispatch => {
    const link: Link = {
        id: uuid.v4().toString(),
        name: '',
        claims: [],
        userId: publicKey,
        createdAtS: Math.floor(Date.now() / 1000),
        views: 0,
      };
      dispatch(setTempLink(link));
}