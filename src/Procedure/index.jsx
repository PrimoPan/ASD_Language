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

const Procedure = () => {
    const navigation = useNavigation();
    const { name } = useStore(state => state.currentChildren);
    const { learningGoals, setLearningGoals } = useStore();
    const [selectedBox, setSelectedBox] = useState(null);
    const [selectedTheme, setSelectedTheme] = useState("学习主题");
    const [selectedMajor, setSelectMajor] = useState(null);
    const [currentStep, setCurrentStep] = useState(0); // Add state to track the current step
    const Models=['学习主题','主题场景','构音模块','命名模块','语言结构模块','对话模块'];
    const [availableModules, setAvailableModules] = useState([]);
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
        modules.push('学习主题');
        modules.push('主题场景');
        if (learningGoals?.构音) modules.push("构音模块");
        if (learningGoals?.命名) modules.push("命名模块");
        if (learningGoals?.语言结构) modules.push("语言结构模块");
        if (learningGoals?.对话) modules.push("对话模块");
        setAvailableModules(modules);
    }, [learningGoals]);
    const [activity, setActivity] = useState(null);
    const [backgroundUrl, setBackgroundUrl] = useState(null);
    const [Gy, setGy] = useState(null);
    const [namingGoal, setnamingGoal] = useState(null);
    const [LgGoal, setLgGoal] = useState(null);
    const [DhGoal, setDhGoal] = useState(null);
    // 处理目标选择的函数
    const handlenamingGoal = (goal) => {
        setnamingGoal(goal);
    };
    const handleDhGoal = (goal) =>{
        setDhGoal(goal);
    }
    const handleGy = (data) =>{
        setGy(data);
    }
    const handleLgGoal = (goal) => {
        setLgGoal(goal);
    }
    const handleNextStep = () => {
        // 添加验证逻辑
        if (currentStep === 1) {
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
                    background: backgroundUrl,
                },
            };
            setLearningGoals(updatedGoals);
        } else if (currentStep === 2 && Gy != null) {
            const updatedLearningGoals = {
                ...learningGoals,
                构音: Gy,
            };
            setLearningGoals(updatedLearningGoals);
        } else if (currentStep === 3 && namingGoal != null) {
            const updatedLearningGoals = {
                ...learningGoals,
                命名: {
                    ...learningGoals.命名,
                    detail: namingGoal,
                },
            };
            setLearningGoals(updatedLearningGoals);
        } else if (currentStep === 4 && LgGoal != null) {
            const updatedLearningGoals = {
                ...learningGoals,
                语言结构: {
                    ...learningGoals.语言结构,
                    detail: LgGoal,
                },
            };
            setLearningGoals(updatedLearningGoals);
        } else if (currentStep === 5 && DhGoal != null) {
            const updatedLearningGoals = {
                ...learningGoals,
                对话: {
                    ...learningGoals.对话,
                    detail: DhGoal,
                },
            };
            setLearningGoals(updatedLearningGoals);
            navigation.navigate('Draft');
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

            {
                currentStep<6 && (
            <Text style={styles.title}>智能生成教材</Text>
                )
            }
            <Text style={styles.childFile}>儿童档案</Text>
            <Text style={styles.logo}>RingoLift</Text>
            <View style={styles.ellipse} />
            <Text style={styles.childName}>儿童姓名：{name}</Text>
            <View style={styles.rectangle75} />

            {/* Render the LearningTitle Component */}
            {
                currentStep<6 && (
                    <LearningTitle
                        selectedTheme={selectedTheme}
                        onSelect={handleSelectTheme}
                        onChangeStep={handleChangeStep}
                        availableModules={availableModules} // Pass unavailable modules
                    />)
            }

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
                <Naming onSelectGoal={handlenamingGoal}/>
            )}
            {currentStep === 4 && (
                <Language onSelectGoal={handleLgGoal}/>
            )}
            {currentStep === 5 && (
                <DH onSelectGoal={handleDhGoal}/>
            )}
            {/* Render the ThemeSelection Component */}
            {currentStep === 0 && (
                <ThemeSelection selectedBox={selectedBox} handleSelectBox={handleSelectBox} handleSelectMajor={handleSelectMajor} />
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

export default Procedure;
