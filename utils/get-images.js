import * as FileSystem from 'expo-file-system';

export const  getImageByUrl = async (uri, name) => {
    const fileData = await FileSystem.getInfoAsync(FileSystem.cacheDirectory + name);
    if (fileData.exists) {
        return fileData.uri;
    }
    try {
        return await FileSystem.downloadAsync(uri, FileSystem.cacheDirectory + name);
    } catch (e) {
        console.log(e);
    }
}
