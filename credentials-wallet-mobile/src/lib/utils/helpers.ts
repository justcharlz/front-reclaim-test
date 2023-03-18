export function truncVerifier(verifier: string) {
    const first = verifier.substring(0, 4);
    const last = verifier.slice(-4);
    return first + '...' + last;
  }


export async function fetchUserContribution(access_token: string | null) {
  return fetch(`https://api.github.com/user/repos`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}` 
    },
  }).then((res) => res.json());
}

export async function getUserContribution(access_token: string | null){
  const data = await fetchUserContribution(access_token);
  console.log("data is: ", data);
  const userContributions: {name: string, owner: string, avatarURL: string, lastCommit: string}[] = [];
  for(let i=0; i<data.length; i++){
    let lastCommit = data[i].updated_at.substring(0, data[i].updated_at.indexOf("T"));
    const name = data[i].full_name.substring(data[i].full_name.indexOf("/") + 1);
    const contribution = {name: name, owner: data[i].owner.login, avatarURL: data[i].owner.avatar_url, lastCommit: lastCommit};
    userContributions.push(contribution);
  }
  console.log("Contributions are: ", userContributions);
  return userContributions; 
}

export function createRedactedString(parameter: string) {
    const email = parameter.split('@')
    const domain = email[1]

    const redacted = new Array(email[0].length).fill('*')

    return redacted.join('') + '@' + domain
  
}