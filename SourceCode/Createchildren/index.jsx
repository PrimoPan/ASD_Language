import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

const CreateChildren = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [reinforcements, setReinforcements] = useState([]);
  const [milestones, setMilestones] = useState([
    Array(15).fill(false),
    Array(15).fill(false),
    Array(10).fill(false),
    Array(10).fill(false)
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

  const toggleMilestone = (col, index) => {
    let newMilestones = [...milestones];
    for (let i = 0; i < newMilestones[col].length; i++) newMilestones[col][i] = false;
    for (let i = index; i < newMilestones[col].length; i++) {
      newMilestones[col][i] = true;
    }

    setMilestones(newMilestones);
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
  };

  return (
      <View style={styles.container}>
        {/* 左侧区域 1/2 */}
        <View style={styles.leftContainer}>
          {/* 上半部分 1/4 */}
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

          {/* 下半部分 1/4 */}
          <View style={styles.reinforcements}>
            {reinforcements.map((reinforcement, index) => (
                <View key={reinforcement.id} style={styles.reinforcementItem}>
                  <TextInput
                      placeholder="输入强化物"
                      value={reinforcement.value}
                      onChangeText={(text) => updateReinforcement(reinforcement.id, text)}
                      style={styles.input}
                  />
                  <Button title="删除" onPress={() => removeReinforcement(reinforcement.id)} />
                </View>
            ))}
            <Button title="添加强化物" onPress={addReinforcement} />
          </View>
        </View>

        {/* 右侧区域 里程碑 */}
        <View style={styles.milestones}>
          <View style={styles.milestoneWrapper}>
            {milestones.map((column, colIndex) => (
                <View key={colIndex} style={styles.milestoneColumn}>
                  {column.map((selected, index) => (
                      <TouchableOpacity
                          key={index}
                          style={[
                            styles.milestoneBlock,
                            { backgroundColor: selected ? milestoneColors[colIndex % milestoneColors.length] : '#FFF' }
                          ]}
                          onPress={() => toggleMilestone(colIndex, index)}
                      />
                  ))}
                </View>
            ))}
          </View>
        </View>

        {/* 提交按钮 */}
        <Button title="提交" onPress={handleSubmit} disabled={!name || !age || !gender || !courseDuration} />
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
    flex: 1,  // 左侧区域，占据1/2
    flexDirection: 'column',  // 上下排列
    justifyContent: 'flex-start',  // 上对齐
    height: '100%',  // 确保高度占满父容器
  },
  inputGroup: {
    flex: 1,  // 占据左上角的1/2
    justifyContent: 'center',
    paddingTop: 20,  // 居中输入框
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
    justifyContent: 'space-between',
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
    flex: 1,  // 占据左下角的1/2
    marginTop: 20,
    justifyContent: 'flex-start',
  },
  reinforcementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  milestones: {
    flex: 1,  // 右侧区域占据1/2高度
    justifyContent: 'flex-start',  // 上对齐
    alignItems: 'center',  // 横向居中
    flexDirection: 'row',
    height: '100%',  // 确保右侧区域的高度和左侧一致
  },
  milestoneWrapper: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  milestoneColumn: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
  },
  milestoneBlock: {
    width: 60,  // 格子宽度
    height: 30,  // 格子高度
    margin: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
});

export default CreateChildren;
