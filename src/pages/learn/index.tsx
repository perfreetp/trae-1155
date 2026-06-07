import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockLearningTopics, mockLearningSamples } from '@/data/mockData';
import styles from './index.module.scss';

const LearnPage: React.FC = () => {
  const [playingSampleId, setPlayingSampleId] = useState<string | null>(null);

  const handlePlaySample = (sampleId: string) => {
    if (playingSampleId === sampleId) {
      setPlayingSampleId(null);
    } else {
      setPlayingSampleId(sampleId);
      console.info('[Learn] Playing sample:', sampleId);
    }
  };

  const handleStartQuiz = () => {
    Taro.showToast({ title: '跟读测验功能开发中', icon: 'none' });
  };

  return (
    <View className={styles.learnPage}>
      <View className={styles.heroSection}>
        <Text className={styles.heroTitle}>方言学堂</Text>
        <Text className={styles.heroSubtitle}>聆听乡音，传承方言之美</Text>
        <View className={styles.heroStats}>
          <View className={styles.heroStat}>
            <Text className={styles.heroStatValue}>8</Text>
            <Text className={styles.heroStatLabel}>学习主题</Text>
          </View>
          <View className={styles.heroStat}>
            <Text className={styles.heroStatValue}>195</Text>
            <Text className={styles.heroStatLabel}>语音样本</Text>
          </View>
          <View className={styles.heroStat}>
            <Text className={styles.heroStatValue}>6</Text>
            <Text className={styles.heroStatLabel}>方言种类</Text>
          </View>
        </View>
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>主题分类</Text>
        <Text className={styles.sectionMore}>全部</Text>
      </View>

      <ScrollView scrollX className={styles.categoryScroll}>
        <View className={styles.categoryList}>
          {mockLearningTopics.slice(0, 5).map(topic => (
            <View key={topic.id} className={styles.categoryCard}>
              <Image
                src={topic.coverImage}
                mode="aspectFill"
                className={styles.categoryCover}
              />
              <View className={styles.categoryInfo}>
                <Text className={styles.categoryName}>{topic.name}</Text>
                <Text className={styles.categoryCount}>{topic.sampleCount} 条样本</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>语音样本</Text>
        <Text className={styles.sectionMore}>更多</Text>
      </View>

      <View className={styles.sampleSection}>
        {mockLearningSamples.map(sample => (
          <View key={sample.id} className={styles.sampleCard}>
            <View className={styles.sampleHeader}>
              <View style={{ flex: 1 }}>
                <Text className={styles.sampleChinese}>{sample.chinese}</Text>
                <Text className={styles.samplePhonetic}>{sample.phonetic}</Text>
                <Text className={styles.sampleMeta}>
                  {sample.dialect} · {sample.region}
                </Text>
              </View>
              <View
                className={styles.playBtn}
                onClick={() => handlePlaySample(sample.id)}
              >
                <View className={styles.playIcon} />
              </View>
            </View>
          </View>
        ))}
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>跟读测验</Text>
      </View>

      <View className={styles.quizSection}>
        <View className={styles.quizCard} onClick={handleStartQuiz}>
          <Text className={styles.quizTitle}>每日跟读挑战</Text>
          <Text className={styles.quizDesc}>
            听方言样本，跟读录音，系统自动评估发音准确度，帮助您深入了解各地方言。
          </Text>
          <View className={styles.quizBtn}>
            <Text style={{ color: '#C07842', fontSize: '28rpx', fontWeight: 500 }}>开始测验</Text>
          </View>
        </View>
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>全部主题</Text>
      </View>

      <View style={{ padding: '0 32rpx' }}>
        {mockLearningTopics.map(topic => (
          <View key={topic.id} className={styles.topicCard}>
            <Image
              src={topic.coverImage}
              mode="aspectFill"
              className={styles.topicCover}
            />
            <View className={styles.topicInfo}>
              <Text className={styles.topicName}>{topic.name}</Text>
              <Text className={styles.topicDesc}>{topic.description}</Text>
              <Text className={styles.topicCount}>{topic.sampleCount} 条样本</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default LearnPage;
