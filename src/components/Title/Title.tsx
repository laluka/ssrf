import React from 'react';
import styles from './Title.module.css';

export function Title() {
  return (
    <h1 className={styles.neonTitle} data-text="Simple Stream Resource Finder">
      SSimple Stream Resource Finder
    </h1>
  );
}