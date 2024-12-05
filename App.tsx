import 'react-native-gesture-handler'; // 确保在其他任何导入之前导入这个

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import Opening from './SourceCode/Opening/Opening';
import Login from './SourceCode/Login/Login';
import CreateChildren from './SourceCode/Createchildren/index.jsx';  // 引入 CreateChildren 组件
import useStore from './SourceCode/store/store'; // 引入 zustand store

const Stack = createNativeStackNavigator();

const App = () => {
    const { user } = useStore(); // 从zustand获取user状态

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={user?.username ? "Login" : "Opening"} screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Opening" component={Opening} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="CreateChildren" component={CreateChildren} />      
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
