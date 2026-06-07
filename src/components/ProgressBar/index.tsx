import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface ProgressBarProps {
  percent: number;
  showLabel?: boolean;
  size?: 'small' | 'medium';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percent, showLabel = true, size = 'medium' }) => {
  const clampedPercent = Math.min(100, Math.max(0, percent));

  return (
    <View className={styles.wrapper}>
      <View className={styles.track}>
        <View
          className={`${styles.fill} ${size === 'small' ? styles.fillSmall : styles.fillMedium}`}
          style={{ width: `${clampedPercent}%` }}
        />
      </View>
      {showLabel && (
        <Text className={`${styles.label} ${size === 'small' ? styles.labelSmall : styles.labelMedium}`}>
          {clampedPercent}%
        </Text>
      )}
    </View>
  );
};

export default ProgressBar;
