// LearningMode.js
import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Button
} from 'react-native';

// 1) 导入您项目的zustand store
import useStore from '../store/store';

// 2) 导入拼音选择器（若您有这个需求）
import PinyinSelector from '../Components/PinyinSelector';

// 3) 导入本地 VB-MAPP JSON
import vbMappData from '../Knowledge/VBMapp.json';

/**
 * 给定领域(如"命名")和等级(1~15的数字字符串),
 * 在对应 "xx-M" 的数组中跳过最后一条, 随机返回1条
 */
function getRandomOne(domain, level) {
    // 有些场景下 level 是字符串，需要确保转成二位数字
    // 如果 store 里本身就是"2"、"7"之类字符串, parse后再拼
    const numericLevel = parseInt(level, 10);
    if (isNaN(numericLevel) || numericLevel < 1 || numericLevel > 15) {
        return null; // 超出范围，返回null
    }
    const levelKey = String(numericLevel).padStart(2, '0') + '-M';

    // 在 vbMappData[domain] 中找到 levelKey 对应的数组
    const items = vbMappData[domain]?.[levelKey];
    if (!items || items.length === 0) {
        return null;
    }
    // 跳过最后一条
    const subset = items.slice(0, items.length - 1);
    if (subset.length === 0) {
        return null;
    }
    // 随机抽取1条
    const randIndex = Math.floor(Math.random() * subset.length);
    return subset[randIndex];
}

const LearningMode = () => {
    // =====================
    // 1. 一次性从store读取
    // =====================
    const initialStoreValue = useStore.getState().currentChildren || {};

    // 读取孩子在表单中填写的 3 个等级 (如 "命名": "2", "语言结构": "7", "对话": "5")
    const namingLevel = initialStoreValue["命名"] || "1";
    const structureLevel = initialStoreValue["语言结构"] || "1";
    const dialogueLevel = initialStoreValue["对话"] || "1";

    // =====================
    // 2. 随机题目(命名/语言结构/对话)
    // =====================
    // 初次渲染时，分别获取1条
    const [namingSolution, setNamingSolution] = useState(() => getRandomOne("命名", namingLevel));
    const [structureSolution, setStructureSolution] = useState(() => getRandomOne("语言结构", structureLevel));
    const [dialogueSolution, setDialogueSolution] = useState(() => getRandomOne("对话", dialogueLevel));

    // 可选：点击按钮“重新随机”
    const reRandomNaming = () => {
        setNamingSolution(getRandomOne("命名", namingLevel));
    };
    const reRandomStructure = () => {
        setStructureSolution(getRandomOne("语言结构", structureLevel));
    };
    const reRandomDialogue = () => {
        setDialogueSolution(getRandomOne("对话", dialogueLevel));
    };

    // =====================
    // 3. 声母选择(如果需要)
    // =====================
    // 这里沿用您原有的 PinyinSelector 逻辑
    const [selectedInitials, setSelectedInitials] = useState(
        initialStoreValue.selectedInitials || []
    );

    // =====================
    // 4. 提交后, 手动写回store (示例)
    // =====================
    const [displayData, setDisplayData] = useState(
        JSON.stringify(initialStoreValue, null, 2)
    );
    const handleSubmit = () => {
        // 合并selectedInitials
        const latestStoreValue = useStore.getState().currentChildren;
        const newData = {
            ...latestStoreValue,
            selectedInitials,
        };
        // 写回store
        useStore.setState({ currentChildren: newData });

        // 更新右侧显示
        const updated = useStore.getState().currentChildren;
        setDisplayData(JSON.stringify(updated, null, 2));
    };

    return (
        <View style={styles.container}>

            {/* 左侧 */}
            <View style={styles.leftColumn}>
                <Text style={styles.title}>学习模式</Text>

                {/* 展示 + 重新随机(命名) */}
                <Text style={styles.blockTitle}>命名 (Level: {namingLevel})</Text>
                <RandomItemDisplay solution={namingSolution} />
                <Button title="重新随机" onPress={reRandomNaming} />

                {/* 语言结构 */}
                <Text style={styles.blockTitle}>语言结构 (Level: {structureLevel})</Text>
                <RandomItemDisplay solution={structureSolution} />
                <Button title="重新随机" onPress={reRandomStructure} />

                {/* 对话 */}
                <Text style={styles.blockTitle}>对话 (Level: {dialogueLevel})</Text>
                <RandomItemDisplay solution={dialogueSolution} />
                <Button title="重新随机" onPress={reRandomDialogue} />

                {/* 声母选择 + 提交按钮 */}
                <View style={styles.card}>
                    <Text style={styles.cardHeader}>请选择声母（不超过3个）</Text>
                    <PinyinSelector
                        selectedInitials={selectedInitials}
                        onSelectedInitialsChange={setSelectedInitials}
                        maxCount={3}
                    />
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitText}>提交</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* 右侧: 显示当前儿童信息(仅在提交后手动更新) */}
            <View style={styles.rightColumn}>
                <ScrollView contentContainerStyle={styles.infoContainer}>
                    <Text style={styles.title}>当前儿童信息</Text>
                    <Text style={styles.jsonText}>{displayData}</Text>
                </ScrollView>
            </View>
        </View>
    );
};

/**
 * 用于渲染 "随机一条方案" 的视图,
 * solution 例如 { "T1-a": "有语言辅助..." }
 */
function RandomItemDisplay({ solution }) {
    if (!solution) {
        return <Text style={styles.warn}>无可用条目</Text>;
    }
    // 只取第一个key
    const keyName = Object.keys(solution)[0];
    const content = solution[keyName];
    return (
        <View style={styles.randomBox}>
            <Text style={styles.randomBoxText}>
                {keyName}: {content}
            </Text>
        </View>
    );
}

export default LearningMode;

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#F2F2F2',
    },
    leftColumn: {
        flex: 0.5,
        padding: 20,
    },
    rightColumn: {
        flex: 0.5,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
    },
    blockTitle: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: '600',
    },
    randomBox: {
        backgroundColor: '#eee',
        padding: 10,
        marginVertical: 8,
        borderRadius: 6,
    },
    randomBoxText: {
        fontSize: 14,
    },
    warn: {
        color: 'red',
        marginVertical: 8,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    infoContainer: {
        paddingBottom: 40,
    },
    jsonText: {
        marginTop: 10,
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    submitButton: {
        backgroundColor: '#2980b9',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 15,
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
