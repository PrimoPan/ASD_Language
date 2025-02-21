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
    const [selectedBox, setSelectedBox] = useState(null);
    const [selectedTheme, setSelectedTheme] = useState("学习主题");
    const [selectedMajor, setSelectMajor] = useState(null);
    const [currentStep, setCurrentStep] = useState(0); // Add state to track the current step
    const Models=['学习主题','主题场景','构音模块','命名模块','语言结构模块','对话模块'];
    const handleNextStep = () => {
        setCurrentStep(prevStep => {
            const nextStep = prevStep + 1;
            console.log('next', nextStep); // 在这里打印 nextStep
            return nextStep > 6 ? 0 : nextStep; // Reset to 0 after step 6
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
        console.log('改变',currentStep);
    },[currentStep])
    const handleSelectBox = (index) => {
        console.log('Selected Box:', index);
        setSelectedBox(index);
    };

    const handleSelectMajor = (Major) => {
        console.log(Major);
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
                <ThemeScene selectedMajor={selectedMajor} />
            )}
            {currentStep === 2 && (
                <PronunciationModule />
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
        width: 1920 * 0.65,
        height: 560,
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
        left: 1044,
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
