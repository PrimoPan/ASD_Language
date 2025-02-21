import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { generateImage, gptQuery } from '../utils/api';
const environmentData = require('../Knowledge/Environment.json');

const ThemeScene = ({ selectedMajor, onSelectScene }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [customDescription, setCustomDescription] = useState('');
    const [selectedScene, setSelectedScene] = useState(null);
    const [loading, setLoading] = useState(false);
    const [availableScenes, setAvailableScenes] = useState([]); // 合并后的场景列表

    // 解析GPT返回的场景数组
    const parseGeneratedScenes = (response) => {
        try {
            const match = response.match(/\[.*?\]/);
            if (!match) throw new Error('Invalid response format');
            return JSON.parse(match[0].replace(/'/g, '"'));
        } catch (e) {
            throw new Error('Failed to parse scenes');
        }
    };

    // 加载场景数据
    const loadScenes = async () => {
        setLoading(true);
        try {
            // 先检查静态数据
            let scenes = environmentData[selectedMajor] || [];

            // 如果没有静态数据则生成
            if (scenes.length === 0) {
                const prompt = `作为自闭症教学专家，请生成三个与${selectedMajor}相关的教学场景，返回格式如['场景1','场景2','场景3']：`;
                const gptResponse = await gptQuery(prompt);
                const dynamicScenes = parseGeneratedScenes(gptResponse);
                scenes = dynamicScenes;
            }

            setAvailableScenes(scenes);
        } catch (error) {
            Alert.alert("错误", error.message);
        } finally {
            setLoading(false);
        }
    };

    // 当专业变化时重新加载场景
    useEffect(() => {
        if (selectedMajor) {
            loadScenes();
        }
    }, [selectedMajor]);

    // 处理场景选择
    const handleSelectScene = async (scene) => {
        try {
            setSelectedScene(scene);
            const description = `自闭症教学背景图，主题：${selectedMajor}，场景：${scene}，简洁风格，留白区域`;
            const image = await generateImage(description);
            setImageUrl(image);
            onSelectScene(scene, image); // 触发父组件回调
        } catch (error) {
            Alert.alert("错误", error.message);
        } finally {
            setLoading(false);
        }
    };
    const handleRegenerateImage = async () => {
        if (!customDescription.trim()) return;

        try {
            setSelectedScene(customDescription);
            const image = await generateImage(customDescription);
            setImageUrl(image);
            onSelectScene(customDescription, image); // 触发父组件回调
        } catch (error) {
            Alert.alert("错误", error.message);
        } finally {
            setLoading(false);
        }
    };
    // 渲染场景按钮
    const renderSceneButtons = () => {
        if (loading) {
            return <ActivityIndicator size="small" color="#39B8FF" />;
        }

        return availableScenes.map((scene) => (
            <TouchableOpacity
                key={scene}
                style={[
                    styles.button,
                    selectedScene === scene && styles.selectedButton,
                ]}
                onPress={() => handleSelectScene(scene)}
            >
                <Text style={styles.buttonText}>{`场景：${scene}`}</Text>
            </TouchableOpacity>
        ));
    };
    useEffect(() => {
        setSelectedScene(null);
        setImageUrl(null);
    }, [selectedMajor]);
    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <Text style={styles.title}>选择场景</Text>
                {renderSceneButtons()}

                {/* 自定义输入部分 */}
                <TextInput
                    style={styles.inputBox}
                    placeholder="输入自定义场景描述"
                    value={customDescription}
                    onChangeText={setCustomDescription}
                />
                <Button
                    title="重新生成图片"
                    onPress={handleRegenerateImage}
                    disabled={!customDescription.trim()}
                />
            </View>

            <View style={styles.rightContainer}>
                <Text style={styles.selectedModuleText}>当前模块: {selectedMajor}</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#39B8FF" /> // 显示 loading 场景
                ) : imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                ) : (
                    <Text style={styles.noImageText}>请选择一个场景</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        padding: 20,
    },
    leftContainer: {
        width: '45%',
        padding: 20,
        justifyContent: 'space-evenly',
    },
    rightContainer: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#D4E9FF',
        left: '17%',
        width: 400,
        padding: 10,
        marginBottom: 15,
        borderRadius: 15,
        alignItems: 'center',
    },
    selectedButton: {
        backgroundColor: '#39B8FF', // High light color for selected button
    },
    buttonText: {
        fontSize: 16,
        color: '#1C5B83',
    },
    inputBox: {
        left: '17%',
        height: 40,
        width: 400,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    selectedModuleText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    image: {
        width: 400, // Image size increased
        height: 300,
        borderRadius: 10,
    },
    noImageText: {
        fontSize: 16,
        color: '#888',
    }
});

export default ThemeScene;
