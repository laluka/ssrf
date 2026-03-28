import React from 'react';
import styles from './Title.module.css';

export function Title() {
  return (
    <h1 className={styles.neonTitle} data-text="CuistOps Resource Finder">
      CuistOps Resource Finder
    </h1>
  );
}
