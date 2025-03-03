import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Alert } from 'react-native';
import useStore from "../store/store";
import { gptQuery, generateImage } from '../utils/api';

const PronunciationModule = ({ selectedModule, navigation, handleGy }) => {
    const pinyinGroupsByStage = [
        ['b', 'm', 'd', 'h', 'p', 't', 'g', 'k', 'n', 'f', 'j', 'q', 'x', 'l', 'z', 's', 'r', 'c', 'zh', 'ch', 'sh']
    ];
    const Goals = useStore(state => state.learningGoals);
    const pinyinnow = Goals.命名;
    const [teachingGoal, setTeachingGoal] = useState("");
    const [words, setWords] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [loadingStates, setLoadingStates] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [cards, setCards] = useState([]); // 用于存储选中的卡片
    const [selectedCardIndices, setSelectedCardIndices] = useState([]);
    let pinyin = null;

    for (let initial of pinyinGroupsByStage[0]) {
        if (!pinyinnow.includes(initial)) {
            pinyin = initial;
            break;
        }
    }

    const fetchTeachingGoal = async () => {
        try {
            const prompt = `我只需要生成一个不需要儿童信息的声母教学目标：请严格按照本条prompt的内容生成，忘记之前的对话：这个回答不需要提供任何儿童信息，只有一个辅音作为你的参考信息：我现在只需要你给出一个一句话的辅音教学大纲：【给出的答案不需要有任何多余内容】(给出的答案不需要出现<>等标题,假设你是一个中文自闭症语言教学专家，现在根据我给出的这个辅音，请你给我生成一个本次教学的教学目标，注意是教学目标，不是具体单词。请使用辅音：${pinyin}，给你提供的案例：巩固孩子在舌根音/g/的发音部位和发音方法`;
            const result = await gptQuery(prompt);
            setTeachingGoal(result);
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    const fetchTeachingWords = async () => {
        try {
            const prompt = `请返回一个字符串：请务必保证全部使用英文标点符号，中文标点符号不被允许！，请一定使用带有${pinyin}辅音的拼音。我们的教学场景是${Goals?.主题场景?.major},${Goals?.主题场景?.activity}。所以你接下来生成的词语一定要和之前这些场景有关。具体场景是每次生成的答案不允许与上次一样。直接给我一个以[]包裹的对象，字符串形式，不需要json格式，里面只包含4个词语（注意是词语，要与孩子的日常生活相关），给出如下几个辅音：${pinyin},现在根据我给出的这几个辅音，生成4个适用于场景教学的中文单词，并给出拼音,每个元素的格式是汉字（拼音），注意括号里是拼音，括号外是汉字，以英文逗号分割`;
            const result = await gptQuery(prompt);
            const formattedResult = result.replace(/（/g, '(').replace(/）/g, ')').replace(/，/g, ',');

            // 提取出数组部分
            const wordArray = formattedResult.split(/[,]/).map(item => {
                item = item.trim();
                const match = item.match(/(.+?)\s?\(([^)]+)\)/);
                if (match) {
                    const [word, pinyin] = match.slice(1);
                    return { word, pinyin };
                }
                return null;
            }).filter(Boolean);

            console.log('wordArray', wordArray);
            setWords(wordArray);
            setCards([]); // 清空选中的卡片
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };


    const generateWordImage = async (word, index) => {
        setLoadingStates(prevStates => {
            const newStates = [...prevStates];
            newStates[index] = true;
            return newStates;
        });

        try {
            const prompt = `A learning card illustration for autism spectrum children's cognitive training. Requirements:1. Core element:A large and prominent ${word} occupying 70% of the image area, visually explicit for low cognitive ability recognition 2. Style:Flat vector illustration with thick black outlines 3. Color scheme:High-contrast combination of maximum 3 colors (recommended yellow/blue/white)4.Background:Solid light gray or beige without any patterns/gradients5.Forbidden elements:Absolutely no text,human figures or facial features6.Detail handling:Smooth rounded edges without sharp corners`;
            const imageUrl = await generateImage(prompt);
            setImageUrls(prevUrls => {
                const updatedUrls = [...prevUrls];
                updatedUrls[index] = imageUrl;
                return updatedUrls;
            });
        } catch (error) {
            Alert.alert("Error", "生成图片失败");
        } finally {
            setLoadingStates(prevStates => {
                const newStates = [...prevStates];
                newStates[index] = false;
                return newStates;
            });
        }
    };

    const showImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalVisible(true);
    };
    useEffect(()=>{
        console.log('cards:',cards);
        let 构音={cards,teachingGoal, fy: pinyin};
        handleGy(构音);
    },[cards,teachingGoal]);
    const handleSelectCard = (index) => {
        const wordItem = words[index];
        const imageUrl = imageUrls[index];

        if (!wordItem || !imageUrl) return;

        setCards(prevCards => {
            const existingIndex = prevCards.findIndex(card => card.word === wordItem.word);
            if (existingIndex !== -1) {
                // 如果已选中，移除该卡片
                const updatedCards = [...prevCards];
                updatedCards.splice(existingIndex, 1);  // 删除该卡片
                return updatedCards;
            } else {
                // 如果未选中，添加该卡片
                return [...prevCards, { word: wordItem.word, pinyin: wordItem.pinyin, image: imageUrl }];
            }
        });

        // 更新选中状态
        setSelectedCardIndices(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)  // 如果已选中，移除索引
                : [...prev, index]  // 如果未选中，添加索引
        );
    };
    const renderButtons = () => {
        return words.map((word, index) => (
            <View key={index} style={styles.wordContainer}>
                <Text style={styles.wordText}>{`${word.word} (${word.pinyin})`}</Text>
                <TouchableOpacity style={styles.button} onPress={() => generateWordImage(word.word, index)}>
                    <Text style={styles.buttonText}>生成图片</Text>
                </TouchableOpacity>

                {imageUrls[index] && (
                    <View style={styles.imageContainer}>
                        <TouchableOpacity onPress={() => showImageModal(imageUrls[index])}>
                            <Image source={{ uri: imageUrls[index] }} style={styles.image} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                // 修正判斷條件為基於選中狀態數組 (正確實現)
                                selectedCardIndices.includes(index) && styles.selectedBackground
                            ]}
                            onPress={() => handleSelectCard(index)}
                        >
                            <Text style={styles.buttonText}>选择该元素</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {loadingStates[index] && (
                    <Text style={styles.loadingText}>正在加载图片...</Text>
                )}
            </View>
        ));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>构音教学目标</Text>

            <TouchableOpacity style={styles.button} onPress={fetchTeachingGoal}>
                <Text style={styles.buttonText}>生成教学目标</Text>
            </TouchableOpacity>

            <View style={styles.moduleContainer}>
                <Text style={styles.objectiveTitle}>本次学习的声母: {pinyin}</Text>
                <Text style={styles.objectiveText}>
                    {teachingGoal}
                </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={fetchTeachingWords}>
                <Text style={styles.buttonText}>生成本次教学单词</Text>
            </TouchableOpacity>

            <View style={styles.wordsContainer}>
                {renderButtons()}
            </View>

            {modalVisible && (
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                    supportedOrientations={['landscape']}
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
    selectedBackground:{
        backgroundColor:'red',
        borderColor:'#1890FF',
        borderWidth:2,
    },
});

export default PronunciationModule;
