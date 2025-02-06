import axios from 'axios';

// 配置 API 基础 URL
const BASE_URL = 'http://47.242.78.104:6088';

/**
 * GPT 问答接口
 * @param {string} question - 用户的问题
 * @returns {Promise<string>} - 返回 GPT 的回答
 */
export const gptQuery = async (question) => {
    if (!question.trim()) {
        throw new Error('问题不能为空');
    }

    try {
        const response = await axios.post(
            `${BASE_URL}/i/gpt`,
            {
                uid: 'a81s', // 替换为后端提供的用户标识
                qus: question,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(question);
        const { data } = response.data;
        if (!data) {
            throw new Error('接口未返回回答');
        }
        return data; // 返回 GPT 的回答
    } catch (error) {
        throw new Error(error.response?.data?.message || '请求 GPT 失败');
    }
};

/**
 * 图像生成接口
 * @param {string} description - 图片描述
 * @returns {Promise<string>} - 返回生成的图片 URL
 */
export const generateImage = async (description) => {
    if (!description.trim()) {
        throw new Error('图片描述不能为空');
    }

    try {
        const response = await axios.post(
            `${BASE_URL}/i/pic`,
            {
                uid: 'a81s', // 替换为后端提供的用户标识
                picreq: description,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('生图prompt:',description);
        const { data } = response.data;
        console.log(response.data);
        if (!data) {
            throw new Error('接口未返回图片 URL');
        }
        return data; // 返回图片 URL
    } catch (error) {
        throw new Error(error.response?.data?.message || '生成图片失败');
    }
};
