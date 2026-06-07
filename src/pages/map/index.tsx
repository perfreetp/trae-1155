import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import classnames from 'classnames';
import { mockSpeakers } from '@/data/mockData';
import styles from './index.module.scss';

const dialectFilters = ['全部', '闽南语', '客家话', '粤语', '吴语', '湘语'];

const MapPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('全部');

  const filteredSpeakers = mockSpeakers.filter(
    s => activeFilter === '全部' || s.dialect === activeFilter
  );

  return (
    <View className={styles.mapPage}>
      <View className={styles.mapPlaceholder}>
        <Text className={styles.mapPlaceholderIcon}>🗺️</Text>
        <Text className={styles.mapPlaceholderText}>方言分布地图（地图组件加载中）</Text>
      </View>

      <View className={styles.filterBar}>
        {dialectFilters.map(d => (
          <View
            key={d}
            className={classnames(
              styles.filterTag,
              activeFilter === d ? styles.filterTagActive : ''
            )}
            onClick={() => setActiveFilter(d)}
          >
            <Text>{d}</Text>
          </View>
        ))}
      </View>

      <View className={styles.speakerSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            发音人 ({filteredSpeakers.length})
          </Text>
        </View>
        {filteredSpeakers.map(speaker => (
          <View key={speaker.id} className={styles.speakerCard}>
            <Image
              src={speaker.avatar}
              mode="aspectFill"
              className={styles.speakerAvatar}
            />
            <View className={styles.speakerInfo}>
              <Text className={styles.speakerName}>{speaker.name}</Text>
              <Text className={styles.speakerPlace}>
                {speaker.birthplace}
              </Text>
              <View className={styles.speakerMeta}>
                <Text className={styles.speakerDialect}>{speaker.dialect}</Text>
                <Text className={styles.speakerCount}>
                  {speaker.recordingCount}条录音
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default MapPage;
