import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import useStore from "../store/store";
import { gptQuery, generateImage } from '../utils/api'; // 导入你之前实现的gptQuery接口和generateImage接口

const PronunciationModule = ({ selectedModule, navigation }) => {
    const pinyinGroupsByStage = [
        ['b', 'm', 'd', 'h','p', 't', 'g', 'k', 'n','f', 'j', 'q', 'x','l', 'z', 's', 'r','c', 'zh', 'ch', 'sh']
    ];
    const Goals = useStore(state => state.learningGoals);
    const pinyinnow = Goals.命名; // 从 Goals 中获取本次学习的韵母
    const [teachingGoal, setTeachingGoal] = useState(""); // 存储从 GPT 获取的教学目标
    const [words, setWords] = useState([]); // 存储从 GPT 获取的中文单词及拼音
    const [imageUrls, setImageUrls] = useState([]); // 存储生成的图片 URL
    const [loadingStates, setLoadingStates] = useState([]); // 控制每个单词的加载状态
    const [modalVisible, setModalVisible] = useState(false); // 控制放大图片的 Modal
    const [selectedImage, setSelectedImage] = useState(null); // 存储选中的图片 URL
    const [regenerateModalVisible, setRegenerateModalVisible] = useState(false); // 控制重新生成图片的 Modal
    const [userFeedback, setUserFeedback] = useState(""); // 存储用户输入的改进意见
    let pinyin = null;

    for (let initial of pinyinGroupsByStage[0]) {
        if (!pinyinnow.includes(initial)) {
            pinyin = initial;
            break; // Stop once the first unmatched pinyin is found
        }
    }
    // 加载时保存状态
    useEffect(() => {
        const loadSavedData = async () => {
            // 加载本地或持久化存储的状态数据（如果有的话）
            const savedTeachingGoal = await AsyncStorage.getItem("teachingGoal");
            const savedWords = await AsyncStorage.getItem("words");
            const savedImageUrls = await AsyncStorage.getItem("imageUrls");

            if (savedTeachingGoal) setTeachingGoal(savedTeachingGoal);
            if (savedWords) setWords(JSON.parse(savedWords));
            if (savedImageUrls) setImageUrls(JSON.parse(savedImageUrls));
        };

        loadSavedData();
    }, []);

    // 保存状态
    useEffect(() => {
        const saveData = async () => {
            // 将当前状态保存到本地或持久化存储
            await AsyncStorage.setItem("teachingGoal", teachingGoal);
            await AsyncStorage.setItem("words", JSON.stringify(words));
            await AsyncStorage.setItem("imageUrls", JSON.stringify(imageUrls));
        };

        saveData();
    }, [teachingGoal, words, imageUrls]);

    // 向 GPT 请求教学目标
    const fetchTeachingGoal = async () => {
        try {
            const prompt = `(给出的答案不需要出现<>等标题,假设你是一个中文自闭症语言教学专家，现在根据我给出的这个辅音，请你给我生成一个本次教学的教学目标，注意是教学目标，不是具体单词：${pinyin}`;
            const result = await gptQuery(prompt); // 使用 gptQuery 接口请求教学目标
            setTeachingGoal(result);
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    // 向 GPT 请求生成适用于场景教学的中文单词及拼音
    const fetchTeachingWords = async () => {
        try {
            const prompt = `请一定使用带有${pinyin}辅音的拼音。我们的教学场景是${Goals?.主题场景?.major},${Goals?.主题场景?.activity}。所以你接下来生成的词语一定要和之前这些场景有关。具体场景是每次生成的答案不允许与上次一样。直接给我一个以{}包裹的对象，字符串形式，不需要json格式，里面只包含4个词语（注意是词语，要与孩子的日常生活相关），给出如下几个辅音：${pinyin},现在根据我给出的这几个辅音，生成4个适用于场景教学的中文单词，并给出拼音,每个单词的格式是词语（拼音），以,分割`;
            const result = await gptQuery(prompt); // 使用 gptQuery 接口请求中文单词

            // 修复第一个单词的格式问题，并将返回的字符串按逗号分割
            const wordArray = result.split(',').map(item => {
                // 移除可能存在的花括号并处理格式
                item = item.replace(/[{}]/g, '').trim(); // 去掉花括号并去除前后空格
                const match = item.match(/(.+?)\s?\(([^)]+)\)/);
                if (match) {
                    const [word, pinyin] = match.slice(1);
                    return { word, pinyin };
                }
                return null;
            }).filter(Boolean);

            setWords(wordArray); // 将分割后的单词数组存储到 state 中
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    // 调用生成图片接口
    const generateWordImage = async (word, index) => {
        setLoadingStates(prevStates => {
            const newStates = [...prevStates];
            newStates[index] = true; // 设置当前单词加载状态为true
            return newStates;
        });

        try {
            const imageUrl = await generateImage(word); // 生成词语的图片
            setImageUrls(prevUrls => {
                const updatedUrls = [...prevUrls];
                updatedUrls[index] = imageUrl; // 更新对应单词的图片
                return updatedUrls;
            });
        } catch (error) {
            Alert.alert("Error", "生成图片失败");
        } finally {
            setLoadingStates(prevStates => {
                const newStates = [...prevStates];
                newStates[index] = false; // 设置当前单词加载状态为false
                return newStates;
            });
        }
    };

    // 重新生成图片
    const regenerateImage = (word, index) => {
        setSelectedImage(imageUrls[index]);
        setRegenerateModalVisible(true); // 显示重新生成图片的Modal
    };

    // 提交用户反馈并生成新的图片
    const submitFeedbackAndGenerateImage = async (word, index) => {
        setRegenerateModalVisible(false); // 关闭重新生成图片的Modal
        setLoadingStates(prevStates => {
            const newStates = [...prevStates];
            newStates[index] = true; // 设置当前单词加载状态为true
            return newStates;
        });

        try {
            const promptWithFeedback = `${userFeedback}。原始提示：生成词语"${word}"的图片。`; // 将用户输入的反馈合并到原始prompt前
            const imageUrl = await generateImage(promptWithFeedback); // 使用带反馈的prompt生成图片
            setImageUrls(prevUrls => {
                const updatedUrls = [...prevUrls];
                updatedUrls[index] = imageUrl; // 更新对应单词的图片
                return updatedUrls;
            });
        } catch (error) {
            Alert.alert("Error", "重新生成图片失败");
        } finally {
            setLoadingStates(prevStates => {
                const newStates = [...prevStates];
                newStates[index] = false; // 设置当前单词加载状态为false
                return newStates;
            });
        }
    };

    // 显示放大图片
    const showImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalVisible(true);
    };

    // 渲染按钮
    const renderButtons = () => {
        return words.map((word, index) => (
            <View key={index} style={styles.wordContainer}>
                <Text style={styles.wordText}>{`${word.word} (${word.pinyin})`}</Text>
                <TouchableOpacity style={styles.button} onPress={() => generateWordImage(word.word, index)}>
                    <Text style={styles.buttonText}>生成图片</Text>
                </TouchableOpacity>

                {/* 显示对应单词的图片 */}
                {imageUrls[index] && (
                    <View style={styles.imageContainer}>
                        <TouchableOpacity onPress={() => showImageModal(imageUrls[index])}>
                            <Image source={{ uri: imageUrls[index] }} style={styles.image} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.regenerateButton]}
                            onPress={() => regenerateImage(word.word, index)}
                        >
                            <Text style={styles.buttonText}>重新生成图片</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* 显示加载状态 */}
                {loadingStates[index] && (
                    <Text style={styles.loadingText}>正在加载图片...</Text>
                )}
            </View>
        ));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>构音教学目标</Text>

            {/* 生成教学目标的按钮 */}
            <TouchableOpacity style={styles.button} onPress={fetchTeachingGoal}>
                <Text style={styles.buttonText}>生成教学目标</Text>
            </TouchableOpacity>

            <View style={styles.moduleContainer}>
                <Text style={styles.objectiveTitle}>本次学习的声母: {pinyin}</Text>
                <Text style={styles.objectiveText}>
                    {teachingGoal}
                </Text>
            </View>

            {/* 生成本次教学单词的按钮 */}
            <TouchableOpacity style={styles.button} onPress={fetchTeachingWords}>
                <Text style={styles.buttonText}>生成本次教学单词</Text>
            </TouchableOpacity>

            {/* 渲染词语和生成图片按钮 */}
            <View style={styles.wordsContainer}>
                {renderButtons()}
            </View>

            {/* Modal 用于展示放大的图片 */}
            {modalVisible && (
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                    supportedOrientations={['landscape']} // 限制为横屏模式
                >
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalCloseText}>关闭</Text>
                        </TouchableOpacity>
                        <Image source={{ uri: selectedImage }} style={styles.modalImage} />
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: '57%',
        backgroundColor: 'white',
        borderRadius: 40,
        position: 'absolute',
        top: '30%',
        left: '5%',
        padding: 10,  // 使容器内部有间距
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1C5B83',
        textAlign: 'center',
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#39B8FF',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
    },
    wordContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginHorizontal: 10, // 控制按钮之间的间距
        marginBottom: 2,
    },
    wordText: {
        fontSize: 12,
        color: '#1C5B83',
        textAlign: 'center',
        marginTop: 5,
    },
    regenerateButton: {
        backgroundColor: '#FF5733', // 重新生成按钮的颜色
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 5,
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 10,
        borderRadius: 8,
    },
    modalContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalImage: {
        width: 300,
        height: 300,
        borderRadius: 8,
    },
    modalCloseButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#FF5733',
        padding: 10,
        borderRadius: 5,
    },
    modalCloseText: {
        color: '#fff',
        fontSize: 16,
    },
    loadingText: {
        fontSize: 14,
        color: '#FF5733',
    },
    moduleContainer: {
        width: '100%',
        padding: 20,
        marginTop: 10,
        backgroundColor: 'rgba(57, 184, 255, 0.1)',
        borderRadius: 10,
        alignItems: 'center',
    },
    objectiveTitle: {
        fontSize: 20,
        color: '#1C5B83',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    objectiveText: {
        paddingVertical: 6,
        paddingHorizontal: 13,
        fontSize: 16,
        fontWeight: '500',
        color: 'rgba(28, 91, 131, 1)',
    },
    wordsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
    },
});

export default PronunciationModule;
