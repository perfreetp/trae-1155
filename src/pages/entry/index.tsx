import React, { useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import StatusTag from '@/components/StatusTag';
import { mockEntries } from '@/data/mockData';
import styles from './index.module.scss';

const dialectFilters = ['全部', '闽南语', '客家话', '粤语', '吴语', '湘语'];

const EntryPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('全部');

  const filteredEntries = mockEntries.filter(entry => {
    const matchSearch =
      !searchText ||
      entry.chinese.includes(searchText) ||
      entry.phonetic.toLowerCase().includes(searchText.toLowerCase()) ||
      entry.definition.includes(searchText);
    const matchDialect = activeFilter === '全部' || entry.dialect === activeFilter;
    return matchSearch && matchDialect;
  });

  return (
    <View className={styles.entryPage}>
      <View className={styles.searchBar}>
        <Input
          className={styles.searchInput}
          placeholder="搜索汉字、音标或释义..."
          value={searchText}
          onInput={e => setSearchText(e.detail.value)}
        />
        <View className={styles.searchBtn}>
          <Text style={{ color: '#fff', fontSize: '28rpx' }}>搜索</Text>
        </View>
      </View>

      <View className={styles.filterRow}>
        {dialectFilters.map(dialect => (
          <View
            key={dialect}
            className={classnames(
              styles.filterTag,
              activeFilter === dialect ? styles.filterTagActive : ''
            )}
            onClick={() => setActiveFilter(dialect)}
          >
            <Text>{dialect}</Text>
          </View>
        ))}
      </View>

      <View className={styles.entryList}>
        {filteredEntries.map(entry => (
          <View
            key={entry.id}
            className={styles.entryCard}
            onClick={() =>
              Taro.navigateTo({ url: `/pages/entryDetail/index?id=${entry.id}` })
            }
          >
            <View className={styles.entryHeader}>
              <Text className={styles.entryChinese}>{entry.chinese}</Text>
              <StatusTag status={entry.status} size="small" />
            </View>
            <Text className={styles.entryPhonetic}>{entry.phonetic}</Text>
            <Text className={styles.entryDefinition}>{entry.definition}</Text>
            <View className={styles.entryExample}>
              <Text>例：{entry.exampleSentence}</Text>
            </View>
            <View className={styles.entryFooter}>
              <View className={styles.entryTags}>
                {entry.tags.map(tag => (
                  <Text key={tag} className={styles.entryTag}>
                    {tag}
                  </Text>
                ))}
              </View>
              <Text className={styles.entryDialect}>
                {entry.dialect} · {entry.region}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View
        className={styles.fab}
        onClick={() => Taro.navigateTo({ url: '/pages/entryDetail/index?mode=add' })}
      >
        <Text className={styles.fabIcon}>+</Text>
      </View>
    </View>
  );
};

export default EntryPage;
