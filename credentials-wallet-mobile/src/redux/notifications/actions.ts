import { truncVerifier } from "@app/lib/utils/helpers";
import { addNotification } from "@app/redux/notifications";
import { NotificationType } from "./types";
import { typedCreateAsyncThunk } from "@app/redux/extraConfig";

export const addNotificationAction = typedCreateAsyncThunk<
void, 
{ id: string, linkId?: string, requestorId?: string, title: string | undefined, body: string | undefined } 
>(
'notifications/addnewNotification',
async ({ id, linkId, requestorId, title, body }, { dispatch, getState} ) => {
    if(linkId && requestorId){
        const data = {
            linkId: linkId,
            requestorId: requestorId
        }
        const notification = {
            id: id,
            title: title,
            body: `${truncVerifier(requestorId)} requested you to verify ${linkId}`,
            type: NotificationType.NEWVRQ,
            data: data,
        }
        dispatch(addNotification(notification))
    } else{
        const notification = {
            id: id,
            title: title,
            body: body,
            type: NotificationType.STATUS,
        };
        dispatch(addNotification(notification))
    }
}
);