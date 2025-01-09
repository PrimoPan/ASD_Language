import React from 'react';
import styles from './PreferenceButton.module.css';

export const PreferenceButton = ({text, icon}) => {
  return (
    <div className={styles.preferenceWrapper}>
      <div className={styles.preferenceButton}>{text}</div>
      {icon && (
        <img
          loading="lazy"
          src={icon}
          alt=""
          className={styles.preferenceIcon}
        />
      )}
    </div>
  );
};
