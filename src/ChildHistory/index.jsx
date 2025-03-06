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
import dayjs from "dayjs";  // 用于格式化日期
import useStore from "../store/store";

// 模块与颜色映射
const moduleColors = {
    "构音": "#44DCF8",
    "命名": "#FCC40B",
    "语言结构": "#FF7A69",
    "对话": "#0ED89E",
};

const ChildHistory = () => {
    // 从路由参数中拿到 childName
    const route = useRoute();
    const { childName } = route.params;  // 在跳转时: navigation.navigate("ChildHistory", { childName: "xxx" })
    const navigation = useNavigation();

    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLearningHistory();
    }, []);

    const fetchLearningHistory = async () => {
        try {
            setLoading(true);
            const res = await getLearningHistoryForChild(childName);
            setHistoryList(res.data || []);
        } catch (error) {
            console.error("❌ 获取学习历史失败", error);
            Alert.alert("错误", "无法获取学习历史");
        } finally {
            setLoading(false);
        }
    };

    // 判断 record 是否存在某模块
    // record.构音 / record.命名 / record.语言结构 / record.对话
    // 只要 record.构音 不为 undefined/null，认为有该模块
    const getModulesForRecord = (record) => {
        const modules = [];
        if (record.构音) modules.push("构音");
        if (record.命名) modules.push("命名");
        if (record.语言结构) modules.push("语言结构");
        if (record.对话) modules.push("对话");
        return modules;
    };

    // 渲染单条历史
    const renderHistoryItem = ({ item }) => {
        // item = 每次教学记录, e.g. { 构音: {...}, 命名: {...}, createdAt: ... }
        const createdAtString = dayjs(item.createdAt).format("YYYY-MM-DD HH:mm");
        const modules = getModulesForRecord(item);

        return (
            <View style={styles.historyCard}>
                {/* 时间显示 */}
                <Text style={styles.timeText}>{createdAtString}</Text>

                {/* 渲染本次课程涉及到的模块 */}
                <View style={styles.modulesRow}>
                    {modules.map((mod) => (
                        <View
                            key={mod}
                            style={[styles.moduleButton, { backgroundColor: moduleColors[mod] || "#ccc" }]}
                        >
                            <Text style={styles.moduleText}>{mod}</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{childName} 的学习历史</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#1C5B83" />
            ) : (
                <FlatList
                    data={historyList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderHistoryItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={<Text style={styles.emptyText}>暂无历史记录</Text>}
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

export default ChildHistory;

// ========== 样式表 ==========

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F8FF",
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
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 16,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    timeText: {
        fontSize: 14,
        color: "#555",
        marginBottom: 10,
    },
    modulesRow: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    moduleButton: {
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginRight: 10,
        marginBottom: 10,
    },
    moduleText: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "bold",
    },
    emptyText: {
        textAlign: "center",
        color: "#aaa",
        marginTop: 50,
    },
    backButton: {
        position: "absolute",
        bottom: 30,
        right: 30,
        backgroundColor: "#1C5B83",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    backButtonText: {
        color: "#fff",
        fontSize: 16,
    },
});
