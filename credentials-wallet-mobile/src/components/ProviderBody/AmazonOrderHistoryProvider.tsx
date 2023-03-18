import { ProviderBodyProps } from "@app/providers";
import { createChannel, createClient } from 'nice-grpc-web'
import { CommonTransport } from '@questbook/common-grpc-web-transport'
import { mockMintCredential } from '@questbook/reclaim-node'
import LOGGER from '@questbook/reclaim-node/lib/utils/logger'
import { useState } from 'react'
import WebView from "react-native-webview";
import CookieManager from '@react-native-cookies/cookies'
import { TextInput } from "react-native";
import theme from "@app/lib/styles/theme";
import { FlexColumn, H3 } from "@app/lib/styles/common";
import { CtaButton } from "../CtaButton";
import { ReclaimWitnessDefinition } from "@questbook/reclaim-node/lib/proto/api";
import { Socket } from "net";
import { TLSSocket } from "tls";

type State = 'entering-q' | 'waiting-for-cookies' | 'checking-claim' | 'claimed'

const AMAZON_URL = 'https://www.amazon.in'
const AMAZON_ORDER_URL = 'https://www.amazon.in/gp/your-account/order-history/ref=ppx_yo_dt_b_search?opt=ab&search={{q}}'

const LOGGED_IN_TXT = 'logged-in'

/// this script polls for when the login is complete
/// and the orders are fetched
const injection = `
	const cookieCheckInterval = setInterval(
		() => {
			if(document.querySelector('#ordersContainer')) {
				console.log('got it')
				window.ReactNativeWebView.postMessage('${LOGGED_IN_TXT}')
				clearInterval(cookieCheckInterval)
			}
		}, 1000
	)
    true; // note: this is required, or you'll sometimes get silent failures`

export default function AmazonOrderHistoryProvider(
	{  }: ProviderBodyProps
) {
	const [q, setQ] = useState('')
	const [state, setState] = useState<State>('entering-q')
	const uri = AMAZON_ORDER_URL.replace('{{q}}', q)

	const onEnteredQ = () => {
		setState('waiting-for-cookies')
		console.log('entered q for amazon: ', q)
	}

	const onCookiesExtracted = async(cookieStr: string) => {
		console.log('cookies extracted: ', cookieStr)
		setState('checking-claim')

		const channel = createChannel(
			'https://reclaim-node.questbook.app',
			CommonTransport({
				makeSocket: () => new Socket(),
				makeTLSSocket: (socket) => new TLSSocket(socket)
			})
		)
		const client = createClient(
			ReclaimWitnessDefinition,
			channel,
		)
		const logger = LOGGER
		logger.level = 'trace'

		logger.info('started')

		await mockMintCredential({
			name: 'amazon-order-history',
			params: {
				productName: q,
			},
			secretParams: {
				qstring: q,
				cookieStr,
			},
			client,
			logger
		})

		console.log('done minted')

		setState('claimed')
	}

	return (
		<>
			{
				state === 'entering-q'
					? TakeQueryView()
					: (
						state === 'waiting-for-cookies'
							? ExtractCookiesView()
							: (
								state === 'checking-claim'
								? <H3>Checking claim...</H3>
								: <H3>Claimed!</H3>
							)
					)
			}	
		</>
	)

	function TakeQueryView() {
		return (
			<FlexColumn>
				<H3>
					Name the product you want to prove you bought
				</H3>
				<TextInput
					placeholder="Muesli..."
					placeholderTextColor={theme.palette.placeholderTextColor}
					value={q}
					style={{ fontSize: 20 }}
					onChange={e => setQ(e.nativeEvent.text)}
				/>
				
				<CtaButton
					onPress={onEnteredQ}
					isDisabled={!q}
					backgroundColor={theme.palette.common.lightGray}
					text={'Create Claim'}
					textColor={theme.palette.common.black}
				/>
			</FlexColumn>
		)
	}

	function ExtractCookiesView() {
		return (
			<>
				<WebView
					source={{ uri }}
					injectedJavaScript={injection}
					thirdPartyCookiesEnabled={true}
					onMessage={async data => {
						if(data.nativeEvent.data === LOGGED_IN_TXT) {
							console.log('logged in, fetching cookies...')
	
							try {
								const res = await CookieManager.get(AMAZON_URL)
								const cookieStr = Object.values(res).map(c => `${c.name}=${c.value}`).join('; ')
								onCookiesExtracted(cookieStr)
							} catch(error) {
								console.log('error getting cookies: ', error)
							}
						}
					}}
				/>
			</>
		)
	}
}