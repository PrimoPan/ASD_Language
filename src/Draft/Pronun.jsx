import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import useStore from "../store/store.jsx";
import { gptQuery } from "../utils/api";

const Pronun = () => {
    const { name } = useStore(state => state.currentChildren);
    const { learningGoals } = useStore();

    const [loading, setLoading] = useState(false);
    const [planContent, setPlanContent] = useState('');
    const [editing, setEditing] = useState(false);
    const [editableContent, setEditableContent] = useState('');

    useEffect(() => {
        console.log("Pronun", name);
        console.log("Goals", learningGoals);
    }, []);

    // 处理卡片素材字符串
    const cardsContent = learningGoals?.构音?.cards
        ?.map(card => card.word)
        ?.join(', ');

    const fetchTeachingPlan = async () => {
        const prompt = `这是构音阶段的教学内容生成模块：请你给出完整的教学计划，保证是一段可以直接包裹在包裹在我写的Text组件内的React Native的字符串，使用反斜杠n来换行。不要在返回内容里出现Text、jsx等无关内容（因为返回内容是一段字符串，会被直接包裹在text中）。大概300汉字字左右，用词尽量专业。你是一个中国孤独症教育专家，现在要对孤独症儿童进行某一个拼音辅音的教学。你的教学场景是：${learningGoals?.主题场景?.major} - ${learningGoals?.主题场景?.activity}，你教学的目标是：${learningGoals?.构音?.teachingGoal}，你需要教学的词语有：${cardsContent}，请你生成一个具体的教学步骤，能将这些词语和场景进行串联，给出大概150字的教学计划，直接给出内容，不需要其他任何多余回答！`;
        setLoading(true);
        try {
            const result = await gptQuery(prompt);
            setPlanContent(result);
            setEditableContent(result);
        } catch (error) {
            console.error('Error fetching teaching plan:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* 左侧内容区域 */}
            <View style={styles.leftContainer}>
                <Text style={styles.mainTitle}>构音教学草稿</Text>
                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>教学场景: </Text>
                        <Text style={styles.infoValue}>
                            {learningGoals?.主题场景?.major} - {learningGoals?.主题场景?.activity}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>教学目标: </Text>
                        <Text style={styles.infoValue}>
                            {learningGoals?.构音?.teachingGoal}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>卡片素材: </Text>
                        <Text style={styles.infoValue}>{cardsContent}</Text>
                    </View>

                    {/* 关键：固定高度或最大高度，让它不会无限撑开 */}
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
                </View>
            </View>

            {/* 右侧内容区域 */}
            <View style={styles.rightContainer}>
                <TouchableOpacity style={styles.fetchButton} onPress={fetchTeachingPlan}>
                    <Text style={styles.fetchButtonText}>
                        {planContent ? '生成教学计划' : '获取教学计划'}
                    </Text>
                </TouchableOpacity>

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    planContent !== '' && (
                        <View style={styles.planContainer}>
                            {editing ? (
                                <TextInput
                                    style={styles.editableText}
                                    multiline
                                    scrollEnabled
                                    value={editableContent}
                                    onChangeText={text => setEditableContent(text)}
                                />
                            ) : (
                                <ScrollView style={styles.scrollContent}>
                                    <Text style={styles.planText}>{planContent}</Text>
                                </ScrollView>
                            )}

                            <TouchableOpacity
                                style={styles.editButtonWrapper}
                                onPress={() => {
                                    if (editing) {
                                        setPlanContent(editableContent);
                                    }
                                    setEditing(!editing);
                                }}
                            >
                                <Text style={styles.editButtonText}>
                                    {editing ? '完成' : '编辑'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        maxWidth: 1029,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'flex-start',
    },
    leftContainer: {
        width: '50%',
        paddingRight: '3%',
    },
    rightContainer: {
        width: '50%',
        alignItems: 'center',
    },
    mainTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1C5B83',
        marginBottom: 20,
        textAlign: 'center',
    },
    infoContainer: {
        alignSelf: 'flex-start',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 10,
    },
    infoLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1C5B83',
    },
    infoValue: {
        fontSize: 18,
        color: '#1C5B83',
        flexShrink: 1,
        flexWrap: 'wrap',
    },
    fetchButton: {
        backgroundColor: '#1C5B83',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 20,
    },
    fetchButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    planContainer: {
        position: 'relative',
        width: '90%',
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        height: 300,
        overflow: 'hidden',
    },
    scrollContent: {
        padding: 10,
    },
    planText: {
        fontSize: 18,
        color: '#333',
    },
    editableText: {
        fontSize: 18,
        color: '#333',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        textAlignVertical: 'top',
        height: 300,
    },
    editButtonWrapper: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
    },
    editButtonText: {
        fontSize: 16,
        color: '#007BFF',
    },

    /* 下面是与图片相关的样式 */
    imageScrollContainer: {
        // 固定高度或最大高度，这里示例200 + 一些margin
        marginTop: 10,
        height: 220, // 你需要多高可自行调整
        // 如果想要更灵活，可用 maxHeight: 220, 并加 overflow: "hidden"
    },
    imageCard: {
        position: 'relative',
        width: 200,
        height: 200,
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

export default Pronun;
