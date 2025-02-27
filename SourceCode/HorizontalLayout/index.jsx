import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import useStore from "../store/store.jsx";
import LearningTitle from './LearningTitle';
import ThemeSelection from './ThemeSelection';
import ButtonGroup from './ButtonGroup';
import LearningTheme from './LearningTheme';
import ThemeScene from './ThemeScene';
import PronunciationModule from './PronunciationModule';
import Naming from './Naming'
import {useNavigation} from "@react-navigation/native";
import Language from "./Language";
import DH from "./DH"
// 获取屏幕宽度和高度
const { width, height } = Dimensions.get('window');

const HorizontalLayout = () => {
    const navigation = useNavigation();
    const { name } = useStore(state => state.currentChildren);
    const { learningGoals, setLearningGoals } = useStore();
    const [selectedBox, setSelectedBox] = useState(null);
    const [selectedTheme, setSelectedTheme] = useState("学习主题");
    const [selectedMajor, setSelectMajor] = useState(null);
    const [currentStep, setCurrentStep] = useState(0); // Add state to track the current step
    const Models=['学习主题','主题场景','构音模块','命名模块','语言结构模块','对话模块'];
    const [activity, setActivity] = useState(null);
    const [backgroundUrl, setBackgroundUrl] = useState(null);
    const [Gy, setGy] = useState(null);
    const handleGy = (data) =>{
        setGy(data);
        console.log('Gy:',data);
    }

    const handleNextStep = () => {
        // 添加验证逻辑
        if (currentStep === 1) {
            // 验证逻辑
            if (!activity || !backgroundUrl) {
                Alert.alert("提示", "请先选择场景并生成图片");
                return;
            }

            // 更新learningGoals
            const updatedGoals = {
                ...learningGoals,
                主题场景: {
                    major: selectedMajor,
                    activity: activity,
                    background: backgroundUrl
                }
            };
            setLearningGoals(updatedGoals);
            console.log('Updated Learning Goals:', updatedGoals);
        }
        if (currentStep === 2)
        {
                if (Gy != null)
                {
                const updatedLearningGoals = {
                    ...learningGoals,
                    构音: Gy // 💡將發言模塊的數據存入 store
                };
                setLearningGoals(updatedLearningGoals);
                console.log('已存儲發言教學目標:', updatedLearningGoals);
            }
        }
        setCurrentStep(prevStep => {
            const nextStep = prevStep + 1;
            return nextStep > 6 ? 0 : nextStep;
        });
    };


    const handleLast = () => {
        if (currentStep === 0) {
            navigation.navigate('ChildProfileScreen');
        } else {
            setCurrentStep(prevStep => {
                const newStep = prevStep - 1;
                setSelectedTheme(Models[newStep]); // 使用 newStep 而不是 currentStep
                return newStep;
            });
        }
    };
    useEffect(()=>{
        setSelectedTheme(Models[currentStep]);
    },[currentStep])
    const handleSelectBox = (index) => {
        setSelectedBox(index);
    };

    const handleSelectMajor = (Major) => {
        setSelectMajor(Major);
    };

    const handleSelectTheme = (theme) => {
        setSelectedTheme(theme);
    };

    const handleChangeStep = (step) => {
        setCurrentStep(step); // Update currentStep based on the selected module
    };

    return (
        <View style={[styles.container, { width, height }]}>
            <Text style={styles.title}>智能生成教材</Text>
            <Text style={styles.childFile}>儿童档案</Text>
            <Text style={styles.logo}>LOGO</Text>
            <View style={styles.ellipse} />
            <Text style={styles.childName}>儿童姓名：{name}</Text>
            <View style={styles.rectangle75} />

            {/* Render the LearningTitle Component */}
            <LearningTitle
                selectedTheme={selectedTheme}
                onSelect={handleSelectTheme}
                onChangeStep={handleChangeStep} // Pass handleChangeStep to child
            />

            {/* Render content based on current step */}
            {currentStep === 1 && (
                <ThemeScene
                    selectedMajor={selectedMajor}
                    onSelectScene={(scene, url) => {
                        setActivity(scene);
                        setBackgroundUrl(url);
                    }}
                />
            )}
            {currentStep === 2 && (
                <PronunciationModule handleGy={handleGy} />
            )}
            {currentStep === 3 && (
                <Naming />
            )}
            {currentStep === 4 && (
                <Language />
            )}
            {currentStep === 5 && (
                <DH />
            )}
            {/* Render the ThemeSelection Component */}
            {currentStep === 0 && (
                <ThemeSelection selectedBox={selectedBox} handleSelectBox={handleSelectBox} handleSelectMajor={handleSelectMajor} />
            )}

            {/* Render the ButtonGroup Component */}
            <ButtonGroup handleNext={handleNextStep} handleLast={handleLast} />
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
        fontSize: 15,
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

export default HorizontalLayout;
