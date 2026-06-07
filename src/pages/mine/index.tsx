import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import StatCard from '@/components/StatCard';
import StatusTag from '@/components/StatusTag';
import { mockUserStats, mockUploadItems, mockOfflinePackages } from '@/data/mockData';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    return `${h}`;
  };

  const pendingCount = mockUploadItems.filter(u => u.status === 'pending' || u.status === 'failed').length;

  return (
    <View className={styles.minePage}>
      <View className={styles.profileHeader}>
        <Image
          src="https://picsum.photos/id/64/200/200"
          mode="aspectFill"
          className={styles.avatar}
        />
        <View className={styles.profileInfo}>
          <Text className={styles.profileName}>张调查员</Text>
          <Text className={styles.profileRole}>田野调查员 · 闽南语片区</Text>
          <View className={styles.profileRank}>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '24rpx' }}>
              贡献排名 #{mockUserStats.contributionRank}
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.statsGrid}>
        <StatCard value={mockUserStats.totalRecordings} label="采录次数" />
        <StatCard value={mockUserStats.totalEntries} label="词条数" />
        <StatCard value={formatDuration(mockUserStats.totalDuration)} label="时长(h)" />
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>上传队列</Text>
        <Text className={styles.sectionAction}>
          {pendingCount > 0 ? `${pendingCount}项待上传` : '全部完成'}
        </Text>
      </View>

      <View className={styles.uploadSection}>
        {mockUploadItems.slice(0, 4).map(item => (
          <View key={item.id} className={styles.uploadCard}>
            <View className={styles.uploadHeader}>
              <Text className={styles.uploadName}>{item.name}</Text>
              <StatusTag status={item.status} size="small" />
            </View>
            <View className={styles.uploadMeta}>
              <Text className={styles.uploadSize}>{item.size}</Text>
              <Text className={styles.uploadSize}>{item.createdAt}</Text>
            </View>
            {(item.status === 'uploading' || item.status === 'failed') && (
              <View className={styles.uploadProgress}>
                <View
                  className={styles.uploadProgressFill}
                  style={{ width: `${item.progress}%` }}
                />
              </View>
            )}
          </View>
        ))}
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>离线包</Text>
        <Text className={styles.sectionAction}>管理</Text>
      </View>

      <View className={styles.offlineSection}>
        {mockOfflinePackages.map(pkg => (
          <View key={pkg.id} className={styles.offlineCard}>
            <View className={styles.offlineInfo}>
              <Text className={styles.offlineName}>{pkg.name}</Text>
              <Text className={styles.offlineMeta}>
                {pkg.dialect} · {pkg.entryCount}词条 · {pkg.size}
              </Text>
            </View>
            <View className={styles.offlineAction}>
              <Text style={{ fontSize: '24rpx', color: '#6B5D4F' }}>管理</Text>
            </View>
          </View>
        ))}
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>更多功能</Text>
      </View>

      <View className={styles.menuSection}>
        <View className={styles.menuCard}>
          <View className={styles.menuItem} onClick={() => Taro.navigateTo({ url: '/pages/map/index' })}>
            <View className={styles.menuItemLeft}>
              <Text className={styles.menuItemIcon}>📊</Text>
              <Text className={styles.menuItemText}>贡献统计</Text>
            </View>
            <Text className={styles.menuItemArrow}>›</Text>
          </View>
          <View className={styles.menuItem}>
            <View className={styles.menuItemLeft}>
              <Text className={styles.menuItemIcon}>📤</Text>
              <Text className={styles.menuItemText}>资料导出</Text>
            </View>
            <Text className={styles.menuItemArrow}>›</Text>
          </View>
          <View className={styles.menuItem}>
            <View className={styles.menuItemLeft}>
              <Text className={styles.menuItemIcon}>📥</Text>
              <Text className={styles.menuItemText}>下载离线包</Text>
              {mockUserStats.pendingUploads > 0 && (
                <Text className={styles.menuItemBadge}>
                  {mockUserStats.pendingUploads}
                </Text>
              )}
            </View>
            <Text className={styles.menuItemArrow}>›</Text>
          </View>
          <View className={styles.menuItem}>
            <View className={styles.menuItemLeft}>
              <Text className={styles.menuItemIcon}>⚙️</Text>
              <Text className={styles.menuItemText}>设置</Text>
            </View>
            <Text className={styles.menuItemArrow}>›</Text>
          </View>
          <View className={styles.menuItem}>
            <View className={styles.menuItemLeft}>
              <Text className={styles.menuItemIcon}>❓</Text>
              <Text className={styles.menuItemText}>帮助与反馈</Text>
            </View>
            <Text className={styles.menuItemArrow}>›</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MinePage;
