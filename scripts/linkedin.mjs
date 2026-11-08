import { pathToFileURL } from 'node:url';

export async function fetchLinkedInProfile({ token, request = fetch }) {
  if (!token) throw new Error('Set LINKEDIN_ACCESS_TOKEN.');
  const response = await request('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`LinkedIn request failed (HTTP ${response.status}). Check the token, scopes and app permissions.`);
  return response.json();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = await fetchLinkedInProfile({ token: process.env.LINKEDIN_ACCESS_TOKEN });
    console.log(JSON.stringify(result, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
