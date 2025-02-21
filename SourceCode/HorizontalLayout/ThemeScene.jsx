import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { generateImage } from '../utils/api';
const environmentData = require('../Knowledge/Environment.json');
const ThemeScene = ({ selectedModule,selectedMajor }) => {
    const [imageUrl, setImageUrl] = useState(null); // 存储生成的图片 URL
    const [customDescription, setCustomDescription] = useState(''); // 用户自定义的场景描述
    const [selectedScene, setSelectedScene] = useState(null); // 存储当前选中的场景
    const [loading, setLoading] = useState(false); // 控制 loading 状态
    console.log(selectedMajor);

    // 选择场景按钮的回调
    const handleSelectScene = async (scene) => {
        setSelectedScene(scene); // 更新选中的场景
        setLoading(true); // 设置 loading 为 true
        try {
            const description = `你是一个自闭症教学老师，我现在需要您生成一张背景图。注意作为背景图，它不应该过于复杂，有太多元素，因为之后我们需要儿童在图上添加元素。背景图的发生场景是${selectedMajor}，具体场景是${scene}`;
            const image = await generateImage(description); // 调用生成图片接口
            setImageUrl(image); // 更新图片 URL
        } catch (error) {
            Alert.alert("Error", error.message); // 处理错误并显示提示
        } finally {
            setLoading(false); // 完成后关闭 loading
        }
    };

    // 重新生成图像的回调
    const handleRegenerateImage = async () => {
        setLoading(true); // 设置 loading 为 true
        try {
            const description = customDescription.trim()  // 默认使用收银台描述
            const image = await generateImage(description); // 调用生成图片接口
            setImageUrl(image); // 更新图片 URL
        } catch (error) {
            Alert.alert("Error", error.message); // 处理错误并显示提示
        } finally {
            setLoading(false); // 完成后关闭 loading
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <Text style={styles.title}>选择场景</Text>
                {/* 圆角矩阵包裹左侧按钮 */}
                {environmentData[selectedMajor]?.map((scene) => (
                    <TouchableOpacity
                        key={scene}
                        style={[
                            styles.button,
                            selectedScene === scene && styles.selectedButton, // 高亮选中的按钮
                        ]}
                        onPress={() => handleSelectScene(scene)}
                    >
                        <Text style={styles.buttonText}>{`场景：${scene}`}</Text>
                    </TouchableOpacity>
                ))}
                {/* 用户自定义输入框 */}
                <TextInput
                    style={styles.inputBox}
                    placeholder="输入自定义场景描述"
                    value={customDescription}
                    onChangeText={setCustomDescription}
                />
                <Button title="重新生成图片" onPress={handleRegenerateImage} />
            </View>

            <View style={styles.rightContainer}>
                <Text style={styles.selectedModuleText}>当前模块: {selectedModule}</Text>
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
