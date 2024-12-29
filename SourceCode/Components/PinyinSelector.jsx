// PinyinSelector.js
import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';

// 这里定义声母分组
const pinyinGroups = [
    { label: '双唇音', initials: ['b', 'p', 'm'] },
    { label: '唇齿音', initials: ['f'] },
    { label: '舌面音', initials: ['j', 'q', 'x'] },
    { label: '舌尖前音', initials: ['z', 'c', 's'] },
    { label: '舌尖中音', initials: ['d', 't', 'n', 'l'] },
    { label: '舌尖后音', initials: ['zh', 'ch', 'sh', 'r'] },
    { label: '舌根音', initials: ['g', 'k', 'h'] },
];

const PinyinSelector = ({
                            selectedInitials,          // 当前选中的生母数组
                            onSelectedInitialsChange,  // 回调，传回最新选中数组
                            maxCount = 3               // 最多可选多少个
                        }) => {

    // 当点击某个生母按钮时
    const handlePress = (initial) => {
        // 如果已选中 => 取消勾选
        if (selectedInitials.includes(initial)) {
            const newSelected = selectedInitials.filter(item => item !== initial);
            onSelectedInitialsChange(newSelected);
            return;
        }

        // 如果尚未选中 => 尝试添加
        if (selectedInitials.length < maxCount) {
            const newSelected = [...selectedInitials, initial];
            onSelectedInitialsChange(newSelected);
        } else {
            Alert.alert('提示', `最多只能选择${maxCount}个生母`);
        }
    };

    return (
        <View>
            {/* 分组渲染：每组一行 */}
            {pinyinGroups.map((group) => (
                <View key={group.label} style={styles.groupContainer}>
                    {/* 分组标题 */}
                    <Text style={styles.groupLabel}>{group.label}</Text>

                    {/* 该组的生母按钮 */}
                    <View style={styles.groupRow}>
                        {group.initials.map((initial) => {
                            const isSelected = selectedInitials.includes(initial);
                            return (
                                <TouchableOpacity
                                    key={initial}
                                    style={[
                                        styles.pinyinButton,
                                        { backgroundColor: isSelected ? '#2980b9' : '#bdc3c7' }
                                    ]}
                                    onPress={() => handlePress(initial)}
                                >
                                    <Text style={styles.pinyinText}>{initial}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            ))}
        </View>
    );
};

export default PinyinSelector;

// ============ 样式表(可单独，也可复用父组件) ============
const styles = StyleSheet.create({
    groupContainer: {
        marginBottom: 10,
    },
    groupLabel: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
    },
    groupRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    pinyinButton: {
        width: 50,
        marginRight: 8,
        marginBottom: 6,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
    },
    pinyinText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
