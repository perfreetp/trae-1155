import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface StatCardProps {
  value: string | number;
  label: string;
  highlight?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, highlight = false }) => {
  return (
    <View className={`${styles.card} ${highlight ? styles.cardHighlight : ''}`}>
      <Text className={`${styles.value} ${highlight ? styles.valueHighlight : ''}`}>{value}</Text>
      <Text className={styles.label}>{label}</Text>
    </View>
  );
};

export default StatCard;
