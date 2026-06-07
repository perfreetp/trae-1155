import React, { useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import StatusTag from '@/components/StatusTag';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

type TabKey = 'pending' | 'approved' | 'rejected';

const ReviewPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('pending');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { reviews, approveReview, rejectReview, editReviewTranscription } = useAppStore();

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'pending', label: '待审核' },
    { key: 'approved', label: '已通过' },
    { key: 'rejected', label: '已退回' },
  ];

  const filteredItems = reviews.filter(item => {
    if (activeTab === 'pending') return item.status === 'pending';
    if (activeTab === 'approved') return item.status === 'approved';
    return item.status === 'rejected';
  });

  const approvedItems = reviews.filter(item => item.status === 'approved' && item.previousTranscription);

  const handleApprove = (id: string) => {
    approveReview(id);
    Taro.showToast({ title: '已通过审核', icon: 'success' });
    console.info('[Review] Approved:', id);
  };

  const handleRejectConfirm = () => {
    if (!showRejectDialog) return;
    rejectReview(showRejectDialog, rejectReason || '转写有误，请补录');
    setShowRejectDialog(null);
    setRejectReason('');
    Taro.showToast({ title: '已退回补录', icon: 'none' });
    console.info('[Review] Rejected:', showRejectDialog);
  };

  const handleEditConfirm = (id: string) => {
    if (!editText.trim()) {
      Taro.showToast({ title: '请输入修改后的转写', icon: 'none' });
      return;
    }
    editReviewTranscription(id, editText.trim());
    setEditingId(null);
    setEditText('');
    Taro.showToast({ title: '转写已修改', icon: 'success' });
    console.info('[Review] Transcription edited:', id);
  };

  const handleStartEdit = (id: string, currentText: string) => {
    setEditingId(id);
    setEditText(currentText);
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
              {item.reviewer && <Text className={styles.versionDate}>审核人: {item.reviewer}</Text>}
            </View>

            {editingId === item.id ? (
              <View className={styles.editSection}>
                <Text className={styles.editLabel}>修改转写内容：</Text>
                <Input
                  className={styles.editInput}
                  value={editText}
                  onInput={e => setEditText(e.detail.value)}
                  placeholder="请输入修改后的转写"
                />
                <View className={styles.editActions}>
                  <View className={`${styles.actionBtn} ${styles.approveBtn}`} style={{ flex: 1 }} onClick={() => handleEditConfirm(item.id)}>
                    <Text style={{ color: '#fff', fontSize: '28rpx', fontWeight: 500 }}>确认修改</Text>
                  </View>
                  <View className={`${styles.actionBtn} ${styles.rejectBtn}`} style={{ flex: 1 }} onClick={() => { setEditingId(null); setEditText(''); }}>
                    <Text style={{ color: '#D45B5B', fontSize: '28rpx', fontWeight: 500 }}>取消</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View className={styles.reviewTranscription}>
                <Text>{item.transcription}</Text>
              </View>
            )}

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

            {showRejectDialog === item.id && (
              <View className={styles.editSection}>
                <Text className={styles.editLabel}>退回原因：</Text>
                <Input
                  className={styles.editInput}
                  value={rejectReason}
                  onInput={e => setRejectReason(e.detail.value)}
                  placeholder="请输入退回原因"
                />
                <View className={styles.editActions}>
                  <View className={`${styles.actionBtn} ${styles.rejectBtn}`} style={{ flex: 1 }} onClick={handleRejectConfirm}>
                    <Text style={{ color: '#D45B5B', fontSize: '28rpx', fontWeight: 500 }}>确认退回</Text>
                  </View>
                  <View className={`${styles.actionBtn} ${styles.editBtn}`} style={{ flex: 1 }} onClick={() => { setShowRejectDialog(null); setRejectReason(''); }}>
                    <Text style={{ color: '#C07842', fontSize: '28rpx', fontWeight: 500 }}>取消</Text>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'pending' && !editingId && !showRejectDialog && (
              <View className={styles.reviewActions}>
                <View className={`${styles.actionBtn} ${styles.approveBtn}`} onClick={() => handleApprove(item.id)}>
                  <Text style={{ color: '#fff', fontSize: '28rpx', fontWeight: 500 }}>通过</Text>
                </View>
                <View className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => handleStartEdit(item.id, item.transcription)}>
                  <Text style={{ color: '#C07842', fontSize: '28rpx', fontWeight: 500 }}>修改转写</Text>
                </View>
                <View className={`${styles.actionBtn} ${styles.rejectBtn}`} onClick={() => setShowRejectDialog(item.id)}>
                  <Text style={{ color: '#D45B5B', fontSize: '28rpx', fontWeight: 500 }}>退回</Text>
                </View>
              </View>
            )}
          </View>
        ))}
      </View>

      {approvedItems.length > 0 && (
        <View className={styles.compareSection}>
          <View className={styles.compareCard}>
            <Text className={styles.compareTitle}>版本对比</Text>
            {approvedItems.map(item => (
              <View key={item.id} className={styles.compareRow}>
                <View className={styles.compareCol}>
                  <Text className={styles.compareLabel}>原始版本 (v{item.version - 1})</Text>
                  <View className={styles.compareValue}>
                    <Text className={styles.compareValueOld}>{item.previousTranscription}</Text>
                  </View>
                </View>
                <View className={styles.compareCol}>
                  <Text className={styles.compareLabel}>修订版本 (v{item.version})</Text>
                  <View className={styles.compareValue}>
                    <Text>{item.transcription}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default ReviewPage;
