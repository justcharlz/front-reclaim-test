import {Link} from '../links/types';


export enum NotificationType {
  NEWVRQ = 'new verification request',
  STATUS = 'status',
}

export interface verificationRequest{
  linkId: string;
  requestorId: string;
}
export interface Notification {
  id: string;
  title: string | undefined;
  body: string | undefined;
  type: NotificationType;
  data?: verificationRequest;
}
