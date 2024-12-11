import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ScrollView, Alert } from 'react-native';
import axios from 'axios';

const GptTest = () => {
    const [inputText, setInputText] = useState(''); // 输入框内容
    const [outputText, setOutputText] = useState(''); // 输出框内容
    const [loading, setLoading] = useState(false); // 加载状态

    const handleTest = async () => {
        if (!inputText.trim()) {
            Alert.alert('错误', '请输入问题！');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('http://47.242.78.104:6088/i/gpt', {
                uid: 'a81s', // 替换为实际用户 ID
                qus: inputText,
            });
            setOutputText(response.data.data || '无返回内容');
        } catch (error) {
            Alert.alert('错误', error.message || '接口请求失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* 输入框 */}
            <TextInput
                style={styles.input}
                placeholder="请输入测试问题"
                value={inputText}
                onChangeText={setInputText}
                editable={!loading}
            />
            {/* 提交按钮 */}
            <Button title={loading ? '提交中...' : '提交'} onPress={handleTest} disabled={loading} />
            {/* 输出框 */}
            <ScrollView style={styles.outputContainer}>
                <Text style={styles.outputText}>{outputText}</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    outputContainer: {
        flex: 1,
        marginTop: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    outputText: {
        fontSize: 16,
        color: '#333',
    },
});

export default GptTest;
