import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const LearningTitle = ({ selectedTheme, onSelect, onChangeStep }) => {
    console.log('theme:',selectedTheme);
    return (
        <View style={styles.textRow}>
            <Text
                style={[
                    styles.themeTitle,
                    selectedTheme === "学习主题" && styles.selected
                ]}
                onPress={() => {
                    onSelect("学习主题");
                    onChangeStep(0); // Set currentStep to 0
                }}
            >
                学习主题
            </Text>
            <Text
                style={[
                    styles.moduleTitle,
                    selectedTheme === "主题场景" && styles.selected
                ]}
                onPress={() => {
                    onSelect("主题场景");
                    onChangeStep(1); // Set currentStep to 1
                }}
            >
                主题场景
            </Text>
            <Text
                style={[
                    styles.moduleTitle,
                    selectedTheme === "构音模块" && styles.selected
                ]}
                onPress={() => {
                    onSelect("构音模块");
                    onChangeStep(2); // Set currentStep to 2
                }}
            >
                构音模块
            </Text>
            <Text
                style={[
                    styles.moduleTitle,
                    selectedTheme === "命名模块" && styles.selected
                ]}
                onPress={() => {
                    onSelect("命名模块");
                    onChangeStep(3); // Set currentStep to 3
                }}
            >
                命名模块
            </Text>
            <Text
                style={[
                    styles.moduleTitle,
                    selectedTheme === "语言结构模块" && styles.selected
                ]}
                onPress={() => {
                    onSelect("语言结构模块");
                    onChangeStep(4); // Set currentStep to 4
                }}
            >
                语言结构模块
            </Text>
            <Text
                style={[
                    styles.moduleTitle,
                    selectedTheme === "对话模块" && styles.selected
                ]}
                onPress={() => {
                    onSelect("对话模块");
                    onChangeStep(5); // Set currentStep to 5
                }}
            >
                对话模块
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    textRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        position: 'absolute',
        top: 188,
        left: 118,
    },
    learningTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: '#1C5B83',
    },
    themeTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: 'rgba(28.44, 91.45, 131.42, 0.50)',
    },
    moduleTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: 'rgba(28.44, 91.45, 131.42, 0.50)',
    },
    selected: {
        color: '#39B8FF',  // Highlight the selected theme
    },
});

export default LearningTitle;