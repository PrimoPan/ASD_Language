import React from 'react';
import {PreferenceButton} from './components/PreferenceButton';
import {StyleButton} from './components/StyleButton';
import styles from './ChildProfile.module.css';

const preferences = [
  {
    text: '实物类',
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/1b16652614d44a391462d1a165048e1a75449c45388361f747df345f8cdd7b27?placeholderIfAbsent=true&apiKey=248c3eeefc164ad3bce1d814c47652e0',
  },
  {
    text: '食物类',
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/1b16652614d44a391462d1a165048e1a75449c45388361f747df345f8cdd7b27?placeholderIfAbsent=true&apiKey=248c3eeefc164ad3bce1d814c47652e0',
  },
  {
    text: '活动类',
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/1b16652614d44a391462d1a165048e1a75449c45388361f747df345f8cdd7b27?placeholderIfAbsent=true&apiKey=248c3eeefc164ad3bce1d814c47652e0',
  },
  {
    text: '感官类',
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/1b16652614d44a391462d1a165048e1a75449c45388361f747df345f8cdd7b27?placeholderIfAbsent=true&apiKey=248c3eeefc164ad3bce1d814c47652e0',
  },
  {
    text: '社交类',
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/1b16652614d44a391462d1a165048e1a75449c45388361f747df345f8cdd7b27?placeholderIfAbsent=true&apiKey=248c3eeefc164ad3bce1d814c47652e0',
  },
];

const styleTypes = ['卡通风格', '真实风格'];

export function ChildProfile() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>儿童基础信息</h2>
      <div className={styles.contentWrapper}>
        <div className={styles.profileGrid}>
          <div className={styles.avatarColumn}>
            <div className={styles.avatarSection}>
              <div className={styles.uploadAvatar}>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/512d78d68fee92333296cacea6d3ddb1dee0d4795fabf5d27befe5cd1c6b9ed4?placeholderIfAbsent=true&apiKey=248c3eeefc164ad3bce1d814c47652e0"
                  alt=""
                  className={styles.uploadIcon}
                />
                <span className={styles.uploadText}>上传头像</span>
              </div>
              <h3 className={styles.stylePreference}>图片风格偏好</h3>
            </div>
          </div>
          <div className={styles.infoColumn}>
            <div className={styles.infoSection}>
              <div className={styles.infoRow}>
                <div className={styles.infoField}>姓名：</div>
                <div className={styles.ageWrapper}>
                  <span className={styles.infoField}>年龄：</span>
                  <span className={styles.ageUnit}>岁</span>
                </div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.genderWrapper}>
                  <span>性别：</span>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/0335ff75dfd94ccaa706cedc104c193df9b830ef8b4104e8786cc4e354264813?placeholderIfAbsent=true&apiKey=248c3eeefc164ad3bce1d814c47652e0"
                    alt=""
                    className={styles.genderIcon}
                  />
                </div>
                <div className={styles.infoField}>课程周期：</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.styleButtons}>
        {styleTypes.map(style => (
          <StyleButton key={style} text={style} />
        ))}
      </div>
      <div className={styles.preferencesSection}>
        <h3 className={styles.preferencesTitle}>强化物偏好</h3>
        {preferences.map(pref => (
          <PreferenceButton key={pref.text} text={pref.text} icon={pref.icon} />
        ))}
      </div>
    </div>
  );
}
