import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import { mockSpeakers } from '@/data/mockData';
import styles from './index.module.scss';

const dialectFilters = ['全部', '闽南语', '客家话', '粤语', '吴语', '湘语'];

interface SpeakerDetail {
  id: string;
  name: string;
  age: number;
  gender: string;
  birthplace: string;
  dialect: string;
  latitude: number;
  longitude: number;
  recordingCount: number;
  avatar: string;
}

const MapPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('全部');
  const [selectedSpeaker, setSelectedSpeaker] = useState<SpeakerDetail | null>(null);

  const filteredSpeakers = mockSpeakers.filter(
    s => activeFilter === '全部' || s.dialect === activeFilter
  );

  const dialectColorMap: Record<string, string> = {
    '闽南语': '#C07842',
    '客家话': '#5B8C7A',
    '粤语': '#D45B5B',
    '吴语': '#4A90D9',
    '湘语': '#E8A455',
  };

  const regionGroups = filteredSpeakers.reduce((acc, speaker) => {
    const key = speaker.dialect;
    if (!acc[key]) acc[key] = [];
    acc[key].push(speaker);
    return acc;
  }, {} as Record<string, typeof mockSpeakers>);

  const handleSpeakerClick = (speaker: typeof mockSpeakers[0]) => {
    setSelectedSpeaker({
      id: speaker.id,
      name: speaker.name,
      age: speaker.age,
      gender: speaker.gender === 'male' ? '男' : '女',
      birthplace: speaker.birthplace,
      dialect: speaker.dialect,
      latitude: speaker.latitude,
      longitude: speaker.longitude,
      recordingCount: speaker.recordingCount,
      avatar: speaker.avatar,
    });
  };

  return (
    <View className={styles.mapPage}>
      <View className={styles.mapArea}>
        <View className={styles.mapHeader}>
          <Text className={styles.mapHeaderTitle}>方言地理分布</Text>
          <Text className={styles.mapHeaderCount}>{filteredSpeakers.length} 位发音人</Text>
        </View>
        <View className={styles.mapCanvas}>
          {Object.entries(regionGroups).map(([dialect, speakers]) => (
            <View key={dialect} className={styles.dialectRegion}>
              <View
                className={styles.dialectLabel}
                style={{ backgroundColor: dialectColorMap[dialect] || '#999' }}
              >
                <Text style={{ color: '#fff', fontSize: '22rpx', fontWeight: 600 }}>{dialect}</Text>
              </View>
              <View className={styles.markerRow}>
                {speakers.map(speaker => (
                  <View
                    key={speaker.id}
                    className={styles.marker}
                    style={{ borderColor: dialectColorMap[dialect] || '#999' }}
                    onClick={() => handleSpeakerClick(speaker)}
                  >
                    <View
                      className={styles.markerDot}
                      style={{ backgroundColor: dialectColorMap[dialect] || '#999' }}
                    />
                    <Text className={styles.markerName}>{speaker.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>

      {selectedSpeaker && (
        <View className={styles.detailCard}>
          <View className={styles.detailHeader}>
            <Image src={selectedSpeaker.avatar} mode="aspectFill" className={styles.detailAvatar} />
            <View className={styles.detailInfo}>
              <Text className={styles.detailName}>{selectedSpeaker.name}</Text>
              <Text className={styles.detailMeta}>
                {selectedSpeaker.age}岁 · {selectedSpeaker.gender}
              </Text>
            </View>
            <View className={styles.detailClose} onClick={() => setSelectedSpeaker(null)}>
              <Text style={{ color: '#9E9185', fontSize: '28rpx' }}>✕</Text>
            </View>
          </View>
          <View className={styles.detailGrid}>
            <View className={styles.detailItem}>
              <Text className={styles.detailItemLabel}>籍贯</Text>
              <Text className={styles.detailItemValue}>{selectedSpeaker.birthplace}</Text>
            </View>
            <View className={styles.detailItem}>
              <Text className={styles.detailItemLabel}>方言</Text>
              <Text className={styles.detailItemValue}>{selectedSpeaker.dialect}</Text>
            </View>
            <View className={styles.detailItem}>
              <Text className={styles.detailItemLabel}>坐标</Text>
              <Text className={styles.detailItemValue}>
                {selectedSpeaker.latitude}°N, {selectedSpeaker.longitude}°E
              </Text>
            </View>
            <View className={styles.detailItem}>
              <Text className={styles.detailItemLabel}>录音数量</Text>
              <Text className={styles.detailItemValue}>{selectedSpeaker.recordingCount} 条</Text>
            </View>
          </View>
        </View>
      )}

      <View className={styles.filterBar}>
        {dialectFilters.map(d => (
          <View
            key={d}
            className={classnames(
              styles.filterTag,
              activeFilter === d ? styles.filterTagActive : ''
            )}
            onClick={() => { setActiveFilter(d); setSelectedSpeaker(null); }}
          >
            <Text>{d}</Text>
          </View>
        ))}
      </View>

      <View className={styles.speakerSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            发音人 ({filteredSpeakers.length})
          </Text>
        </View>
        {filteredSpeakers.map(speaker => (
          <View key={speaker.id} className={styles.speakerCard} onClick={() => handleSpeakerClick(speaker)}>
            <Image
              src={speaker.avatar}
              mode="aspectFill"
              className={styles.speakerAvatar}
            />
            <View className={styles.speakerInfo}>
              <Text className={styles.speakerName}>{speaker.name}</Text>
              <Text className={styles.speakerPlace}>
                {speaker.birthplace}
              </Text>
              <View className={styles.speakerMeta}>
                <Text className={styles.speakerDialect}>{speaker.dialect}</Text>
                <Text className={styles.speakerCount}>
                  {speaker.recordingCount}条录音
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default MapPage;
