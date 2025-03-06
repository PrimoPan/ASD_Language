import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import useStore from '../store/store';
import { loginTeacher } from '../services/api';  // 引入 API 请求

const Login = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // ✅ 获取 Zustand 方法
    const { setUsernameAsync, setToken } = useStore();

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('提示', '请输入用户名和密码');
            return;
        }

        try {
            const { token } = await loginTeacher(username, password);  // 调用 API 登录
            await setUsernameAsync(username);  // 存储用户名
            setToken(token);  // ✅ 存储 JWT 令牌
            console.log(token);
            Alert.alert('登录成功');
            navigation.replace('ChildrenList');  // 进入下个页面
        } catch (error) {
            Alert.alert('登录失败', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>教师登录</Text>
            <TextInput
                style={styles.input}
                placeholder="用户名"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="密码"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="登录" onPress={handleLogin} />
        </View>
    );
};



const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#E0F7FA' },
  title: { fontSize: 24, marginBottom: 20 },
  input: { width: '33%', padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 4 },
  orText: { marginVertical: 10, fontSize: 16 },
});

export default Login;
