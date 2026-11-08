import { pathToFileURL } from 'node:url';

export async function fetchFigma({ token, fileKey, nodeIds, request = fetch }) {
  if (!token) throw new Error('Set FIGMA_ACCESS_TOKEN.');
  if (!/^[a-zA-Z0-9]+$/.test(fileKey || '')) throw new Error('Provide a valid Figma file key.');
  const url = new URL(`https://api.figma.com/v1/${nodeIds ? 'images' : 'files'}/${fileKey}`);
  if (nodeIds) {
    if (!/^[0-9:,-]+$/.test(nodeIds)) throw new Error('Provide comma-separated Figma node IDs.');
    url.searchParams.set('ids', nodeIds);
    url.searchParams.set('format', 'png');
  }
  const response = await request(url, { headers: { 'X-Figma-Token': token } });
  if (!response.ok) throw new Error(`Figma request failed (HTTP ${response.status}). Check the file key, token and permissions.`);
  return response.json();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = await fetchFigma({ token: process.env.FIGMA_ACCESS_TOKEN, fileKey: process.argv[2], nodeIds: process.argv[3] });
    console.log(JSON.stringify(result, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
