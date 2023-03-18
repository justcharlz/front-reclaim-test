import { AsyncThunk } from '@reduxjs/toolkit'
import { fetchGoogleInfo } from '@app/redux/google/actions'
import applications from '@questbook/reclaim-node/lib/applications'
import { ImageSourcePropType } from 'react-native/types'

export type ProviderType = keyof typeof applications
	// TODO: remove when implemented in witness
	| 'github-repo'

export type ProviderData = {
	provider: ProviderType
	/** icon to show on the "CreateClaim" screen */
	iconPath: ImageSourcePropType
	/** user friendly name */
	name: string
	/** 
	 * called before navigating to "PossibleClaims" screen
	 * where user actually generates the secrets required to
	 * mint the claim
	 * */
	preClaimTask?: AsyncThunk<void, void, any>
}

export type ProviderBodyProps = {
	provider: ProviderType
	navigate: () => void
	value: string
}

export const PROVIDERS: ProviderData[] = [
	{
		provider: 'google-login',
		iconPath: require('@app/assets/google.png'),
		name: 'Google',
		preClaimTask: fetchGoogleInfo
	},
	{
		provider: 'amazon-order-history',
		iconPath: require('@app/assets/amazon-order-history.png'),
		name: 'Amazon Order History'
	},
	{
		provider: 'github-repo',
		iconPath: require('@app/assets/github.png'),
		name: 'GitHub'
	},
]