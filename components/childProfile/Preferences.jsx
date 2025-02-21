import React from 'react';
import {View, Text, Image, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import useStore from '../../SourceCode/store/store';
import {generateImage} from "../../SourceCode/utils/api";
import {renderIntoDocument} from "react-dom/test-utils";


const Preferences = () => {
  const { currentChildren } = useStore();
  const { reinforcements = [], imageStyle } = currentChildren || {};
  const [loadingMap, setLoadingMap] = React.useState({});

  // 处理图片生成
  const handleGenerateImages = async () => {
    try {
      // 过滤需要生成的项
      const needGenerate = reinforcements.filter(item => !item.image);
      if (needGenerate.length === 0) return;

      // 设置加载状态
      setLoadingMap(prev => ({
        ...prev,
        ...needGenerate.reduce((acc, item) => {
          acc[item.id] = true;
          return acc;
        }, {})
      }));

const generatePrompt = (itemValue, style) => {
  return `[教学专用]${style === 'realistic' ? '写实' : '卡通'}风格插画，主体为${itemValue}，
          用于自闭症儿童认知训练，要求：
          1. 空白纯色背景
          2. 无人物出现（必要情况需中国面孔）
          3. 线条简洁明确
          4. 色彩对比度高
          5. 避免复杂纹理
          6. 主体占画面70%以上
          7. 无文字/装饰元素
          风格参考：早期干预教具插图`;
};


      // 生成图片并更新状态
      const updated = await Promise.all(
          needGenerate.map(async (item) => {
            try {
              const prompt = generatePrompt(item.value, imageStyle);
              const imageUrl = await generateImage(prompt);
              if (imageUrl==='0')
                return item;
              return { ...item, image: imageUrl };
            } catch (error) {
              console.error('生成失败:', item.value, error);
              return item;
            }
          })
      );

      // 合并更新后的数据
      const merged = reinforcements.map(item =>
          updated.find(u => u.id === item.id) || item
      );

      // 更新zustand
      useStore.getState().setCurrentChildren({
        ...currentChildren,
        reinforcements: merged
      });

    } catch (error) {
      console.error('批量生成失败:', error);
    } finally {
      setLoadingMap({});
    }
  };

  React.useEffect(() => {
    if (reinforcements?.length > 0) {
      handleGenerateImages();
    }
  }, [reinforcements, imageStyle]);

  // 渲染单个强化物项
  const renderItem = ({ item }) => {
    const isLoading = loadingMap[item.id];

    return (
        <View style={styles.preferenceItem}>
          {isLoading ? (
              <View style={[styles.preferenceImage, styles.loadingPlaceholder]}>
                <ActivityIndicator color="#1C5B83" />
              </View>
          ) : (
              <Image
                  source={{ uri: item.image }}
                  style={styles.preferenceImage}
                  resizeMode="contain"
              />
          )}
          <Text style={styles.preferenceName}>{item.value}</Text>
        </View>
    );
  };

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>强化物偏好</Text>
          <View style={styles.categories}>
            <Image
                source={{
                  uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/ad43c22268b62846ee7aeb797a0018af60acc0b70c49dee5711449ac589a2061?placeholderIfAbsent=true&apiKey=248c3eeefc164ad3bce1d814c47652e0',
                }}
                style={styles.categoryImage}
                resizeMode="contain"
            />
          </View>
        </View>
        <FlatList
            data={reinforcements}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={styles.row}
            ListEmptyComponent={<Text style={styles.emptyText}>暂无强化物数据</Text>}
        />
      </View>
  );
};




const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F8FF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingPlaceholder: {
    backgroundColor: '#e1e9f0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C5B83',
  },
  categories: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    paddingVertical: 4,
    paddingHorizontal: 21,
    marginRight: 6,
    fontSize: 13,
    color: '#000000',
  },
  categoryImage: {
    width: 80,
    height: 27,
  },
  row: {
    justifyContent: 'space-between',
  },
  preferenceItem: {
    alignItems: 'center',
    marginBottom: 20,
  },
  preferenceImage: {
    width: 123,
    height: 123,
    marginBottom: 6,
  },
  preferenceName: {
    fontSize: 15,
    color: '#257693',
    textAlign: 'center',
  },
});

export default Preferences;
