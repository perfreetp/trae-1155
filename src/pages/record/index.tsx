import React, { useState, useRef, useCallback } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import StatusTag from '@/components/StatusTag';
import { mockRecordingSessions } from '@/data/mockData';
import styles from './index.module.scss';

const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const RecordPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [noiseLevel] = useState<'low' | 'medium' | 'high'>('low');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setIsPaused(false);
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
    console.info('[Record] Recording started');
  }, []);

  const pauseRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsPaused(true);
    console.info('[Record] Recording paused at', elapsed);
  }, [elapsed]);

  const resumeRecording = useCallback(() => {
    setIsPaused(false);
    timerRef.current = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
    console.info('[Record] Recording resumed');
  }, []);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
    setIsPaused(false);
    Taro.showToast({ title: '采录已保存', icon: 'success' });
    console.info('[Record] Recording stopped, duration:', elapsed);
  }, [elapsed]);

  const handleConsent = () => {
    Taro.navigateTo({ url: '/pages/consent/index' });
  };

  const activeSession = mockRecordingSessions.find(s => s.status === 'recording');
  const draftSession = mockRecordingSessions.find(s => s.status === 'draft');
  const completedSessions = mockRecordingSessions.filter(
    s => s.status === 'completed' || s.status === 'paused' || s.status === 'reviewing'
  );

  return (
    <View className={styles.recordPage}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>田野采录</Text>
        <Text className={styles.headerSubtitle}>记录最真实的方言声音</Text>
      </View>

      {!isRecording && noiseLevel !== 'low' && (
        <View className={styles.noiseAlert}>
          <Text className={styles.noiseIcon}>⚠️</Text>
          <Text className={styles.noiseText}>
            检测到环境噪声较大，建议移至安静场所采录
          </Text>
          <Text
            className={`${styles.noiseLevel} ${
              noiseLevel === 'medium' ? styles.noiseMedium : styles.noiseHigh
            }`}
          >
            {noiseLevel === 'medium' ? '中等' : '较高'}
          </Text>
        </View>
      )}

      <View className={styles.recordingControl}>
        <View className={styles.recordingStatus}>
          {isRecording && !isPaused && <View className={styles.recordingDot} />}
          <Text
            className={`${styles.recordingStatusText} ${
              !isRecording ? styles.idleText : ''
            }`}
          >
            {!isRecording
              ? '准备采录'
              : isPaused
              ? '已暂停'
              : '采录中...'}
          </Text>
        </View>

        <Text className={styles.recordingTimer}>
          {isRecording ? formatDuration(elapsed) : '00:00:00'}
        </Text>

        <View className={styles.recordingBtnGroup}>
          {(isRecording && !isPaused) && (
            <View className={styles.controlBtn} onClick={pauseRecording}>
              <Text className={styles.controlIcon}>⏸</Text>
            </View>
          )}
          {isPaused && (
            <View className={styles.controlBtn} onClick={resumeRecording}>
              <Text className={styles.controlIcon}>▶</Text>
            </View>
          )}

          <View
            className={`${styles.recordBtn} ${
              isRecording && !isPaused ? styles.recordBtnRecording : ''
            }`}
            onClick={() => {
              if (!isRecording) {
                startRecording();
              } else {
                stopRecording();
              }
            }}
          >
            {isRecording ? (
              <View className={`${styles.recordBtnIcon} ${styles.stopIcon}`} />
            ) : (
              <View className={styles.recordBtnIcon} />
            )}
          </View>

          {isRecording && (
            <View className={styles.controlBtn} onClick={stopRecording}>
              <Text className={styles.controlIcon}>⏹</Text>
            </View>
          )}
        </View>

        <Text className={styles.consentHint}>
          采录前请确保已签署
          <Text className={styles.consentLink} onClick={handleConsent}>
            知情同意书
          </Text>
        </Text>
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>采录会话</Text>
        {draftSession && (
          <Text className={styles.sectionAction}>继续未完成</Text>
        )}
      </View>

      <View className={styles.sessionList}>
        {completedSessions.map(session => (
          <View
            key={session.id}
            className={styles.sessionCard}
            onClick={() =>
              Taro.navigateTo({ url: `/pages/recordDetail/index?id=${session.id}` })
            }
          >
            <View className={styles.sessionHeader}>
              <Text className={styles.sessionSpeaker}>{session.speakerName}</Text>
              <StatusTag status={session.status} />
            </View>
            <View className={styles.sessionMeta}>
              <Text className={styles.sessionVillage}>{session.villageName}</Text>
              <Text className={styles.sessionInfo}>
                {session.speakerAge}岁 · {session.speakerGender === 'male' ? '男' : '女'}
              </Text>
              {session.noiseLevel && session.noiseLevel !== 'low' && (
                <Text className={styles.sessionInfo}>
                  噪声: {session.noiseLevel === 'medium' ? '中' : '高'}
                </Text>
              )}
            </View>
            <View className={styles.sessionStats}>
              <Text className={styles.sessionStat}>
                时长{' '}
                <Text className={styles.sessionStatValue}>
                  {formatDuration(session.duration)}
                </Text>
              </Text>
              <Text className={styles.sessionStat}>
                词条{' '}
                <Text className={styles.sessionStatValue}>{session.entries}</Text>
              </Text>
              <Text className={styles.sessionStat}>
                {session.date}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default RecordPage;
