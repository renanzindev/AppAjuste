import { Alert, NativeModules, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'react-native-blob-util';


async function getToken() {
  let token = await AsyncStorage.getItem('@smartApp:token');
  if (token) {
    token = `Bearer ${token}`;
  }
  return token;
}

export default async function DownloadFile(type, url, fileName, fileMime) {
  const RootDir = await RNFetchBlob.fs.dirs.PictureDir;
  const token = await getToken();

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    RNFetchBlob.config({
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
}
