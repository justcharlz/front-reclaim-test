import {getClient} from "@app/lib/client";
import { AppThunk, useReduxSelector } from "../config";
import { getUserPrivateKey } from "../userWallet/selectors";
import {setLinkDetails} from '@app/redux/link'
import React from "react";

export const fetchLinkDetails = (linkId: string, setLink: React.Dispatch<any>, userPrivateKey: string): AppThunk => async dispatch => {
    const client = await getClient(userPrivateKey, true);
    const response = await client.getLinks({id: linkId, view: true})
    // dispatch(setLinkDetails(response.links[0]))
    setLink(response.links[0])
}