import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import useStore from '../store/store'; // 引入 zustand store

const Login = ({ navigation }) => {  // 获取navigation props
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { user, setUsername: setUsernameInStore, setUsernameAsync } = useStore();

  const handleLogin = async () => {
    if (username && password) {
      try {
        await setUsernameAsync(username);  // 异步设置用户名
        alert('登录成功');
        navigation.replace('ImageGenerator');  // 登录成功后跳转到 GptTest 页面
      } catch (error) {
        alert('登录失败，请重试');
      }
    } else {
      alert('请输入用户名和密码');
    }
  };

  const handleRegister = () => {
    if (username && password) {
      alert('注册成功');
    } else {
      alert('请输入用户名和密码');
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
        <Text style={styles.orText}>或</Text>
        <Button title="注册" onPress={handleRegister} />
        {user?.username ? <Text>欢迎, {user.username}!</Text> : null}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E0F7FA', // 修改背景颜色
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '33%',
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  orText: {
    marginVertical: 10,
    fontSize: 16,
  },
});

export default Login;
