import AsyncStorage from '@react-native-async-storage/async-storage';

async function getToken() {
  let token = await AsyncStorage.getItem('@smartApp:token');
  if (token) {
    token = `Bearer ${token}`;
  }
  return token;
}

export default async function DownloadFile(type, url, fileName, fileMime) {
  const token = await getToken();

  try {
    const response = await fetch(url, {
      method: type,
      headers: {
        'Cache-Control': 'no-store',
        Authorization: token,
        'Content-Type': fileMime,
      },
    });

    if (!response.ok) throw new Error('Download failed');

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(objectUrl);

    alert('Download realizado com sucesso.');
  } catch {
    alert('Houve um erro, tente mais tarde.');
  }
}
