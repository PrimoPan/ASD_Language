import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GoalSectionLan from './GoSectionLan';
import useStore from "../store/store";
import vbMappData from '../Knowledge/VBMapp.json';

const Language = () => {
    const currentChildren = useStore(state => state.currentChildren);
    console.log(currentChildren);
    const level = currentChildren?.语言结构;
    console.log(level);
    let goals = [
        {
            title: '复习目标',
            code: 'LS'+ (level-1),
            description: getRandomOne('语言结构',level-1),
        },
        {
            title: '新学习目标',
            code: 'LS'+(level),
            description: getRandomOne('语言结构',level),
        },
        {
            title: '自定义目标',
            code: '自定义',
            description: '学习：“我要买.......“这样的句子结构',
        },
    ];
    function getRandomOne(domain, level) {
        const numericLevel = parseInt(level, 10);
        if (isNaN(numericLevel) || numericLevel < 1 || numericLevel > 15) {
            return null;
        }
        const levelKey = String(numericLevel).padStart(2, '0') + '-M';
        const items = vbMappData[domain]?.[levelKey];
        if (!items || items.length === 0) {
            return null;
        }
        const subset = items.slice(0, items.length - 1);
        if (subset.length === 0) {
            return null;
        }
        const randIndex = Math.floor(Math.random() * subset.length);
        let st = subset[randIndex];
        console.log(st);
        let value = st.key; // 或者 st.key
        let valuesAsString = Object.values(st).map(value => String(value));


        console.log(valuesAsString);
        return valuesAsString;

    }
    return (
        <View style={styles.container}>
            <Text style={styles.mainTitle}>语言结构教学目标</Text>
            <Text style={styles.subTitle}>
                综合 历史学习记录 与 儿童未掌握技能 ，推荐您本堂课训练目标为：
            </Text>
            <View style={styles.goalsContainer}>
                {goals.map((goal, index) => (
                    <GoalSectionLan
                        key={index}
                        title={goal.title}
                        code={goal.code}
                        description={goal.description}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 40,
        display: 'flex',
        marginTop: 16,
        width: '100%',
        maxWidth: 1029,
        paddingHorizontal: 49,
        paddingTop: 51,
        paddingBottom: 137,
        alignItems: 'center',
    },
    mainTitle: {
        color: 'rgba(28, 91, 131, 1)',
        fontSize: 20,
        fontFamily: 'PingFang SC, sans-serif',
        fontWeight: '500',
        textAlign: 'center',
    },
    subTitle: {
        color: 'rgba(28, 91, 131, 1)',
        fontSize: 16,
        fontFamily: 'PingFang SC, sans-serif',
        fontWeight: '400',
        marginTop: 13,
    },
    goalsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 77,
        width: '100%',
    },
});

export default Language;