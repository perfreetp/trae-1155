import React, { useMemo, useState } from 'react';
import { View, Text, Input, Picker } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import StatusTag from '@/components/StatusTag';
import ProgressBar from '@/components/ProgressBar';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

const NOISE_OPTIONS = ['low', 'medium', 'high'];
const NOISE_LABELS: Record<string, string> = { low: '低', medium: '中', high: '高' };

const RecordDetailPage: React.FC = () => {
  const router = useRouter();
  const sessionId = router.params.id;
  const { recordings, entries, reviews, updateRecording, addEntry, linkEntryToSession, markReviewResolved } = useAppStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editSpeakerName, setEditSpeakerName] = useState('');
  const [editSpeakerAge, setEditSpeakerAge] = useState('');
  const [editVillageName, setEditVillageName] = useState('');
  const [editHasConsent, setEditHasConsent] = useState(false);
  const [editNoiseLevel, setEditNoiseLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [newChinese, setNewChinese] = useState('');
  const [newPhonetic, setNewPhonetic] = useState('');
  const [newDefinition, setNewDefinition] = useState('');

  const session = useMemo(() => {
    if (!sessionId) return recordings[0];
    return recordings.find(r => r.id === sessionId) || recordings[0];
  }, [sessionId, recordings]);

  const sessionEntries = useMemo(() => {
    if (!session) return [];
    const linked = entries.filter(e => e.sessionId === session.id);
    if (linked.length > 0) return linked;
    if (session.entries > 0) {
      return entries.filter(e =>
        e.speakerName === session.speakerName &&
        e.dialect === session.dialect &&
        !e.sessionId
      ).slice(0, session.entries);
    }
    return [];
  }, [session, entries]);

  const sessionRejections = useMemo(() => {
    if (!session) return [];
    const linked = reviews.filter(r => r.sessionId === session.id && r.status === 'rejected');
    if (linked.length > 0) return linked;
    return reviews.filter(r =>
      sessionEntries.some(e => e.id === r.entryId) && r.status === 'rejected'
    );
  }, [session, reviews, sessionEntries]);

  const actualEntryCount = sessionEntries.length;
  const displayEntryCount = Math.max(session.entries, actualEntryCount);

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

  const startEdit = () => {
    setEditSpeakerName(session.speakerName);
    setEditSpeakerAge(String(session.speakerAge));
    setEditVillageName(session.villageName);
    setEditHasConsent(session.hasConsent);
    setEditNoiseLevel(session.noiseLevel || 'low');
    setIsEditing(true);
  };

  const saveEdit = () => {
    updateRecording(session.id, {
      speakerName: editSpeakerName.trim() || session.speakerName,
      speakerAge: parseInt(editSpeakerAge) || session.speakerAge,
      villageName: editVillageName.trim() || session.villageName,
      hasConsent: editHasConsent,
      noiseLevel: editNoiseLevel,
    });
    setIsEditing(false);
    Taro.showToast({ title: '已保存', icon: 'success' });
  };

  const handleAddEntry = () => {
    if (!newChinese.trim() || !newDefinition.trim()) {
      Taro.showToast({ title: '请填写汉字和释义', icon: 'none' });
      return;
    }
    const newEntry = {
      id: `e_${Date.now()}`,
      chinese: newChinese.trim(),
      phonetic: newPhonetic.trim(),
      definition: newDefinition.trim(),
      exampleSentence: '暂无例句',
      synonyms: [],
      usageScenario: '通用',
      dialect: session.dialect,
      region: session.villageName,
      speakerName: session.speakerName,
      audioUrl: '',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'draft' as const,
      tags: [session.dialect],
      sessionId: session.id,
    };
    addEntry(newEntry);
    linkEntryToSession(session.id, newEntry.id);
    setNewChinese('');
    setNewPhonetic('');
    setNewDefinition('');
    setShowAddEntry(false);
    Taro.showToast({ title: '词条已添加', icon: 'success' });
  };

  const handleRerecord = (reviewId: string) => {
    markReviewResolved(reviewId);
    Taro.navigateTo({ url: `/pages/record/index?continueId=${session.id}` });
  };

  return (
    <View className={styles.recordDetailPage}>
      <View className={styles.infoCard}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24rpx' }}>
          <Text className={styles.infoTitle}>{session.speakerName}</Text>
          <View style={{ display: 'flex', gap: '16rpx', alignItems: 'center' }}>
            <StatusTag status={session.status} size="medium" />
            {!isEditing && (
              <View className={styles.editInfoBtn} onClick={startEdit}>
                <Text style={{ fontSize: '24rpx', color: '#C07842' }}>编辑</Text>
              </View>
            )}
          </View>
        </View>

        {isEditing ? (
          <>
            <View className={styles.editRow}>
              <Text className={styles.editLabel}>发音人姓名</Text>
              <Input className={styles.editInput} value={editSpeakerName} onInput={e => setEditSpeakerName(e.detail.value)} />
            </View>
            <View className={styles.editRow}>
              <Text className={styles.editLabel}>年龄</Text>
              <Input className={styles.editInput} type="number" value={editSpeakerAge} onInput={e => setEditSpeakerAge(e.detail.value)} />
            </View>
            <View className={styles.editRow}>
              <Text className={styles.editLabel}>采集地点</Text>
              <Input className={styles.editInput} value={editVillageName} onInput={e => setEditVillageName(e.detail.value)} />
            </View>
            <View className={styles.editRow}>
              <Text className={styles.editLabel}>知情同意</Text>
              <View className={styles.consentToggle} onClick={() => setEditHasConsent(!editHasConsent)}>
                <View className={editHasConsent ? styles.consentActive : styles.consentInactive}>
                  <Text style={{ fontSize: '24rpx', color: editHasConsent ? '#fff' : '#6B5D4F' }}>
                    {editHasConsent ? '已签署' : '未签署'}
                  </Text>
                </View>
              </View>
            </View>
            <View className={styles.editRow}>
              <Text className={styles.editLabel}>噪声情况</Text>
              <Picker mode="selector" range={NOISE_OPTIONS.map(n => NOISE_LABELS[n])} value={NOISE_OPTIONS.indexOf(editNoiseLevel)} onChange={e => setEditNoiseLevel(NOISE_OPTIONS[e.detail.value] as 'low' | 'medium' | 'high')}>
                <View className={styles.editPicker}>
                  <Text>{NOISE_LABELS[editNoiseLevel]}</Text>
                  <Text className={styles.pickerArrow}>›</Text>
                </View>
              </Picker>
            </View>
            <View className={styles.editActions}>
              <View className={styles.saveBtn} onClick={saveEdit}>
                <Text style={{ color: '#fff', fontSize: '28rpx', fontWeight: 500 }}>保存</Text>
              </View>
              <View className={styles.cancelBtn} onClick={() => setIsEditing(false)}>
                <Text style={{ fontSize: '28rpx', color: '#9E9185' }}>取消</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>采集地点</Text>
              <Text className={styles.infoValue}>{session.villageName}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>方言</Text>
              <Text className={styles.infoValue}>{session.dialect}</Text>
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
                  {NOISE_LABELS[session.noiseLevel]}
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      <View className={styles.infoCard}>
        <Text className={styles.infoTitle}>采录进度</Text>
        <ProgressBar percent={Math.min(Math.round((displayEntryCount / 50) * 100), 100)} />
        <Text style={{ fontSize: '24rpx', color: '#9E9185', marginTop: '16rpx' }}>
          已录入 {displayEntryCount} 个词条
        </Text>
      </View>

      <View className={styles.entrySection}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24rpx' }}>
          <Text className={styles.infoTitle}>关联词条 ({displayEntryCount})</Text>
          <View className={styles.addEntryBtn} onClick={() => setShowAddEntry(!showAddEntry)}>
            <Text style={{ fontSize: '26rpx', color: '#C07842', fontWeight: 500 }}>
              {showAddEntry ? '收起' : '+ 新增词条'}
            </Text>
          </View>
        </View>

        {showAddEntry && (
          <View className={styles.addEntryForm}>
            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>汉字 *</Text>
              <Input className={styles.formInput} placeholder="请输入汉字" value={newChinese} onInput={e => setNewChinese(e.detail.value)} />
            </View>
            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>音标</Text>
              <Input className={styles.formInput} placeholder="请输入国际音标" value={newPhonetic} onInput={e => setNewPhonetic(e.detail.value)} />
            </View>
            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>释义 *</Text>
              <Input className={styles.formInput} placeholder="请输入释义" value={newDefinition} onInput={e => setNewDefinition(e.detail.value)} />
            </View>
            <View className={styles.formActions}>
              <View className={styles.saveBtn} style={{ flex: 1 }} onClick={handleAddEntry}>
                <Text style={{ color: '#fff', fontSize: '28rpx', fontWeight: 500 }}>保存词条</Text>
              </View>
              <View className={styles.cancelBtn} style={{ flex: 1 }} onClick={() => setShowAddEntry(false)}>
                <Text style={{ fontSize: '28rpx', color: '#9E9185' }}>取消</Text>
              </View>
            </View>
          </View>
        )}

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

        {sessionEntries.length === 0 && !showAddEntry && (
          <Text className={styles.emptyText}>暂无关联词条，点击右上角新增</Text>
        )}
      </View>

      {sessionRejections.length > 0 && (
        <View className={styles.rejectionSection}>
          <Text className={styles.infoTitle}>审核退回记录 ({sessionRejections.length})</Text>
          {sessionRejections.map(rejection => (
            <View key={rejection.id} className={styles.rejectionCard}>
              <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12rpx' }}>
                <Text className={styles.rejectionChinese}>{rejection.chinese}</Text>
                <View style={{ display: 'flex', gap: '12rpx', alignItems: 'center' }}>
                  {rejection.resolved && (
                    <View className={styles.resolvedTag}>
                      <Text style={{ fontSize: '22rpx', color: '#5B8C7A', fontWeight: 500 }}>已处理</Text>
                    </View>
                  )}
                  <StatusTag status={rejection.status} size="small" />
                </View>
              </View>
              <Text className={styles.rejectionPhonetic}>{rejection.phonetic}</Text>
              {rejection.feedback && (
                <View className={styles.rejectionFeedback}>
                  <Text className={styles.rejectionFeedbackLabel}>退回原因</Text>
                  <Text className={styles.rejectionFeedbackText}>{rejection.feedback}</Text>
                </View>
              )}
              {rejection.previousTranscription && (
                <View className={styles.rejectionCompare}>
                  <View className={styles.rejectionCompareCol}>
                    <Text className={styles.rejectionCompareLabel}>原转写</Text>
                    <Text className={styles.rejectionOld}>{rejection.previousTranscription}</Text>
                  </View>
                  <View className={styles.rejectionCompareCol}>
                    <Text className={styles.rejectionCompareLabel}>修改后</Text>
                    <Text className={styles.rejectionNew}>{rejection.transcription}</Text>
                  </View>
                </View>
              )}
              {!rejection.resolved && (
                <View className={styles.rerecordBtn} onClick={() => handleRerecord(rejection.id)}>
                  <Text style={{ color: '#fff', fontSize: '26rpx', fontWeight: 500 }}>进入补录</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {(session.status === 'paused' || session.status === 'draft' || session.status === 'recording') && (
        <View
          className={styles.resumeBtn}
          onClick={() => {
            Taro.navigateTo({ url: `/pages/record/index?continueId=${session.id}` });
          }}
        >
          <Text style={{ color: '#fff', fontSize: '32rpx', fontWeight: 600 }}>
            {session.status === 'paused' ? '继续采录（断点续录）' : '开始采录'}
          </Text>
        </View>
      )}
    </View>
  );
};

export default RecordDetailPage;
