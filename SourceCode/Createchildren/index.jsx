import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';

import useStore from '../store/store';
import { useNavigation } from '@react-navigation/native';
import PinyinSelector from '../Components/PinyinSelector';

const CreateChildren = () => {
  const navigation = useNavigation();
  const currentChildren = useStore((state) => state.currentChildren);
  const setCurrentChildren = useStore((state) => state.setCurrentChildren);

  // 初始化表单状态，使用 store 中的数据（如果有）
  const [name, setName] = useState(currentChildren?.name || '');
  const [age, setAge] = useState(currentChildren?.age || '');
  const [gender, setGender] = useState(currentChildren?.gender || '');
  const [courseDuration, setCourseDuration] = useState(
      currentChildren?.courseDuration || ''
  );

  const [reinforcements, setReinforcements] = useState(
      currentChildren?.reinforcements || []
  );
  const [naming, setNaming] = useState(currentChildren?.['命名'] || '');
  const [languageStructure, setLanguageStructure] = useState(
      currentChildren?.['语言结构'] || ''
  );
  const [dialogue, setDialogue] = useState(currentChildren?.['对话'] || '');
  const [selectedInitials, setSelectedInitials] = useState(
      currentChildren?.selectedInitials || []
  );

  // 添加强化物
  const addReinforcement = () => {
    setReinforcements([...reinforcements, { id: Date.now(), value: '' }]);
  };

  const removeReinforcement = (id) => {
    setReinforcements(reinforcements.filter((item) => item.id !== id));
  };

  const updateReinforcement = (id, value) => {
    const updated = reinforcements.map((item) => {
      if (item.id === id) {
        return { ...item, value };
      }
      return item;
    });
    setReinforcements(updated);
  };

  const handleSubmit = () => {
    const formData = {
      name,
      age,
      gender,
      courseDuration,
      reinforcements,
      '命名': naming,
      '语言结构': languageStructure,
      '对话': dialogue,
      selectedInitials,
    };

    Alert.alert('提交成功', JSON.stringify(formData, null, 2));
    setCurrentChildren(formData); // 更新 store
    navigation.replace('LearningMode'); // 跳转到 LearningMode 页面
  };

  const isSubmitDisabled = !name || !age || !gender || !courseDuration;

  return (
      <View style={styles.container}>
        {/* 左侧：个人信息 & 强化物 */}
        <View style={styles.leftColumn}>
          <View style={styles.card}>
            <Text style={styles.cardHeader}>个人信息</Text>
            <View style={styles.row}>
              <TextInput
                  placeholder="姓名"
                  value={name}
                  onChangeText={setName}
                  style={[styles.input, { flex: 1, marginRight: 10 }]}
              />
              <TextInput
                  placeholder="年龄"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  style={[styles.input, { flex: 1 }]}
              />
            </View>
            <View style={styles.row}>
              <Text style={[styles.label, { marginRight: 5 }]}>性别:</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() => setGender('male')}
                >
                  <View style={styles.radioCircle}>
                    {gender === 'male' && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>男</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() => setGender('female')}
                >
                  <View style={styles.radioCircle}>
                    {gender === 'female' && <View style={styles.radioSelected} />}
                  </View>
                  <Text style={styles.radioLabel}>女</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                  placeholder="课程周期"
                  value={courseDuration}
                  onChangeText={setCourseDuration}
                  style={[styles.input, { flex: 1, marginLeft: 10 }]}
              />
            </View>
          </View>
          <View style={[styles.card, { marginTop: 20 }]}>
            <Text style={styles.cardHeader}>强化物</Text>
            {reinforcements.map((item) => (
                <View key={item.id} style={[styles.row, { marginBottom: 10 }]}>
                  <TextInput
                      placeholder="输入强化物"
                      value={item.value}
                      onChangeText={(val) => updateReinforcement(item.id, val)}
                      style={[styles.input, { flex: 1, marginRight: 10 }]}
                  />
                  <TouchableOpacity
                      style={[styles.deleteButton]}
                      onPress={() => removeReinforcement(item.id)}
                  >
                    <Text style={styles.deleteButtonText}>删除</Text>
                  </TouchableOpacity>
                </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={addReinforcement}>
              <Text style={styles.addButtonText}>添加强化物</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 右侧：里程碑 + 声母选择 */}
        <View style={styles.rightColumn}>
          <View style={styles.card}>
            <Text style={styles.cardHeader}>里程碑记录</Text>
            <Text style={[styles.label, { marginTop: 10 }]}>命名</Text>
            <TextInput
                placeholder="请输入数值"
                value={naming}
                onChangeText={setNaming}
                style={[styles.input, { width: '40%' }]}
                keyboardType="numeric"
            />
            <Text style={[styles.label, { marginTop: 10 }]}>语言结构</Text>
            <TextInput
                placeholder="请输入数值"
                value={languageStructure}
                onChangeText={setLanguageStructure}
                style={[styles.input, { width: '40%' }]}
                keyboardType="numeric"
            />
            <Text style={[styles.label, { marginTop: 10 }]}>对话</Text>
            <TextInput
                placeholder="请输入数值"
                value={dialogue}
                onChangeText={setDialogue}
                style={[styles.input, { width: '40%' }]}
                keyboardType="numeric"
            />
          </View>
          <View style={[styles.card, { marginTop: 20 }]}>
            <Text style={styles.cardHeader}>需要学习的生母（最多选3）</Text>
            <PinyinSelector
                selectedInitials={selectedInitials}
                onSelectedInitialsChange={setSelectedInitials}
                maxCount={3}
            />
          </View>
        </View>

        {/* 提交按钮 */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitDisabled && styles.submitButtonDisabled,
              ]}
              onPress={!isSubmitDisabled ? handleSubmit : null}
          >
            <Text style={styles.submitText}>提 交</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
};

export default CreateChildren;


// ============= 样式表（可与之前相同） ===========
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    padding: 20,
  },
  leftColumn: {
    flex: 0.5,
    paddingHorizontal: 10,
  },
  rightColumn: {
    flex: 0.5,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginVertical: 8,
    height: 40,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  radioGroup: {
    flexDirection: 'row',
    marginLeft: 10,
    flex: 1,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2196F3',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#27ae60',
    borderRadius: 6,
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  deleteButtonText: {
    color: '#fff',
  },
  submitContainer: {
    position: 'absolute',
    bottom: 20,
    left: screenWidth / 2 - 60,
    width: 120,
  },
  submitButton: {
    backgroundColor: '#2980b9',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
