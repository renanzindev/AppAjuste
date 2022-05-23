import RNFetchBlob from 'rn-fetch-blob';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const { config, fs } = RNFetchBlob;

async function getToken() {
  let token = await AsyncStorage.getItem('@smartApp:token');
  if (token) {
    token = `Bearer ${token}`;
  }
  return token;
}

export default async function DownloadFile(type, url, fileName, fileMime) {
  const RootDir = await fs.dirs.PictureDir;
  const token = await getToken();
  config({
    fileCache: true,
    addAndroidDownloads: {
      path: `${RootDir}/${fileName}`,
      description: 'downloading file...',
      notification: true,
      useDownloadManager: true,
      mime: fileMime,
      mediaScannable: true,
    },
  })
    .fetch(type, url, {
      'Cache-Control': 'no-store',
      Authorization: token,
    })
    .then(() => {
      Alert.alert('Sucesso', 'Download Realizado Com Sucesso.');
    })
    .catch(() => {
      Alert.alert('Erro', 'Houve Um Erro, Tente Mais Tarde.');
    });
}
