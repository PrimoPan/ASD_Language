import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert,ScrollView, Image } from 'react-native';
import useStore from "../store/store.jsx";
import { useNavigation } from "@react-navigation/native";
import { createLearning } from "../services/api"; // ✅ 引入 API
import Pronun from "./Pronun";
import Naming from "./Naming";
import Ls from "./Ls.jsx";
import Dia from "./Dia";
import LearningTitle from './LearningTitle';
import ButtonGroup from './ButtonGroup';

// 获取屏幕宽度和高度
const { width, height } = Dimensions.get('window');

const Draft = () => {
    const navigation = useNavigation();
    const { name } = useStore(state => state.currentChildren);
    const { learningGoals } = useStore();

    // **所有可能的模块**
    const Models = ['构音模块', '命名模块', '语言结构模块', '对话模块'];

    // **确保 `learningGoals` 存在**
    const safeLearningGoals = learningGoals || {};

    // **计算当前儿童的可用模块索引**
    const availableModulesIndex = Models.map((_, index) => {
        if (index === 0 && safeLearningGoals?.构音) return index;
        if (index === 1 && safeLearningGoals?.命名) return index;
        if (index === 2 && safeLearningGoals?.语言结构) return index;
        if (index === 3 && safeLearningGoals?.对话) return index;
        return null;
    }).filter(index => index !== null); // ✅ **确保 `availableModulesIndex` 是数组**

    // **如果 `availableModulesIndex` 为空，默认设置为 `[0]`**
    const safeAvailableModulesIndex = availableModulesIndex.length > 0 ? availableModulesIndex : [0];

    // **计算最后一个可用模块的索引**
    const allowedLastStep = safeAvailableModulesIndex[safeAvailableModulesIndex.length - 1];

    // **计算可用模块的名称**
    const availableModules = Models.filter((_, index) => safeAvailableModulesIndex.includes(index));

    // **初始状态设为第一个有效模块**
    const [currentStep, setCurrentStep] = useState(safeAvailableModulesIndex[0]);
    const [selectedTheme, setSelectedTheme] = useState(Models[currentStep]);

    useEffect(() => {
        setSelectedTheme(Models[currentStep]);
    }, [currentStep]);

    // **提交学习计划**
    const handleSubmitLearning = async () => {
        try {
            const response = await createLearning(safeLearningGoals, name);
            console.log(response);
            Alert.alert("✅ 提交成功", "学习记录已保存！");
        } catch (error) {
            Alert.alert("❌ 提交失败", error.toString());
        }
    };

    // **下一步逻辑**
    const handleNextStep = () => {
        if (currentStep === allowedLastStep) {  // ✅ **如果 currentStep 是最后一个模块，则提交**
            Alert.alert(
                '提示',
                '是否开始上课\n继续教学将本次教学目标上传到服务器，开始投影教学！',
                [
                    { text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: '确定', onPress: () => handleSubmitLearning() }, // ✅ **点击确定后上传**
                ],
                { cancelable: false }
            );
        } else {
            // **找到下一个可用的模块**
            const currentIndex = safeAvailableModulesIndex.indexOf(currentStep);
            const nextStep = safeAvailableModulesIndex[currentIndex + 1];

            if (nextStep !== undefined) {
                setCurrentStep(nextStep);
            }
        }
    };

    const handleLast = () => {
        const currentIndex = safeAvailableModulesIndex.indexOf(currentStep);
        const prevStep = safeAvailableModulesIndex[currentIndex - 1];

        if (prevStep !== undefined) {
            setCurrentStep(prevStep);
        } else {
            navigation.navigate('HorizontalLayout');
        }
    };

    return (
        <View style={[styles.container, { width, height }]}>

            <Text style={styles.title}>教材草稿</Text>
            <Text style={styles.childFile}>儿童档案</Text>
            <Text style={styles.logo}>LingoLift</Text>
            <View style={styles.ellipse} />
            <Text style={styles.childName}>儿童姓名：{name}</Text>
            <View style={styles.rectangle75} />

            {/* Render the LearningTitle Component */}
            {currentStep < 4 && (
                <LearningTitle
                    selectedTheme={selectedTheme}
                    onSelect={setSelectedTheme}
                    onChangeStep={setCurrentStep}
                    availableModules={availableModules} // ✅ 现在 `availableModules` 一定是数组
                />
            )}
            {currentStep === 0 && (
                <Pronun />
            )}
            {currentStep === 1 && (
                <Naming/>
            )}
            {currentStep === 2 && (
                <Ls/>
            )}
            {currentStep === 3 && (
                <Dia/>
            )}
            {/* Render the ButtonGroup Component */}
            <View style={styles.imageScrollContainer}>
                <ScrollView horizontal>
                    {learningGoals?.构音?.cards
                        ?.slice(0, 4)
                        .map((card, index) => (
                            <View style={styles.imageCard} key={index}>
                                <Image
                                    source={{ uri: card.image }}
                                    style={styles.cardImage}
                                    resizeMode="cover"
                                />
                                <Text style={styles.cardIndex}>{index + 1}.</Text>
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
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
    imageScrollContainer: {
        position: 'fixed',
        // 固定高度或最大高度，这里示例200 + 一些margin
        height: 220, // 你需要多高可自行调整
        top: '12%',
        // 如果想要更灵活，可用 maxHeight: 220, 并加 overflow: "hidden"
    },
    imageCard: {
        position: 'relative',
        width: 150,
        height: 150,
        marginRight: 10,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    cardIndex: {
        position: 'absolute',
        top: 2,
        left: 2,
        backgroundColor: 'rgba(255,255,255,0.6)',
        paddingHorizontal: 4,
        borderRadius: 3,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
});

export default Draft;
