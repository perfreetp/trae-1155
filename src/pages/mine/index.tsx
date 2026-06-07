import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import StatCard from '@/components/StatCard';
import StatusTag from '@/components/StatusTag';
import { mockUserStats, mockUploadItems, mockOfflinePackages } from '@/data/mockData';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const [showExport, setShowExport] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [copied, setCopied] = useState(false);
  const { recordings, entries, reviews, quizRecords } = useAppStore();

  const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    return `${h}`;
  };

  const pendingCount = mockUploadItems.filter(u => u.status === 'pending' || u.status === 'failed').length;

  const generateExportData = () => {
    if (exportFormat === 'json') {
      return JSON.stringify({
        exportDate: new Date().toISOString(),
        recordings: recordings.map(r => ({
          id: r.id,
          speakerName: r.speakerName,
          village: r.villageName,
          dialect: r.dialect,
          duration: r.duration,
          status: r.status,
          entryCount: r.entries,
          date: r.date,
        })),
        entries: entries.map(e => ({
          id: e.id,
          chinese: e.chinese,
          phonetic: e.phonetic,
          definition: e.definition,
          exampleSentence: e.exampleSentence,
          dialect: e.dialect,
          region: e.region,
        })),
        reviews: reviews.map(r => ({
          id: r.id,
          transcription: r.transcription,
          previousTranscription: r.previousTranscription,
          status: r.status,
          version: r.version,
          feedback: r.feedback,
        })),
        quizRecords: quizRecords.map(q => ({
          id: q.id,
          sampleChinese: q.sampleChinese,
          samplePhonetic: q.samplePhonetic,
          dialect: q.dialect,
          score: q.score,
          date: q.date,
        })),
      }, null, 2);
    }

    const csvLines: string[] = [];
    csvLines.push('类型,ID,内容,方言,状态,日期');
    recordings.forEach(r => {
      csvLines.push(`采录,${r.id},${r.speakerName}@${r.villageName},${r.dialect},${r.status},${r.date}`);
    });
    entries.forEach(e => {
      csvLines.push(`词条,${e.id},${e.chinese}[${e.phonetic}],${e.dialect},,${e.createdAt || ''}`);
    });
    quizRecords.forEach(q => {
      csvLines.push(`测验,${q.id},${q.sampleChinese}[${q.samplePhonetic}],${q.dialect},${q.score}分,${q.date}`);
    });
    return csvLines.join('\n');
  };

  const handleExport = () => {
    setShowExport(true);
  };

  const handleCopy = () => {
    const data = generateExportData();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(data).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = data;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error('Copy failed', e);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleDownload = () => {
    const data = generateExportData();
    const blob = new Blob([data], { type: exportFormat === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dialect_export_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
        <StatCard value={recordings.length} label="采录次数" />
        <StatCard value={entries.length} label="词条数" />
        <StatCard value={formatDuration(recordings.reduce((sum, r) => sum + (r.duration || 0), 0))} label="时长(h)" />
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
          <View className={styles.menuItem} onClick={handleExport}>
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

      {showExport && (
        <View className={styles.exportOverlay} onClick={() => setShowExport(false)}>
          <View className={styles.exportModal} onClick={e => e.stopPropagation()}>
            <Text className={styles.exportTitle}>资料导出</Text>
            <View className={styles.exportFormatRow}>
              <View
                className={exportFormat === 'json' ? styles.exportFormatActive : styles.exportFormatBtn}
                onClick={() => setExportFormat('json')}
              >
                <Text style={{ fontSize: '28rpx', color: exportFormat === 'json' ? '#C07842' : '#6B5D4F' }}>JSON</Text>
              </View>
              <View
                className={exportFormat === 'csv' ? styles.exportFormatActive : styles.exportFormatBtn}
                onClick={() => setExportFormat('csv')}
              >
                <Text style={{ fontSize: '28rpx', color: exportFormat === 'csv' ? '#C07842' : '#6B5D4F' }}>CSV</Text>
              </View>
            </View>
            <View className={styles.exportPreview}>
              <Text className={styles.exportPreviewText}>
                {generateExportData().substring(0, 500)}...
              </Text>
            </View>
            <View className={styles.exportSummary}>
              <Text className={styles.exportSummaryText}>
                采录 {recordings.length} 条 · 词条 {entries.length} 条 · 审核 {reviews.length} 条 · 测验 {quizRecords.length} 条
              </Text>
            </View>
            <View className={styles.exportActions}>
              <View className={styles.exportCopyBtn} onClick={handleCopy}>
                <Text style={{ color: '#C07842', fontSize: '28rpx', fontWeight: 500 }}>
                  {copied ? '已复制 ✓' : '复制到剪贴板'}
                </Text>
              </View>
              <View className={styles.exportDownloadBtn} onClick={handleDownload}>
                <Text style={{ color: '#fff', fontSize: '28rpx', fontWeight: 500 }}>下载文件</Text>
              </View>
            </View>
            <View className={styles.exportCloseBtn} onClick={() => setShowExport(false)}>
              <Text style={{ fontSize: '28rpx', color: '#9E9185' }}>关闭</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default MinePage;
