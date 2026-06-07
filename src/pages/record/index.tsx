import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, Input, Picker } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useAppStore } from '@/store';
import StatusTag from '@/components/StatusTag';
import styles from './index.module.scss';

const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const DIALECTS = ['闽南语', '客家话', '粤语', '吴语', '湘语', '赣语', '晋语', '徽语'];
const VILLAGES = ['安海镇', '洛阳镇', '梅城镇', '松口镇', '同里镇', '台城镇', '望城县', '浏阳市'];

const RecordPage: React.FC = () => {
  const router = useRouter();
  const continueId = router.params.continueId;
  const {
    recordings,
    entries,
    addRecording,
    updateRecording,
    activeRecordingId,
    setActiveRecordingId,
  } = useAppStore();

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [noiseLevel] = useState<'low' | 'medium' | 'high'>('low');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentSessionIdRef = useRef<string | null>(null);

  const [speakerName, setSpeakerName] = useState('');
  const [speakerAge, setSpeakerAge] = useState('60');
  const [villageName, setVillageName] = useState(VILLAGES[0]);
  const [dialect, setDialect] = useState(DIALECTS[0]);
  const [hasConsent, setHasConsent] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const elapsedRef = useRef(0);
  useEffect(() => { elapsedRef.current = elapsed; }, [elapsed]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (currentSessionIdRef.current && elapsedRef.current > 0) {
        updateRecording(currentSessionIdRef.current, {
          duration: elapsedRef.current,
          status: 'recording',
        });
      }
    };
  }, []);

  useEffect(() => {
    if (!isRecording || isPaused || !currentSessionIdRef.current) return;
    const autoSaveInterval = setInterval(() => {
      if (currentSessionIdRef.current) {
        updateRecording(currentSessionIdRef.current, {
          duration: elapsed,
        });
      }
    }, 5000);
    return () => clearInterval(autoSaveInterval);
  }, [isRecording, isPaused, elapsed, updateRecording]);

  useEffect(() => {
    if (continueId) {
      const session = recordings.find(r => r.id === continueId);
      if (session && (session.status === 'paused' || session.status === 'draft' || session.status === 'recording')) {
        currentSessionIdRef.current = session.id;
        setActiveRecordingId(session.id);
        setSpeakerName(session.speakerName);
        setSpeakerAge(String(session.speakerAge));
        setVillageName(session.villageName);
        setDialect(session.dialect);
        setHasConsent(session.hasConsent);
        setElapsed(session.duration);
        setIsRecording(true);
        setIsPaused(true);
        setShowForm(false);
      }
    }
  }, [continueId]);

  useEffect(() => {
    if (!continueId && activeRecordingId && !isRecording) {
      const session = recordings.find(r => r.id === activeRecordingId);
      if (session && (session.status === 'recording' || session.status === 'paused')) {
        currentSessionIdRef.current = session.id;
        setSpeakerName(session.speakerName);
        setSpeakerAge(String(session.speakerAge));
        setVillageName(session.villageName);
        setDialect(session.dialect);
        setHasConsent(session.hasConsent);
        setElapsed(session.duration);
        setIsRecording(true);
        setIsPaused(session.status === 'paused');
        setShowForm(false);
      }
    }
  }, [activeRecordingId]);

  const draftSessions = recordings.filter(s => s.status === 'draft' || s.status === 'paused' || s.status === 'recording');

  const startRecording = useCallback(() => {
    if (!speakerName.trim()) {
      Taro.showToast({ title: '请输入发音人姓名', icon: 'none' });
      return;
    }
    const newId = `rec_${Date.now()}`;
    const newSession = {
      id: newId,
      villageName,
      dialect,
      speakerName: speakerName.trim(),
      speakerAge: parseInt(speakerAge) || 60,
      speakerGender: 'male' as const,
      date: new Date().toISOString().split('T')[0],
      duration: 0,
      status: 'recording' as const,
      entries: 0,
      hasConsent,
      noiseLevel,
    };
    addRecording(newSession);
    currentSessionIdRef.current = newId;
    setActiveRecordingId(newId);
    setIsRecording(true);
    setIsPaused(false);
    setShowForm(false);
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
  }, [speakerName, speakerAge, villageName, dialect, hasConsent, noiseLevel, addRecording, setActiveRecordingId]);

  const pauseRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPaused(true);
    if (currentSessionIdRef.current) {
      updateRecording(currentSessionIdRef.current, {
        status: 'paused',
        duration: elapsed,
      });
    }
  }, [elapsed, updateRecording]);

  const resumeRecording = useCallback(() => {
    setIsPaused(false);
    timerRef.current = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
    if (currentSessionIdRef.current) {
      updateRecording(currentSessionIdRef.current, { status: 'recording' });
    }
  }, [updateRecording]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (currentSessionIdRef.current) {
      updateRecording(currentSessionIdRef.current, {
        status: 'completed',
        duration: elapsed,
      });
    }
    setIsRecording(false);
    setIsPaused(false);
    setActiveRecordingId(null);
    currentSessionIdRef.current = null;
    Taro.showToast({ title: '采录已保存', icon: 'success' });
  }, [elapsed, updateRecording, setActiveRecordingId]);

  const handleConsent = () => {
    Taro.navigateTo({ url: '/pages/consent/index' });
  };

  const handleContinueUnfinished = (session: typeof recordings[0]) => {
    currentSessionIdRef.current = session.id;
    setActiveRecordingId(session.id);
    setSpeakerName(session.speakerName);
    setSpeakerAge(String(session.speakerAge));
    setVillageName(session.villageName);
    setDialect(session.dialect);
    setHasConsent(session.hasConsent);
    setElapsed(session.duration);
    setIsRecording(true);
    setIsPaused(true);
    setShowForm(false);
  };

  const getEntryCount = (session: typeof recordings[0]) => {
    const linked = entries.filter(e => e.sessionId === session.id).length;
    return Math.max(session.entries, linked);
  };

  const sessionsToShow = recordings.filter(
    s => s.status === 'completed' || s.status === 'paused' || s.status === 'reviewing' || s.status === 'recording'
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

      {!isRecording && draftSessions.length > 0 && showForm && (
        <View className={styles.draftBanner}>
          <Text className={styles.draftIcon}>📋</Text>
          <View style={{ flex: 1 }}>
            <Text className={styles.draftTitle}>有 {draftSessions.length} 个未完成采录</Text>
            <Text className={styles.draftDesc}>点击恢复发音人、村点、知情同意、噪声和已录时长</Text>
          </View>
          {draftSessions.slice(0, 3).map(ds => (
            <View key={ds.id} className={styles.draftResumeBtn} onClick={() => handleContinueUnfinished(ds)}>
              <Text style={{ fontSize: '24rpx', color: '#C07842', fontWeight: 500 }}>
                {ds.speakerName}({formatDuration(ds.duration)})
              </Text>
            </View>
          ))}
        </View>
      )}

      {!isRecording && showForm && (
        <View className={styles.formCard}>
          <Text className={styles.formTitle}>采录信息</Text>
          <View className={styles.formRow}>
            <Text className={styles.formLabel}>发音人姓名</Text>
            <Input
              className={styles.formInput}
              placeholder="请输入发音人姓名"
              value={speakerName}
              onInput={e => setSpeakerName(e.detail.value)}
            />
          </View>
          <View className={styles.formRow}>
            <Text className={styles.formLabel}>年龄</Text>
            <Input
              className={styles.formInput}
              type="number"
              placeholder="请输入年龄"
              value={speakerAge}
              onInput={e => setSpeakerAge(e.detail.value)}
            />
          </View>
          <View className={styles.formRow}>
            <Text className={styles.formLabel}>村点</Text>
            <Picker mode="selector" range={VILLAGES} value={VILLAGES.indexOf(villageName)} onChange={e => setVillageName(VILLAGES[e.detail.value])}>
              <View className={styles.formPicker}>
                <Text>{villageName}</Text>
                <Text className={styles.pickerArrow}>›</Text>
              </View>
            </Picker>
          </View>
          <View className={styles.formRow}>
            <Text className={styles.formLabel}>方言</Text>
            <Picker mode="selector" range={DIALECTS} value={DIALECTS.indexOf(dialect)} onChange={e => setDialect(DIALECTS[e.detail.value])}>
              <View className={styles.formPicker}>
                <Text>{dialect}</Text>
                <Text className={styles.pickerArrow}>›</Text>
              </View>
            </Picker>
          </View>
          <View className={styles.formRow} onClick={() => setHasConsent(!hasConsent)}>
            <Text className={styles.formLabel}>知情同意</Text>
            <View className={`${styles.checkbox} ${hasConsent ? styles.checkboxChecked : ''}`}>
              {hasConsent && <Text className={styles.checkmark}>✓</Text>}
            </View>
          </View>
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

        {isRecording && (
          <Text className={styles.recordingInfo}>
            发音人: {speakerName} | {villageName} | {dialect}
          </Text>
        )}

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

        {!isRecording && (
          <Text className={styles.consentHint}>
            采录前请确保已签署
            <Text className={styles.consentLink} onClick={handleConsent}>
              知情同意书
            </Text>
          </Text>
        )}
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>采录会话</Text>
        {draftSessions.length > 0 && !isRecording && (
          <Text className={styles.sectionAction} onClick={() => handleContinueUnfinished(draftSessions[0])}>
            继续未完成
          </Text>
        )}
      </View>

      <View className={styles.sessionList}>
        {sessionsToShow.map(session => (
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
                <Text className={styles.sessionStatValue}>{getEntryCount(session)}</Text>
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
