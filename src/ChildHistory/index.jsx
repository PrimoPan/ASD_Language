import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getLearningHistoryForChild } from "../services/api";
import useStore from "../store/store";
import dayjs from 'dayjs';

const moduleColors = {
    '构音': '#44DCF8',
    '命名': '#FCC40B',
    '语言结构': '#FF7A69',
    '对话': '#0ED89E',
};

const ChildHistory = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const childName = route.params.childName;

    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setLearningGoals } = useStore();

    useEffect(() => {
        fetchLearningHistory();
    }, []);

    const fetchLearningHistory = async () => {
        try {
            setLoading(true);
            const res = await getLearningHistoryForChild(childName);
            setHistoryList(res.data || []);
        } catch (error) {
            Alert.alert("错误", "无法获取儿童历史记录");
        } finally {
            setLoading(false);
        }
    };

    const moduleColors = {
        '构音': '#44DCF8',
        '命名': '#FCC40B',
        '语言结构': '#FF7A69',
        '对话': '#0ED89E'
    };

    const getModulesForRecord = (record) => {
        const modules = [];
        if (record.构音) modules.push("构音");
        if (record.命名) modules.push("命名");
        if (record["语言结构"]) modules.push("语言结构");
        if (record["对话"]) modules.push("对话");
        return modules;
    };

    const handleSelectRecord = (record) => {
        setLearningGoals(record); // 存储所选历史记录
        navigation.navigate("Draft", { mode: "final" }); // 跳转到Draft并设置为final模式
    };

    const renderHistoryItem = ({ item }) => {
        const createdAtString = dayjs(item.createdAt).format("YYYY-MM-DD HH:mm");
        const modules = getModulesForRecord(item);

        return (
            <TouchableOpacity
                style={styles.historyCard}
                onPress={() => handleSelectRecord(item)}
            >
                <Text style={styles.timeText}>{createdAtString}</Text>
                <View style={styles.modulesRow}>
                    {modules.map((mod) => (
                        <View
                            key={mod}
                            style={[styles.moduleButton, { backgroundColor: moduleColors[mod] }]}
                        >
                            <Text style={styles.moduleText}>{mod}</Text>
                        </View>
                    ))}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{childName}的历史课程</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#1C5B83" />
            ) : (
                <FlatList
                    data={historyList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        const createdAtString = dayjs(item.createdAt).format("YYYY-MM-DD HH:mm");
                        const modules = getModulesForRecord(item);
                        return (
                            <TouchableOpacity
                                style={styles.historyCard}
                                onPress={() => handleSelectRecord(item)}
                            >
                                <Text style={styles.timeText}>{createdAtString}</Text>
                                <View style={styles.modulesRow}>
                                    {modules.map((mod) => (
                                        <View
                                            key={mod}
                                            style={[
                                                styles.moduleButton,
                                                { backgroundColor: moduleColors[mod] }
                                            ]}
                                        >
                                            <Text style={styles.moduleText}>{mod}</Text>
                                        </View>
                                    ))}
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>暂无历史记录</Text>
                    }
                />
            )}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>返回</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F8FF',
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#1C5B83",
        textAlign: "center",
        marginVertical: 16,
    },
    historyCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    timeText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 8,
    },
    modulesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    moduleButton: {
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 8,
        marginTop: 5,
    },
    moduleText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        color: '#aaa',
        marginTop: 50,
    },
    backButton: {
        position: "absolute",
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: '#1C5B83',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
    },

});

export default ChildHistory;
