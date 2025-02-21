import React, { useState , useEffect} from 'react';
import { Text, View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import useStore from "../store/store";
import {gptQuery} from "../utils/api.js"

// 导入 JSON 文件
const environmentData = require('../Knowledge/Environment.json');

const ThemeSelection = ({ selectedBox, handleSelectBox, handleSelectMajor }) => {
    // 获取所有场景的键
    const allThemes = Object.keys(environmentData);
    const { currentChildren } = useStore();
    const { reinforcements = [], imageStyle } = currentChildren || {};
    const [interestThemes, setInterestThemes] = useState([]);
    const [selectedReinforcements, setSelectedReinforcements] = useState([]);
    // 定义一个状态来存储当前选择的主题
    const [randomThemes, setRandomThemes] = useState(getRandomThemes());

    // 定义一个函数来随机选择三个主题
    function getRandomThemes() {
        const shuffled = allThemes.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    }
    const generateInterestThemes = async (reinforcements) => {
        const prompt = `你是一位儿童教育专家，请根据以下强化物生成对应的儿童教学场景名称，每个场景名称用中文括号注明强化物，直接返回包含三个场景名称的数组字符串，不要任何解释和额外内容。例如：['超市购物（苹果）', '汽车大赛（小汽车）', '户外游戏（丢手绢）']。强化物列表：${reinforcements.join(', ')}`;

        try {
            const response = await gptQuery(prompt);

            // 转换字符串为数组
            let themesArray = [];
            try {
                themesArray = JSON.parse(response.replace(/'/g, '"')); // 替换单引号为双引号
            } catch (e) {
                console.error('格式转换失败:', e);
            }

            // 容错处理
            if (!Array.isArray(themesArray) || themesArray.length !== 3) {
                return reinforcements.map(r => `${r}主题`).slice(0, 3);
            }

            return themesArray;
        } catch (error) {
            console.error('生成场景失败:', error);
            return reinforcements.map(r => `自定义场景（${r}）`).slice(0, 3);
        }
    };
    const getRandomReinforcements = () => {
        const shuffled = [...reinforcements].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3).map(r => r.value);
    };

// 初始化场景
    const initializeInterestThemes = async () => {
        const selected = getRandomReinforcements();
        setSelectedReinforcements(selected);
        const themes = await generateInterestThemes(selected);
        setInterestThemes(themes);
    };

// 在useEffect中初始化
    useEffect(() => {
        if (reinforcements?.length >= 3) {
            initializeInterestThemes();
        }
    }, [reinforcements]);
    // 重新选择主题的处理函数
    const handleReselectThemes = () => {
        setRandomThemes(getRandomThemes());
    };

    return (
        <View style={styles.themeSelectionContainer}>
            <View style={styles.themeColumn}>
                <Text style={styles.selectionTitle}>综合学习主题</Text>
                <View style={styles.textBoxGroup}>
                    {randomThemes.map((text, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[
                                styles.cardBox,
                                selectedBox === `综合学习主题-${i}` && styles.selectedBox,
                            ]}
                            onPress={() => {handleSelectBox(`综合学习主题-${i}`); handleSelectMajor(text);}}
                        >
                            <Text style={styles.cardText}>{text}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={handleReselectThemes} style={styles.reselectButton}>
                        <Text style={styles.reselectButtonText}>重新选择</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.themeColumn}>
                <Text style={styles.selectionTitle}>儿童兴趣主题</Text>
                <View style={styles.textBoxGroup}>
                    {interestThemes.map((text, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[
                                styles.cardBox,
                                selectedBox === `儿童兴趣主题-${i}` && styles.selectedBox,
                            ]}
                            onPress={() => {
                                handleSelectBox(`儿童兴趣主题-${i}`);
                                handleSelectMajor(text);
                            }}
                        >
                            <Text style={styles.cardText}>{text}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        onPress={initializeInterestThemes}
                        style={styles.reselectButton}
                    >
                        <Text style={styles.reselectButtonText}>重新选择</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.themeColumn}>
                <Text style={styles.selectionTitle}>自由主题</Text>
                <TextInput
                    style={[
                        styles.inputBox,
                        selectedBox === '自由主题' && styles.selectedBox,
                    ]}
                    placeholder="请输入内容"
                    multiline
                    numberOfLines={4}
                    onFocus={() => handleSelectBox('自由主题')}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    themeSelectionContainer: {
        position: 'absolute',
        top: 325,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '90%',
    },
    themeColumn: {
        width: '30%',
        alignItems: 'center',
    },
    selectionTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: '#1C5B83',
        marginBottom: 10,
    },
    textBoxGroup: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 10,
    },
    cardBox: {
        width: 220,
        margin: 15,
        height: 73,
        backgroundColor: 'white',
        borderRadius: 20,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4,
        shadowOpacity: 1,
    },
    selectedBox: {
        backgroundColor: '#A2D7FF',
    },
    cardText: {
        fontSize: 20,
        fontWeight: '400',
        color: '#1C5B83',
    },
    inputBox: {
        width: 200,
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginTop: 20,
    },
    reselectButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#1C5B83',
        borderRadius: 5,
    },
    reselectButtonText: {
        color: 'white',
        fontWeight: '500',
    },
    loadingText: {
        color: '#1C5B83',
        marginVertical: 10,
    },
});

export default ThemeSelection;