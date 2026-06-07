import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import StatusTag from '@/components/StatusTag';
import ProgressBar from '@/components/ProgressBar';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

const RecordDetailPage: React.FC = () => {
  const router = useRouter();
  const sessionId = router.params.id;
  const { recordings, entries } = useAppStore();

  const session = useMemo(() => {
    if (!sessionId) return recordings[0];
    return recordings.find(r => r.id === sessionId) || recordings[0];
  }, [sessionId, recordings]);

  const sessionEntries = useMemo(() => {
    if (!session) return [];
    return entries.filter(e => e.region === session.villageName || e.dialect === session.dialect).slice(0, session.entries);
  }, [session, entries]);

  const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (!session) {
    return (
      <View className={styles.recordDetailPage}>
        <View className={styles.infoCard}>
          <Text className={styles.infoTitle}>未找到该采录会话</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.recordDetailPage}>
      <View className={styles.infoCard}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24rpx' }}>
          <Text className={styles.infoTitle}>{session.speakerName}</Text>
          <StatusTag status={session.status} size="medium" />
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>村点</Text>
          <Text className={styles.infoValue}>{session.villageName}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>年龄/性别</Text>
          <Text className={styles.infoValue}>{session.speakerAge}岁 / {session.speakerGender === 'male' ? '男' : '女'}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>采录时长</Text>
          <Text className={styles.infoValue}>{formatDuration(session.duration)}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>采录日期</Text>
          <Text className={styles.infoValue}>{session.date}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>知情同意</Text>
          <Text className={styles.infoValue} style={{ color: session.hasConsent ? '#5B8C7A' : '#D45B5B' }}>
            {session.hasConsent ? '已签署' : '未签署'}
          </Text>
        </View>
        {session.noiseLevel && (
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>环境噪声</Text>
            <Text className={styles.infoValue} style={{ color: session.noiseLevel === 'high' ? '#D45B5B' : session.noiseLevel === 'medium' ? '#E8A455' : '#5B8C7A' }}>
              {session.noiseLevel === 'low' ? '低' : session.noiseLevel === 'medium' ? '中' : '高'}
            </Text>
          </View>
        )}
      </View>

      <View className={styles.infoCard}>
        <Text className={styles.infoTitle}>采录进度</Text>
        <ProgressBar percent={Math.round((session.entries / 50) * 100)} />
        <Text style={{ fontSize: '24rpx', color: '#9E9185', marginTop: '16rpx' }}>
          已录入 {session.entries} 个词条
        </Text>
      </View>

      <View className={styles.entryList}>
        <Text className={styles.infoTitle}>词条列表</Text>
        {sessionEntries.map((entry, index) => (
          <View key={entry.id} className={styles.entryItem}
            onClick={() => Taro.navigateTo({ url: `/pages/entryDetail/index?id=${entry.id}` })}
          >
            <Text className={styles.entryIndex}>{index + 1}</Text>
            <View className={styles.entryContent}>
              <Text className={styles.entryChinese}>{entry.chinese}</Text>
              <Text className={styles.entryPhonetic}>{entry.phonetic}</Text>
            </View>
            <View className={styles.entryPlayBtn}>
              <Text style={{ fontSize: '24rpx', color: '#C07842' }}>▶</Text>
            </View>
          </View>
        ))}
      </View>

      {session.status === 'paused' && (
        <View
          className={styles.resumeBtn}
          onClick={() => {
            Taro.navigateTo({ url: `/pages/record/index?continueId=${session.id}` });
          }}
        >
          <Text style={{ color: '#fff', fontSize: '32rpx', fontWeight: 600 }}>继续采录（断点续录）</Text>
        </View>
      )}
    </View>
  );
};

export default RecordDetailPage;
