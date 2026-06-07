import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import StatusTag from '@/components/StatusTag';
import { mockEntries } from '@/data/mockData';
import styles from './index.module.scss';

const EntryDetailPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const entry = mockEntries[0];

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    console.info('[EntryDetail] Playing audio for:', entry.chinese);
  };

  return (
    <View className={styles.entryDetailPage}>
      <View className={styles.mainCard}>
        <Text className={styles.chineseChar}>{entry.chinese}</Text>
        <Text className={styles.phoneticText}>[{entry.phonetic}]</Text>

        <View className={styles.playerRow}>
          <View className={styles.playBtn} onClick={handlePlay}>
            <View className={styles.playIcon} />
          </View>
          <Text className={styles.playerLabel}>
            {isPlaying ? '播放中...' : '点击播放发音'}
          </Text>
        </View>

        <View style={{ display: 'flex', justifyContent: 'center' }}>
          <StatusTag status={entry.status} size="medium" />
        </View>
      </View>

      <View className={styles.fieldGroup}>
        <Text className={styles.fieldLabel}>释义</Text>
        <Text className={styles.fieldValue}>{entry.definition}</Text>
      </View>

      <View className={styles.fieldGroup}>
        <Text className={styles.fieldLabel}>例句</Text>
        <View className={styles.exampleBox}>
          <Text className={styles.fieldValue}>{entry.exampleSentence}</Text>
        </View>
      </View>

      <View className={styles.fieldGroup}>
        <Text className={styles.fieldLabel}>同义说法</Text>
        <View className={styles.synonymList}>
          {entry.synonyms.map(synonym => (
            <Text key={synonym} className={styles.synonymTag}>
              {synonym}
            </Text>
          ))}
        </View>
      </View>

      <View className={styles.fieldGroup}>
        <Text className={styles.fieldLabel}>使用场景</Text>
        <Text className={styles.fieldValue}>{entry.usageScenario}</Text>
      </View>

      <View className={styles.fieldGroup}>
        <Text className={styles.fieldLabel}>分类标签</Text>
        <View className={styles.tagList}>
          {entry.tags.map(tag => (
            <Text key={tag} className={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
      </View>

      <View className={styles.fieldGroup}>
        <View className={styles.metaRow}>
          <Text className={styles.metaText}>
            {entry.dialect} · {entry.region}
          </Text>
          <Text className={styles.metaText}>
            发音人: {entry.speakerName}
          </Text>
        </View>
        <View className={styles.metaRow}>
          <Text className={styles.metaText}>录入日期: {entry.createdAt}</Text>
        </View>
      </View>

      <View
        className={styles.editBtn}
        onClick={() => Taro.showToast({ title: '编辑功能开发中', icon: 'none' })}
      >
        <Text style={{ color: '#fff', fontSize: '32rpx', fontWeight: 600 }}>编辑词条</Text>
      </View>
    </View>
  );
};

export default EntryDetailPage;
