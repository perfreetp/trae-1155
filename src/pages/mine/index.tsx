import React, { useState, useRef } from 'react';
import { View, Text, Image, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import StatCard from '@/components/StatCard';
import StatusTag from '@/components/StatusTag';
import { mockUserStats, mockUploadItems } from '@/data/mockData';
import { useAppStore } from '@/store';
import type { RecordingSession, DictEntry, ReviewItem, QuizRecord, OfflinePackage } from '@/types';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const [showExport, setShowExport] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [copied, setCopied] = useState(false);
  const [showPackageManager, setShowPackageManager] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { recordings, entries, reviews, quizRecords, offlinePackages, deleteOfflinePackage, updateOfflinePackage, importData } = useAppStore();

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
          hasConsent: r.hasConsent,
          noiseLevel: r.noiseLevel,
        })),
        entries: entries.map(e => ({
          id: e.id,
          chinese: e.chinese,
          phonetic: e.phonetic,
          definition: e.definition,
          exampleSentence: e.exampleSentence,
          dialect: e.dialect,
          region: e.region,
          sessionId: e.sessionId,
        })),
        reviews: reviews.map(r => ({
          id: r.id,
          entryId: r.entryId,
          chinese: r.chinese,
          transcription: r.transcription,
          previousTranscription: r.previousTranscription || '',
          status: r.status,
          version: r.version,
          feedback: r.feedback || '',
          sessionId: r.sessionId || '',
          resolved: r.resolved || false,
          createdAt: r.createdAt,
        })),
        quizRecords: quizRecords.map(q => ({
          id: q.id,
          sampleChinese: q.sampleChinese,
          samplePhonetic: q.samplePhonetic,
          dialect: q.dialect,
          score: q.score,
          date: q.date,
          recordingDuration: q.recordingDuration,
        })),
      }, null, 2);
    }

    const csvLines: string[] = [];
    csvLines.push('类型,ID,词条/内容,方言,审核状态,退回原因,当前转写,修改前转写,对应会话,日期');
    recordings.forEach(r => {
      csvLines.push(`采录,${r.id},${r.speakerName}@${r.villageName},${r.dialect},${r.status},,,,,${r.id},${r.date}`);
    });
    entries.forEach(e => {
      csvLines.push(`词条,${e.id},${e.chinese}[${e.phonetic}],${e.dialect},,,,,${e.sessionId || ''},${e.createdAt || ''}`);
    });
    reviews.forEach(r => {
      const entry = entries.find(e => e.id === r.entryId);
      const dialect = entry?.dialect || '';
      csvLines.push(`审核,${r.id},${r.chinese},${dialect},${r.status},${r.feedback || ''},${r.transcription},${r.previousTranscription || ''},${r.sessionId || ''},${r.createdAt}`);
    });
    quizRecords.forEach(q => {
      csvLines.push(`测验,${q.id},${q.sampleChinese}[${q.samplePhonetic}],${q.dialect},${q.score}分,,,,,${q.date}`);
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

  const handleImport = () => {
    setShowImport(true);
    setImportText('');
    setImportStatus('idle');
  };

  const handleImportConfirm = () => {
    try {
      const data = JSON.parse(importText);
      const importPayload: {
        recordings?: RecordingSession[];
        entries?: DictEntry[];
        reviews?: ReviewItem[];
        quizRecords?: QuizRecord[];
      } = {};

      if (data.recordings && Array.isArray(data.recordings)) importPayload.recordings = data.recordings;
      if (data.entries && Array.isArray(data.entries)) importPayload.entries = data.entries;
      if (data.reviews && Array.isArray(data.reviews)) importPayload.reviews = data.reviews;
      if (data.quizRecords && Array.isArray(data.quizRecords)) importPayload.quizRecords = data.quizRecords;

      importData(importPayload);
      setImportStatus('success');

      const counts = {
        recordings: importPayload.recordings?.length || 0,
        entries: importPayload.entries?.length || 0,
        reviews: importPayload.reviews?.length || 0,
        quizRecords: importPayload.quizRecords?.length || 0,
      };
      Taro.showToast({ title: `导入成功: ${counts.recordings}采录 ${counts.entries}词条 ${counts.reviews}审核 ${counts.quizRecords}测验`, icon: 'none', duration: 3000 });
    } catch (e) {
      setImportStatus('error');
      Taro.showToast({ title: 'JSON 格式有误，请检查后重试', icon: 'none' });
    }
  };

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setImportText(text);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const getPackageContents = (pkg: OfflinePackage) => {
    const pkgRecordings = recordings.filter(r => r.dialect === pkg.dialect);
    const pkgEntries = entries.filter(e => e.dialect === pkg.dialect);
    const pkgReviews = reviews.filter(r => pkgEntries.some(e => e.id === r.entryId));
    return { recordings: pkgRecordings, entries: pkgEntries, reviews: pkgReviews };
  };

  const computePackageSize = (contents: ReturnType<typeof getPackageContents>) => {
    const baseMB = contents.recordings.length * 12 + contents.entries.length * 0.5 + contents.reviews.length * 0.2;
    return `${Math.max(Math.round(baseMB), 1)}MB`;
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
        <Text className={styles.sectionAction} onClick={() => {}}>管理</Text>
      </View>

      <View className={styles.offlineSection}>
        {offlinePackages.map(pkg => {
          const contents = getPackageContents(pkg);
          const liveSize = computePackageSize(contents);
          return (
          <View key={pkg.id} className={styles.offlineCard}>
            <View className={styles.offlineInfo}>
              <Text className={styles.offlineName}>{pkg.name}</Text>
              <Text className={styles.offlineMeta}>
                {pkg.dialect} · {contents.entries.length}词条 · {liveSize}
              </Text>
              {pkg.lastUpdated && (
                <Text className={styles.offlineMeta}>更新于 {pkg.lastUpdated}</Text>
              )}
            </View>
            <View className={styles.offlineActions}>
              <View className={styles.offlineActionBtn} onClick={() => setShowPackageManager(pkg.id)}>
                <Text style={{ fontSize: '24rpx', color: '#6B5D4F' }}>管理</Text>
              </View>
            </View>
          </View>
        );
        })}
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
          <View className={styles.menuItem} onClick={handleImport}>
            <View className={styles.menuItemLeft}>
              <Text className={styles.menuItemIcon}>📥</Text>
              <Text className={styles.menuItemText}>导入资料</Text>
              <Text className={styles.menuItemBadgeNew}>JSON</Text>
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

      {showPackageManager && (() => {
        const pkg = offlinePackages.find(p => p.id === showPackageManager);
        if (!pkg) return null;
        const contents = getPackageContents(pkg);
        const liveSize = computePackageSize(contents);
        return (
          <View className={styles.exportOverlay} onClick={() => setShowPackageManager(null)}>
            <View className={styles.exportModal} onClick={e => e.stopPropagation()}>
              <Text className={styles.exportTitle}>{pkg.name} - 包内容</Text>
              <View className={styles.pkgContentList}>
                <View className={styles.pkgContentItem}>
                  <Text className={styles.pkgContentLabel}>方言</Text>
                  <Text className={styles.pkgContentValue}>{pkg.dialect}</Text>
                </View>
                <View className={styles.pkgContentItem}>
                  <Text className={styles.pkgContentLabel}>采录会话</Text>
                  <Text className={styles.pkgContentValue}>{contents.recordings.length} 条</Text>
                </View>
                <View className={styles.pkgContentItem}>
                  <Text className={styles.pkgContentLabel}>词条</Text>
                  <Text className={styles.pkgContentValue}>{contents.entries.length} 条</Text>
                </View>
                <View className={styles.pkgContentItem}>
                  <Text className={styles.pkgContentLabel}>审核记录</Text>
                  <Text className={styles.pkgContentValue}>{contents.reviews.length} 条</Text>
                </View>
                <View className={styles.pkgContentItem}>
                  <Text className={styles.pkgContentLabel}>占用空间</Text>
                  <Text className={styles.pkgContentValue}>{liveSize}</Text>
                </View>
                <View className={styles.pkgContentItem}>
                  <Text className={styles.pkgContentLabel}>下载日期</Text>
                  <Text className={styles.pkgContentValue}>{pkg.downloadDate}</Text>
                </View>
                {pkg.lastUpdated && (
                  <View className={styles.pkgContentItem}>
                    <Text className={styles.pkgContentLabel}>最后更新</Text>
                    <Text className={styles.pkgContentValue}>{pkg.lastUpdated}</Text>
                  </View>
                )}
              </View>

              {contents.recordings.length > 0 && (
                <View className={styles.pkgDetailSection}>
                  <Text className={styles.pkgDetailTitle}>采录会话</Text>
                  {contents.recordings.slice(0, 5).map(r => (
                    <View key={r.id} className={styles.pkgDetailItem}>
                      <Text className={styles.pkgDetailText}>{r.speakerName}@{r.villageName}</Text>
                      <Text className={styles.pkgDetailMeta}>{r.status} · {r.entries}词条</Text>
                    </View>
                  ))}
                  {contents.recordings.length > 5 && (
                    <Text className={styles.pkgDetailMore}>...共 {contents.recordings.length} 条</Text>
                  )}
                </View>
              )}

              {contents.entries.length > 0 && (
                <View className={styles.pkgDetailSection}>
                  <Text className={styles.pkgDetailTitle}>词条</Text>
                  {contents.entries.slice(0, 5).map(e => (
                    <View key={e.id} className={styles.pkgDetailItem}>
                      <Text className={styles.pkgDetailText}>{e.chinese} [{e.phonetic}]</Text>
                      <Text className={styles.pkgDetailMeta}>{e.definition}</Text>
                    </View>
                  ))}
                  {contents.entries.length > 5 && (
                    <Text className={styles.pkgDetailMore}>...共 {contents.entries.length} 条</Text>
                  )}
                </View>
              )}

              {contents.reviews.length > 0 && (
                <View className={styles.pkgDetailSection}>
                  <Text className={styles.pkgDetailTitle}>审核记录</Text>
                  {contents.reviews.slice(0, 3).map(r => (
                    <View key={r.id} className={styles.pkgDetailItem}>
                      <Text className={styles.pkgDetailText}>{r.chinese} - {r.status}</Text>
                      <Text className={styles.pkgDetailMeta}>{r.feedback || r.transcription}</Text>
                    </View>
                  ))}
                  {contents.reviews.length > 3 && (
                    <Text className={styles.pkgDetailMore}>...共 {contents.reviews.length} 条</Text>
                  )}
                </View>
              )}

              <View className={styles.exportActions}>
                <View className={styles.exportCopyBtn} style={{ flex: 1 }} onClick={() => { updateOfflinePackage(pkg.id); Taro.showToast({ title: '已更新', icon: 'success' }); }}>
                  <Text style={{ color: '#C07842', fontSize: '28rpx', fontWeight: 500 }}>更新包</Text>
                </View>
                <View className={styles.exportDownloadBtn} style={{ flex: 1, backgroundColor: '#D45B5B' }} onClick={() => { deleteOfflinePackage(pkg.id); setShowPackageManager(null); Taro.showToast({ title: '已删除', icon: 'success' }); }}>
                  <Text style={{ color: '#fff', fontSize: '28rpx', fontWeight: 500 }}>删除包</Text>
                </View>
              </View>
              <View className={styles.exportCloseBtn} onClick={() => setShowPackageManager(null)}>
                <Text style={{ fontSize: '28rpx', color: '#9E9185' }}>关闭</Text>
              </View>
            </View>
          </View>
        );
      })()}

      {showImport && (
        <View className={styles.exportOverlay} onClick={() => setShowImport(false)}>
          <View className={styles.exportModal} onClick={e => e.stopPropagation()}>
            <Text className={styles.exportTitle}>导入资料</Text>
            <Text className={styles.importDesc}>粘贴 JSON 内容或选择 JSON 文件导入，重复数据将自动跳过不叠加</Text>
            <View className={styles.importActions}>
              <View className={styles.fileSelectBtn} onClick={handleFileSelect}>
                <Text style={{ color: '#C07842', fontSize: '28rpx', fontWeight: 500 }}>选择 JSON 文件</Text>
              </View>
            </View>
            <View className={styles.importTextArea}>
              <textarea
                style={{ width: '100%', minHeight: '200rpx', border: '2rpx solid #E8DDD0', borderRadius: '12rpx', padding: '16rpx', fontSize: '24rpx', fontFamily: 'monospace', resize: 'vertical' }}
                placeholder="或直接粘贴 JSON 内容..."
                value={importText}
                onChange={e => { setImportText(e.target.value); setImportStatus('idle'); }}
              />
            </View>
            {importStatus === 'success' && (
              <Text className={styles.importSuccess}>导入成功！新增数据已合并到当前资料库</Text>
            )}
            {importStatus === 'error' && (
              <Text className={styles.importError}>JSON 格式有误，请检查后重试</Text>
            )}
            <View className={styles.exportActions}>
              <View className={styles.exportDownloadBtn} style={{ flex: 1 }} onClick={handleImportConfirm}>
                <Text style={{ color: '#fff', fontSize: '28rpx', fontWeight: 500 }}>确认导入</Text>
              </View>
              <View className={styles.exportCopyBtn} style={{ flex: 1 }} onClick={() => setShowImport(false)}>
                <Text style={{ color: '#C07842', fontSize: '28rpx', fontWeight: 500 }}>关闭</Text>
              </View>
            </View>
          </View>
        </View>
      )}

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
                {generateExportData().substring(0, 600)}...
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
