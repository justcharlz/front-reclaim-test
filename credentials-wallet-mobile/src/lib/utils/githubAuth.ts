import { CLIENT_ID, CLIENT_SECRET } from '@env';

export default async function getAccessToken(code: string) {
    console.log('client id', CLIENT_ID)
    return fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code
        })
    }).then((res) => res.json());
}

export async function getUserName(access_token: string | null) {
    return fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}` 
        },
    }).then((res) => res.json());
}
