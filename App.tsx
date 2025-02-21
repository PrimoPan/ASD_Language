import 'react-native-gesture-handler'; // 确保在其他任何导入之前导入这个
import { LogBox } from 'react-native';

// 忽略所有警告
LogBox.ignoreAllLogs(); // 关闭所有警告

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import Opening from './SourceCode/Opening/Opening';
import Login from './SourceCode/Login/Login';
import CreateChildren from './SourceCode/Createchildren/index.jsx';  // 引入 CreateChildren 组件
import DisplayStoreData from "./SourceCode/DisplayStoreData";
import GptTest from "./SourceCode/Components/GptTest";
import ImageGenerator from "./SourceCode/Components/ImageGenerator"
import LearningMode from "./SourceCode/LearningMode/LearningMode";
import EnvironmentChoose from "./SourceCode/EnvironmentChoose";
import GptLearning from "./SourceCode/GptLearning";
import useStore from './SourceCode/store/store'; // 引入 zustand store
import ChildProfileScreen from "./components/childProfile/ChildProfileScreen.jsx";
import LearningThemeScreen from "./components/LearningTheme/LearningThemeScreen.jsx";
import HorizontalLayout from "./SourceCode/HorizontalLayout";
const Stack = createNativeStackNavigator();

const App = () => {
    const { user } = useStore(); // 从zustand获取user状态

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={user?.username ? "Login" : "Opening"} screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Opening" component={Opening} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="ChildProfileScreen" component={ChildProfileScreen}/>
                <Stack.Screen name="CreateChildren" component={CreateChildren} />
                <Stack.Screen name="GptTest" component={GptTest}/>
                <Stack.Screen name="ImageGenerator" component={ImageGenerator}/>
                <Stack.Screen name='LearningMode' component={LearningMode}/>
                <Stack.Screen name='EnvironmentChoose' component={EnvironmentChoose}/>
                <Stack.Screen name='GptLearning' component={GptLearning}/>
                <Stack.Screen name='DisplayStoreData' component={DisplayStoreData}/>
                <Stack.Screen name='HorizontalLayout' component={HorizontalLayout}/>
                <Stack.Screen name='LearningThemeScreen' component={LearningThemeScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
