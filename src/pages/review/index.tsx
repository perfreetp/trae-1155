import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import StatusTag from '@/components/StatusTag';
import { mockReviewItems } from '@/data/mockData';
import styles from './index.module.scss';

type TabKey = 'pending' | 'approved' | 'rejected';

const ReviewPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('pending');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'pending', label: '待审核' },
    { key: 'approved', label: '已通过' },
    { key: 'rejected', label: '已退回' },
  ];

  const filteredItems = mockReviewItems.filter(item => {
    if (activeTab === 'pending') return item.status === 'pending';
    if (activeTab === 'approved') return item.status === 'approved';
    return item.status === 'rejected';
  });

  const handleApprove = (id: string) => {
    Taro.showToast({ title: '已通过审核', icon: 'success' });
    console.info('[Review] Approved:', id);
  };

  const handleReject = (id: string) => {
    Taro.showToast({ title: '已退回补录', icon: 'none' });
    console.info('[Review] Rejected:', id);
  };

  const handleEdit = (id: string) => {
    Taro.showToast({ title: '转写修改功能开发中', icon: 'none' });
    console.info('[Review] Edit:', id);
  };

  const handlePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  return (
    <View className={styles.reviewPage}>
      <View className={styles.tabBar}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tab, activeTab === tab.key ? styles.tabActive : '')}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text style={{ fontSize: '28rpx', color: activeTab === tab.key ? '#fff' : '#6B5D4F', fontWeight: activeTab === tab.key ? 600 : 400 }}>
              {tab.label}
            </Text>
          </View>
        ))}
      </View>

      <View className={styles.reviewList}>
        {filteredItems.map(item => (
          <View key={item.id} className={styles.reviewCard}>
            <View className={styles.reviewHeader}>
              <Text className={styles.reviewChinese}>{item.chinese}</Text>
              <StatusTag status={item.status} />
            </View>
            <Text className={styles.reviewPhonetic}>{item.phonetic}</Text>

            <View className={styles.versionInfo}>
              <Text className={styles.versionBadge}>v{item.version}</Text>
              <Text className={styles.versionDate}>{item.createdAt}</Text>
            </View>

            <View className={styles.reviewTranscription}>
              <Text>{item.transcription}</Text>
            </View>

            <View className={styles.reviewPlayer}>
              <View className={styles.playBtn} onClick={() => handlePlay(item.id)}>
                <View className={styles.playIcon} />
              </View>
              <View className={styles.playerInfo}>
                <Text className={styles.playerLabel}>点击播放原始录音</Text>
                <Text className={styles.playerTime}>逐句听辨</Text>
              </View>
            </View>

            {item.feedback && (
              <View className={styles.feedbackBox}>
                <Text className={styles.feedbackLabel}>审核意见</Text>
                <Text className={styles.feedbackText}>{item.feedback}</Text>
              </View>
            )}

            {activeTab === 'pending' && (
              <View className={styles.reviewActions}>
                <View className={`${styles.actionBtn} ${styles.approveBtn}`} onClick={() => handleApprove(item.id)}>
                  <Text style={{ color: '#fff', fontSize: '28rpx', fontWeight: 500 }}>通过</Text>
                </View>
                <View className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => handleEdit(item.id)}>
                  <Text style={{ color: '#C07842', fontSize: '28rpx', fontWeight: 500 }}>修改转写</Text>
                </View>
                <View className={`${styles.actionBtn} ${styles.rejectBtn}`} onClick={() => handleReject(item.id)}>
                  <Text style={{ color: '#D45B5B', fontSize: '28rpx', fontWeight: 500 }}>退回</Text>
                </View>
              </View>
            )}
          </View>
        ))}
      </View>

      {activeTab === 'approved' && filteredItems.length > 0 && (
        <View className={styles.compareSection}>
          <View className={styles.compareCard}>
            <Text className={styles.compareTitle}>版本对比</Text>
            <View className={styles.compareRow}>
              <View className={styles.compareCol}>
                <Text className={styles.compareLabel}>原始版本</Text>
                <View className={styles.compareValue}>
                  <Text className={styles.compareValueOld}>靓 lɛŋ²</Text>
                </View>
              </View>
              <View className={styles.compareCol}>
                <Text className={styles.compareLabel}>修订版本</Text>
                <View className={styles.compareValue}>
                  <Text>靓 lɛŋ³</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ReviewPage;
