import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface AudioPlayerProps {
  title?: string;
  dialect?: string;
  playing?: boolean;
  onTogglePlay?: () => void;
  compact?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ title, dialect, playing = false, onTogglePlay, compact = false }) => {
  return (
    <View className={`${styles.player} ${compact ? styles.compact : ''}`} onClick={onTogglePlay}>
      <View className={`${styles.playBtn} ${playing ? styles.playing : ''}`}>
        <View className={styles.playIcon}>
          {playing ? (
            <View className={styles.pauseBars}>
              <View className={styles.bar} />
              <View className={styles.bar} />
            </View>
          ) : (
            <View className={styles.triangle} />
          )}
        </View>
      </View>
      {(title || dialect) && (
        <View className={styles.info}>
          {title && <Text className={styles.title}>{title}</Text>}
          {dialect && <Text className={styles.dialect}>{dialect}</Text>}
        </View>
      )}
    </View>
  );
};

export default AudioPlayer;
