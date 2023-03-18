import { ProviderType } from '@app/providers';
import { Template } from '@app/redux/templates/types';
import {
  Link as BaseLink,
  LinkClaim as BaseClaim
} from '@questbook/reclaim-client-sdk';

export enum ClaimStatus {
  UNCLAIMED = 'unclaimed',
  PENDING = 'pending',
  MINTED = 'minted',
}

export interface Claim extends Omit<BaseClaim, 'ownerPublicKey' | 'provider'> {
  internalId: number;
  title: string;
  params?: {
    [key: string]: string;
  };
  status: ClaimStatus;
  provider: ProviderType;
  ownerPublicKey: string;
  signatures?: string[];
}

export interface Link extends Omit<BaseLink, 'claims'> {
  // id: string;
  // title: string;
  // identity?: string;
  claims: Claim[];
  template?: Template;
  isSubmitted?: boolean;
} 
