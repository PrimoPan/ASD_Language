import React from 'react';
import styles from './StyleButton.module.css';

export const StyleButton = ({text}) => {
  return <div className={styles.styleButton}>{text}</div>;
};
