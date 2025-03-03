import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_DIR = `${RNFetchBlob.fs.dirs.CacheDir}/reinforcement_images/`;

// 初始化创建目录
const initCacheDir = async () => {
    const exists = await RNFetchBlob.fs.isDir(CACHE_DIR);
    if (!exists) {
        await RNFetchBlob.fs.mkdir(CACHE_DIR);
    }
};

// 清理文件名的函数
const sanitizeFilename = (filename) => {
    return filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
};

// SHA256哈希生成文件名
const generateFilename = (url) => {
    const filename = url.split('/').pop().split('?')[0];
    const sanitizedFilename = sanitizeFilename(filename); // 清理文件名

    // 确保文件名带有正确的扩展名
    if (!sanitizedFilename.endsWith('.png')) {
        return `${sanitizedFilename}.png`; // 这里假设下载的是PNG文件
    }
    return sanitizedFilename;
};

export const cacheImage = async (url) => {
    try {
        await initCacheDir();

        const filename = generateFilename(url);
        const localPath = `${CACHE_DIR}${filename}`;

        // Step1: Check memory cache first
        const cachedUri = await AsyncStorage.getItem(url);

        if (cachedUri && (await RNFetchBlob.fs.exists(cachedUri))) {
            return cachedUri;
        }

        // Step2: Download and save to filesystem
        const response = await RNFetchBlob.config({
            fileCache: true,
            path: localPath, // 直接指定存储路径
        }).fetch('GET', url);

        // 检查下载的文件是否有效
        const fileExists = await RNFetchBlob.fs.exists(localPath);
        if (!fileExists) {
            throw new Error('File not downloaded correctly.');
        }

        // Update storage record
        await AsyncStorage.setItem(url, localPath);
        console.log('Cached image path:', localPath);
        return localPath;

    } catch (error) {
        console.error('Caching failed:', error);
        return url; // Fallback to original URL
    }
};