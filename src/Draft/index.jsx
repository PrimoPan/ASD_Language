import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, ScrollView, Image } from 'react-native';
import useStore from "../store/store.jsx";
import { useNavigation, useRoute } from "@react-navigation/native";
import { createLearning } from "../services/api";
import Pronun from "./Pronun";
import Naming from "./Naming";
import Ls from "./Ls.jsx";
import Dia from "./Dia";
import LearningTitle from './LearningTitle';
import ButtonGroup from './ButtonGroup';

const { width, height } = Dimensions.get('window');

const Draft = () => {
    const navigation = useNavigation();
    const { name } = useStore(state => state.currentChildren);
    const { learningGoals } = useStore();

    // “draft” => 编辑模式， “final” => 查看模式
    const route = useRoute();
    const initialMode = route.params?.mode || 'draft';
    const [viewMode, setViewMode] = useState(initialMode);


    // 所有模块
    const Models = ['构音模块', '命名模块', '语言结构模块', '对话模块'];

    // 确保 learningGoals 存在
    const safeLearningGoals = learningGoals || {};

    // 计算可用模块索引
    const availableModulesIndex = Models.map((_, index) => {
        if (index === 0 && safeLearningGoals?.构音) return index;
        if (index === 1 && safeLearningGoals?.命名) return index;
        if (index === 2 && safeLearningGoals?.语言结构) return index;
        if (index === 3 && safeLearningGoals?.对话) return index;
        return null;
    }).filter(index => index !== null);

    // 如果没有可用模块，就默认只显示第一个
    const safeAvailableModulesIndex = availableModulesIndex.length > 0 ? availableModulesIndex : [0];

    // 最后一个可用模块
    const allowedLastStep = safeAvailableModulesIndex[safeAvailableModulesIndex.length - 1];

    // 获取可用模块的名称数组
    const availableModules = Models.filter((_, index) => safeAvailableModulesIndex.includes(index));

    // 当前模块
    const [currentStep, setCurrentStep] = useState(safeAvailableModulesIndex[0]);
    const [selectedTheme, setSelectedTheme] = useState(Models[currentStep]);

    useEffect(() => {
        setSelectedTheme(Models[currentStep]);
    }, [currentStep]);

    // 提交学习计划
    const handleSubmitLearning = async () => {
        try {
            const response = await createLearning(safeLearningGoals, name);
            Alert.alert("✅ 提交成功", "学习记录已保存！");

            // 切换到查看模式
            setViewMode("final");
            // **重置到第一个可用模块**
            setCurrentStep(safeAvailableModulesIndex[0]);

        } catch (error) {
            Alert.alert("❌ 提交失败", error.toString());
        }
    };

    // 下一步逻辑
    const handleNextStep = () => {
        // 如果在查看模式
        if (viewMode === "final") {
            // 如果已经是最后一个模块了 => 是否回到主菜单
            if (currentStep === allowedLastStep) {
                Alert.alert(
                    "提示",
                    "是否回到主菜单？",
                    [
                        { text: '取消', style: 'cancel' },
                        {
                            text: '确定',
                            onPress: () => {
                                navigation.navigate("ChildrenList");
                            }
                        }
                    ],
                    { cancelable: false }
                );
            } else {
                // 如果还没到最后一个 => 继续下一个模块
                const currentIndex = safeAvailableModulesIndex.indexOf(currentStep);
                const nextStep = safeAvailableModulesIndex[currentIndex + 1];
                if (nextStep !== undefined) {
                    setCurrentStep(nextStep);
                }
            }
            return;
        }

        // 如果处于编辑模式
        if (currentStep === allowedLastStep) {
            Alert.alert(
                '提示',
                '是否开始上课\n继续教学将本次教学目标上传到服务器，开始投影教学！',
                [
                    { text: '取消', style: 'cancel' },
                    { text: '确定', onPress: () => handleSubmitLearning() },
                ],
                { cancelable: false }
            );
        } else {
            // 普通下一步
            const currentIndex = safeAvailableModulesIndex.indexOf(currentStep);
            const nextStep = safeAvailableModulesIndex[currentIndex + 1];
            if (nextStep !== undefined) {
                setCurrentStep(nextStep);
            }
        }
    };

    const handleLast = () => {
        // 如果查看模式 => 禁止往回
        if (viewMode === "final") {
            Alert.alert("提示", "查看模式下无法返回上一步");
            return;
        }

        // 编辑模式下 => 找到上一个可用模块
        const currentIndex = safeAvailableModulesIndex.indexOf(currentStep);
        const prevStep = safeAvailableModulesIndex[currentIndex - 1];
        if (prevStep !== undefined) {
            setCurrentStep(prevStep);
        } else {
            // 如果已经是第一个 => 回到别的页面
            navigation.navigate('HorizontalLayout');
        }
    };

    return (
        <View style={[styles.container, { width, height }]}>
            {/* 如果是查看模式，标题改“教案内容”，否则“教材草稿” */}
            <Text style={styles.title}>{viewMode === "final" ? "教案内容" : "教材草稿"}</Text>
            <Text style={styles.childFile}>儿童档案</Text>
            <Text style={styles.logo}>LingoLift</Text>
            <View style={styles.ellipse} />
            <Text style={styles.childName}>儿童姓名：{name}</Text>
            <View style={styles.rectangle75} />

            {currentStep < 4 && (
                <LearningTitle
                    selectedTheme={selectedTheme}
                    // 在查看模式下禁用 change
                    onSelect={viewMode === "final" ? () => {} : setSelectedTheme}
                    onChangeStep={viewMode === "final" ? () => {} : setCurrentStep}
                    availableModules={availableModules}
                />
            )}
            {currentStep === 0 && <Pronun viewMode={viewMode} />}
            {currentStep === 1 && <Naming viewMode={viewMode} />}
            {currentStep === 2 && <Ls viewMode={viewMode} />}
            {currentStep === 3 && <Dia viewMode={viewMode} />}

            {/* 示例：下方的图片滚动 */}
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

export default Draft;

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
    imageScrollContainer: {
        position: 'fixed',
        height: 220,
        top: '12%',
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
