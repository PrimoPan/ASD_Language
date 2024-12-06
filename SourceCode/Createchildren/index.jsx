// CreateChildren.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import VbMapp from '../Components/VbMapp'; // 确保路径正确

const CreateChildren = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [reinforcements, setReinforcements] = useState([]);
  const [milestones, setMilestones] = useState([
    Array(15).fill(false), // 词汇
    Array(15).fill(false), // 命名
    Array(10).fill(false), // 语言结构
    Array(10).fill(false)  // 对话
  ]);

  const addReinforcement = () => {
    setReinforcements([...reinforcements, { id: Date.now(), value: '' }]);
  };

  const removeReinforcement = (id) => {
    setReinforcements(reinforcements.filter(item => item.id !== id));
  };

  const updateReinforcement = (id, value) => {
    const updatedReinforcements = reinforcements.map(item => {
      if (item.id === id) {
        return { ...item, value };
      }
      return item;
    });
    setReinforcements(updatedReinforcements);
  };

  /**
   * 更新里程碑状态，并接收列索引和里程碑索引
   * @param {number} col - 列索引
   * @param {number} dataIndex - 里程碑索引
   */
  const toggleMilestone = (col, dataIndex) => {
    let newMilestones = milestones.map(column => [...column]); // 深拷贝

    // 将点击列的所有里程碑设为false
    newMilestones[col].fill(false);

    // 将从底部（索引0）到 dataIndex 的里程碑设为true
    for (let i = 0; i <= dataIndex; i++) {
      newMilestones[col][i] = true;
    }

    setMilestones(newMilestones);

    // 记录点击的列和里程碑
    console.log(`列索引: ${col}, 里程碑索引: ${dataIndex}`);
    Alert.alert(`点击事件`, `列 ${col + 1}, 里程碑 ${dataIndex + 1} 被点击`);
  };

  const milestoneColors = ['#44DCF8', '#FCC40B', '#FF7A69', '#0ED89E'];

  const handleSubmit = () => {
    const formData = {
      name,
      age,
      gender,
      courseDuration,
      reinforcements,
      milestones
    };
    console.log('提交的数据:', formData);
    Alert.alert('提交成功', JSON.stringify(formData, null, 2));
  };

  return (
      <View style={styles.container}>
        {/* 左侧区域 */}
        <View style={styles.leftContainer}>
          {/* 上半部分 */}
          <View style={styles.inputGroup}>
            <View style={styles.row}>
              <TextInput
                  placeholder="姓名"
                  value={name}
                  onChangeText={setName}
                  style={[styles.input, { flex: 1, marginRight: 10 }]} // 姓名
              />
              <TextInput
                  placeholder="年龄"
                  value={age}
                  onChangeText={setAge}
                  style={[styles.input, { flex: 1 }]} // 年龄
                  keyboardType="numeric"
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>性别:</Text>
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
                  style={[styles.input, { flex: 1, marginLeft: 10 }]} // 课程周期
              />
            </View>
          </View>

          {/* 下半部分 */}
          <View style={styles.reinforcements}>
            {reinforcements.map((reinforcement) => (
                <View key={reinforcement.id} style={styles.reinforcementItem}>
                  <TextInput
                      placeholder="输入强化物"
                      value={reinforcement.value}
                      onChangeText={(text) => updateReinforcement(reinforcement.id, text)}
                      style={[styles.input, { flex: 1, marginRight: 10 }]}
                  />
                  <Button title="删除" onPress={() => removeReinforcement(reinforcement.id)} />
                </View>
            ))}
            <Button title="添加强化物" onPress={addReinforcement} />
          </View>
        </View>

        {/* 右侧区域 里程碑 */}
        <View style={styles.milestoneContainer}>
          <VbMapp
              milestones={milestones}
              milestoneColors={milestoneColors}
              onMilestoneToggle={toggleMilestone} // 传递回调函数
          />
        </View>

        {/* 提交按钮 */}
        <View style={styles.submitButton}>
          <Button
              title="提交"
              onPress={handleSubmit}
              disabled={!name || !age || !gender || !courseDuration}
          />
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#E0F7FA',
  },
  leftContainer: {
    flex: 1, // 左侧区域，占据1/2
    flexDirection: 'column', // 上下排列
    justifyContent: 'flex-start', // 上对齐
    height: '100%', // 确保高度占满父容器
  },
  inputGroup: {
    justifyContent: 'center',
    paddingTop: 20, // 居中输入框
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center', // 垂直居中对齐
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
    alignSelf: 'center',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#2196F3',
  },
  radioLabel: {
    fontSize: 16,
  },
  reinforcements: {
    marginTop: 20,
    justifyContent: 'flex-start',
  },
  reinforcementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  milestoneContainer: {
    flex: 1, // 右侧区域，占据1/2
    justifyContent: 'center', // 垂直居中
    alignItems: 'center', // 水平居中
  },
  submitButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default CreateChildren;
