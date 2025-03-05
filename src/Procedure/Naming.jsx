import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GoalSection from './GoalSection';
import useStore from "../store/store";
import vbMappData from '../Knowledge/VBMapp.json';

const Naming = ({ onSelectGoal }) => {
    const currentChildren = useStore(state => state.currentChildren);
    const level = currentChildren?.命名;
    const [selectedGoals, setSelectedGoals] = useState([]);
    const goals = [
        {
            title: '复习目标',
            code: 'T' + (level - 1),
            description: getRandomOne('命名', level - 1),
        },
        {
            title: '新学习目标',
            code: 'T' + level,
            description: getRandomOne('命名', level),
        },
        {
            title: '自定义目标',
            code: '自定义',
            description: ['使用"你好""再见"等礼貌用词'],
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
        const st = subset[randIndex];
        const valuesAsString = Object.values(st).map(value => String(value));
        return valuesAsString;
    }

    const handleGoalSelect = (goal) => {
        setSelectedGoals(prevSelected => {
            const index = prevSelected.findIndex(g => g.code === goal.code);
            const newSelected = [...prevSelected];
            if (index > -1) {
                // If goal is already selected, update it
                newSelected[index] = goal;
            } else {
                // If goal is not selected, add it
                newSelected.push(goal);
            }
            if (onSelectGoal) {
                onSelectGoal(newSelected);
            }
            return newSelected;
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.mainTitle}>命名教学目标</Text>
            <Text style={styles.subTitle}>
                综合 历史学习记录 与 儿童未掌握技能 ，推荐您本堂课训练目标为：
            </Text>
            <View style={styles.goalsContainer}>
                {goals.map((goal, index) => (
                    <GoalSection
                        key={index}
                        title={goal.title}
                        code={goal.code}
                        description={goal.description}
                        onPress={updatedDescription => handleGoalSelect({ ...goal, description: updatedDescription })}
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

export default Naming;