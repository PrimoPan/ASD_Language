import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import useStore from "../store/store.jsx";
import LearningTitle from './LearningTitle';
import ButtonGroup from './ButtonGroup';
import {useNavigation} from "@react-navigation/native";
// 获取屏幕宽度和高度
const { width, height } = Dimensions.get('window');
import Pronun from "./Pronun";
import Naming from "./Naming";

const Draft = () => {
    const navigation = useNavigation();
    const [availableModules, setAvailableModules] = useState([]);
    const { name } = useStore(state => state.currentChildren);
    const [selectedTheme, setSelectedTheme] = useState("构音模块");
    const Models=['构音模块','命名模块','语言结构模块','对话模块'];
    const { learningGoals, setLearningGoals } = useStore();
    const [currentStep, setCurrentStep] = useState(0);
    useEffect(() => {
        const missingModules = [];
        if (!learningGoals?.构音) missingModules.push(2,6);
        if (!learningGoals?.命名) missingModules.push(3);
        if (!learningGoals?.语言结构) missingModules.push(4);
        if (!learningGoals?.对话) missingModules.push(5);

        // If there are missing modules, skip them
        if (missingModules.length > 0) {
            setCurrentStep(prevStep => {
                let nextStep = prevStep;
                while (missingModules.includes(nextStep)) {
                    nextStep += 1; // Skip missing modules
                }
                return nextStep >= Models.length ? Models.length - 1 : nextStep; // Ensure we don't exceed the last step
            });
        }
    }, [learningGoals]);
    useEffect(() => {
        const modules = [];
        if (learningGoals?.构音) modules.push("构音模块");
        if (learningGoals?.命名) modules.push("命名模块");
        if (learningGoals?.语言结构) modules.push("语言结构模块");
        if (learningGoals?.对话) modules.push("对话模块");
        setAvailableModules(modules);
    }, [learningGoals]);
    // 处理目标选择的函数
    const handleNextStep = () => {
        // 添加验证逻辑
        if (currentStep === 1) {
        } else if (currentStep === 2) {
        } else if (currentStep === 3) {
        } else if (currentStep === 4) {
        } else if (currentStep === 5) {
        }

        // Move to the next step
        setCurrentStep(prevStep => {
            let nextStep = prevStep + 1;
            // Check if the next step is available
            while (nextStep < Models.length && !availableModules.includes(Models[nextStep])) {
                nextStep++;
            }
            return nextStep < Models.length ? nextStep : Models.length - 1; // Ensure we don't exceed the last step
        });
    };
    const handleSelectTheme = (theme) => {
        setSelectedTheme(theme);
    };
    const handleLast = () => {
        if (currentStep === 0) {
            navigation.navigate('HorizontalLayout');
        } else {
            setCurrentStep(prevStep => {
                const newStep = prevStep - 1;
                setSelectedTheme(Models[newStep]); // 使用 newStep 而不是 currentStep
                return newStep;
            });
        }
    };

    const handleChangeStep = (step) => {
        setCurrentStep(step); // Update currentStep based on the selected module
    };
    useEffect(()=>{
        setSelectedTheme(Models[currentStep]);
    },[currentStep])




    return (
        <View style={[styles.container, { width, height }]}>

            <Text style={styles.title}>教材草稿</Text>
            <Text style={styles.childFile}>儿童档案</Text>
            <Text style={styles.logo}>LingoLift</Text>
            <View style={styles.ellipse} />
            <Text style={styles.childName}>儿童姓名：{name}</Text>
            <View style={styles.rectangle75} />

            {/* Render the LearningTitle Component */}
            {
                currentStep<4 && (
                    <LearningTitle
                        selectedTheme={selectedTheme}
                        onSelect={handleSelectTheme}
                        onChangeStep={handleChangeStep}
                        availableModules={availableModules} // Pass unavailable modules
                    />)
            }
            {currentStep === 0 && (
                <Pronun />
            )}
            {currentStep === 1 && (
                <Naming/>
            )}
            {/* Render the ButtonGroup Component */}
            <ButtonGroup handleNext={handleNextStep} handleLast={handleLast} step={currentStep} />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#DBF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rectangle75: {
        width: '90%',
        height: '59%',
        backgroundColor: 'white',
        borderRadius: 40,
        position: 'absolute',
        top: '30%',
        left: '5%',
    },
    title: {
        fontSize: 18,
        color: '#1C5B83',
        fontWeight: '500',
        position: 'absolute',
        top: 115,
        left: 169,
    },
    childFile: {
        fontSize: 18,
        color: '#1C5B83',
        position: 'absolute',
        top: 115,
        left: 61,
    },
    logo: {
        fontSize: 20,
        color: '#39B8FF',
        fontWeight: '500',
        position: 'absolute',
        top: 15,
        left: 39,
    },
    ellipse: {
        width: 20,
        height: 20,
        backgroundColor: '#FFCB3A',
        borderRadius: 9999,
        position: 'absolute',
        top: 19,
        left: 14,
    },
    childName: {
        fontSize: 18,
        color: '#39B8FF',
        fontWeight: '500',
        position: 'absolute',
        top: 17,
        left: '80%',
    },
    selectPrompt: {
        fontSize: 16,
        color: 'rgba(28, 91, 131, 0.50)',
        position: 'absolute',
        top: 700,
        left: '35%',
    },
});

export default Draft;
