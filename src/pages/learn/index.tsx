import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockLearningTopics, mockLearningSamples } from '@/data/mockData';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

type QuizStep = 'idle' | 'selecting' | 'listening' | 'recording' | 'result';

const LearnPage: React.FC = () => {
  const [playingSampleId, setPlayingSampleId] = useState<string | null>(null);
  const [playProgress, setPlayProgress] = useState<Record<string, number>>({});
  const playTimerRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  const [quizStep, setQuizStep] = useState<QuizStep>('idle');
  const [selectedSample, setSelectedSample] = useState<typeof mockLearningSamples[0] | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizRecording, setQuizRecording] = useState(false);
  const [quizTimer, setQuizTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { quizRecords, addQuizRecord } = useAppStore();

  useEffect(() => {
    return () => {
      Object.values(playTimerRef.current).forEach(clearInterval);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handlePlaySample = (sampleId: string) => {
    if (playingSampleId === sampleId) {
      if (playTimerRef.current[sampleId]) {
        clearInterval(playTimerRef.current[sampleId]);
        delete playTimerRef.current[sampleId];
      }
      setPlayingSampleId(null);
      return;
    }

    if (playingSampleId && playTimerRef.current[playingSampleId]) {
      clearInterval(playTimerRef.current[playingSampleId]);
      delete playTimerRef.current[playingSampleId];
    }

    setPlayingSampleId(sampleId);
    setPlayProgress(prev => ({ ...prev, [sampleId]: 0 }));
    playTimerRef.current[sampleId] = setInterval(() => {
      setPlayProgress(prev => {
        const current = prev[sampleId] || 0;
        if (current >= 100) {
          if (playTimerRef.current[sampleId]) {
            clearInterval(playTimerRef.current[sampleId]);
            delete playTimerRef.current[sampleId];
          }
          setPlayingSampleId(null);
          return { ...prev, [sampleId]: 100 };
        }
        return { ...prev, [sampleId]: current + 4 };
      });
    }, 200);
  };

  const handleStartQuiz = () => {
    setQuizStep('selecting');
  };

  const handleSelectSample = (sample: typeof mockLearningSamples[0]) => {
    setSelectedSample(sample);
    setQuizStep('listening');
  };

  const handleStartRecording = () => {
    setQuizStep('recording');
    setQuizRecording(true);
    setQuizTimer(0);
    timerRef.current = setInterval(() => {
      setQuizTimer(prev => prev + 1);
    }, 1000);
  };

  const handleStopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setQuizRecording(false);
    const score = Math.floor(Math.random() * 30) + 70;
    const duration = quizTimer;
    setQuizScore(score);
    setQuizStep('result');
    if (selectedSample) {
      addQuizRecord({
        id: `qr_${Date.now()}`,
        sampleChinese: selectedSample.chinese,
        samplePhonetic: selectedSample.phonetic,
        dialect: selectedSample.dialect,
        score,
        date: new Date().toISOString().split('T')[0],
        recordingDuration: duration,
      });
    }
  }, [selectedSample, addQuizRecord, quizTimer]);

  const handleRetryQuiz = () => {
    setQuizStep('listening');
    setQuizScore(0);
    setQuizTimer(0);
  };

  const handleEndQuiz = () => {
    setQuizStep('idle');
    setSelectedSample(null);
    setQuizScore(0);
    setQuizTimer(0);
  };

  const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <View className={styles.learnPage}>
      <View className={styles.heroSection}>
        <Text className={styles.heroTitle}>方言学堂</Text>
        <Text className={styles.heroSubtitle}>聆听乡音，传承方言之美</Text>
        <View className={styles.heroStats}>
          <View className={styles.heroStat}>
            <Text className={styles.heroStatValue}>{mockLearningTopics.length}</Text>
            <Text className={styles.heroStatLabel}>学习主题</Text>
          </View>
          <View className={styles.heroStat}>
            <Text className={styles.heroStatValue}>{mockLearningSamples.length}</Text>
            <Text className={styles.heroStatLabel}>语音样本</Text>
          </View>
          <View className={styles.heroStat}>
            <Text className={styles.heroStatValue}>{quizRecords.length}</Text>
            <Text className={styles.heroStatLabel}>测验记录</Text>
          </View>
        </View>
      </View>

      {quizStep !== 'idle' && (
        <View className={styles.quizFlowCard}>
          {quizStep === 'selecting' && (
            <>
              <Text className={styles.quizFlowTitle}>选择跟读样本</Text>
              <Text className={styles.quizFlowDesc}>请选择一个方言样本进行跟读测验</Text>
              {mockLearningSamples.map(sample => (
                <View key={sample.id} className={styles.sampleSelectItem} onClick={() => handleSelectSample(sample)}>
                  <View style={{ flex: 1 }}>
                    <Text className={styles.sampleSelectChinese}>{sample.chinese}</Text>
                    <Text className={styles.sampleSelectPhonetic}>{sample.phonetic}</Text>
                    <Text className={styles.sampleSelectMeta}>{sample.dialect} · {sample.region}</Text>
                  </View>
                  <View className={styles.sampleSelectBtn}>
                    <Text style={{ fontSize: '24rpx', color: '#C07842', fontWeight: 500 }}>选择</Text>
                  </View>
                </View>
              ))}
              <View className={styles.quizCancelBtn} onClick={handleEndQuiz}>
                <Text style={{ fontSize: '28rpx', color: '#9E9185' }}>取消</Text>
              </View>
            </>
          )}
          {quizStep === 'listening' && selectedSample && (
            <>
              <Text className={styles.quizFlowTitle}>聆听样本</Text>
              <View className={styles.quizSampleCard}>
                <Text className={styles.quizSampleChinese}>{selectedSample.chinese}</Text>
                <Text className={styles.quizSamplePhonetic}>[{selectedSample.phonetic}]</Text>
                <Text className={styles.quizSampleMeta}>{selectedSample.dialect} · {selectedSample.region}</Text>
              </View>
              <View className={styles.quizPlayBtn} onClick={() => handlePlaySample(selectedSample.id)}>
                <View className={styles.playBtn}>
                  {playingSampleId === selectedSample.id ? (
                    <View className={styles.pauseIcon} />
                  ) : (
                    <View className={styles.playIcon} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text className={styles.quizPlayLabel}>
                    {playingSampleId === selectedSample.id ? '播放中...' : '点击播放'}
                  </Text>
                  <View className={styles.audioProgressBar}>
                    <View
                      className={styles.audioProgressFill}
                      style={{ width: `${playProgress[selectedSample.id] || 0}%` }}
                    />
                  </View>
                </View>
              </View>
              <View className={styles.quizActionBtn} onClick={handleStartRecording}>
                <Text style={{ color: '#fff', fontSize: '28rpx', fontWeight: 600 }}>开始跟读录制</Text>
              </View>
              <View className={styles.quizCancelBtn} onClick={() => setQuizStep('selecting')}>
                <Text style={{ fontSize: '28rpx', color: '#9E9185' }}>重新选择</Text>
              </View>
            </>
          )}
          {quizStep === 'recording' && selectedSample && (
            <>
              <Text className={styles.quizFlowTitle}>正在跟读录制</Text>
              <View className={styles.quizSampleCard}>
                <Text className={styles.quizSampleChinese}>{selectedSample.chinese}</Text>
                <Text className={styles.quizSamplePhonetic}>[{selectedSample.phonetic}]</Text>
              </View>
              <View className={styles.quizRecordingIndicator}>
                <View className={styles.quizRecordingDot} />
                <Text className={styles.quizRecordingText}>录制中 {formatDuration(quizTimer)}</Text>
              </View>
              <View className={styles.quizStopBtn} onClick={handleStopRecording}>
                <Text style={{ color: '#fff', fontSize: '28rpx', fontWeight: 600 }}>停止录制</Text>
              </View>
            </>
          )}
          {quizStep === 'result' && selectedSample && (
            <>
              <Text className={styles.quizFlowTitle}>跟读评分结果</Text>
              <View className={styles.quizScoreCard}>
                <Text className={styles.quizScoreValue}>{quizScore}</Text>
                <Text className={styles.quizScoreLabel}>分</Text>
              </View>
              <View className={styles.quizResultInfo}>
                <Text className={styles.quizResultText}>
                  样本: {selectedSample.chinese} [{selectedSample.phonetic}]
                </Text>
                <Text className={styles.quizResultText}>
                  方言: {selectedSample.dialect}
                </Text>
                <Text className={styles.quizResultText}>
                  录制时长: {formatDuration(quizTimer)}
                </Text>
                <Text className={styles.quizResultText}>
                  {quizScore >= 90 ? '发音非常准确！' : quizScore >= 80 ? '发音较好，继续努力！' : '还需多加练习哦！'}
                </Text>
              </View>
              <View className={styles.quizResultActions}>
                <View className={styles.quizActionBtn} style={{ flex: 1 }} onClick={handleRetryQuiz}>
                  <Text style={{ color: '#fff', fontSize: '28rpx', fontWeight: 500 }}>再试一次</Text>
                </View>
                <View className={styles.quizCancelBtn} style={{ flex: 1 }} onClick={handleEndQuiz}>
                  <Text style={{ fontSize: '28rpx', color: '#9E9185' }}>结束测验</Text>
                </View>
              </View>
            </>
          )}
        </View>
      )}

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
                {playingSampleId === sample.id ? (
                  <View className={styles.pauseIcon} />
                ) : (
                  <View className={styles.playIcon} />
                )}
              </View>
            </View>
            {playingSampleId === sample.id && (
              <View className={styles.audioProgressBar}>
                <View
                  className={styles.audioProgressFill}
                  style={{ width: `${playProgress[sample.id] || 0}%` }}
                />
              </View>
            )}
          </View>
        ))}
      </View>

      {quizStep === 'idle' && (
        <>
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

          {quizRecords.length > 0 && (
            <>
              <View className={styles.sectionHeader}>
                <Text className={styles.sectionTitle}>测验记录</Text>
              </View>
              <View className={styles.sampleSection}>
                {quizRecords.slice(0, 10).map(record => (
                  <View key={record.id} className={styles.sampleCard}>
                    <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flex: 1 }}>
                        <Text className={styles.sampleChinese}>{record.sampleChinese}</Text>
                        <Text className={styles.samplePhonetic}>{record.samplePhonetic}</Text>
                        <Text className={styles.sampleMeta}>{record.dialect} · {record.date} · 录制 {formatDuration(record.recordingDuration)}</Text>
                      </View>
                      <Text style={{ fontSize: '40rpx', fontWeight: 700, color: record.score >= 90 ? '#5B8C7A' : record.score >= 80 ? '#C07842' : '#D45B5B' }}>
                        {record.score}分
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </>
      )}

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
