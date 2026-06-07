import React, { useState, useMemo } from 'react';
import { View, Text, Input, Picker } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import StatusTag from '@/components/StatusTag';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

const DIALECTS = ['闽南语', '客家话', '粤语', '吴语', '湘语', '赣语', '晋语', '徽语'];
const REGIONS = ['福建泉州', '广东梅州', '广东台山', '江苏苏州', '湖南长沙', '江西南昌', '山西太原', '安徽歙县'];

const EntryDetailPage: React.FC = () => {
  const router = useRouter();
  const mode = router.params.mode;
  const entryId = router.params.id;
  const { entries, addEntry } = useAppStore();

  const isAddMode = mode === 'add';

  const existingEntry = useMemo(() => {
    if (isAddMode || !entryId) return null;
    return entries.find(e => e.id === entryId) || null;
  }, [entryId, isAddMode, entries]);

  const [chinese, setChinese] = useState(existingEntry?.chinese || '');
  const [phonetic, setPhonetic] = useState(existingEntry?.phonetic || '');
  const [definition, setDefinition] = useState(existingEntry?.definition || '');
  const [exampleSentence, setExampleSentence] = useState(existingEntry?.exampleSentence || '');
  const [synonymsText, setSynonymsText] = useState(existingEntry?.synonyms.join('、') || '');
  const [usageScenario, setUsageScenario] = useState(existingEntry?.usageScenario || '');
  const [dialect, setDialect] = useState(existingEntry?.dialect || DIALECTS[0]);
  const [region, setRegion] = useState(existingEntry?.region || REGIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const entry = existingEntry;

  const handleSave = () => {
    if (!chinese.trim()) {
      Taro.showToast({ title: '请输入汉字', icon: 'none' });
      return;
    }
    if (!definition.trim()) {
      Taro.showToast({ title: '请输入释义', icon: 'none' });
      return;
    }
    const newEntry = {
      id: `e_${Date.now()}`,
      chinese: chinese.trim(),
      phonetic: phonetic.trim(),
      definition: definition.trim(),
      exampleSentence: exampleSentence.trim() || '暂无例句',
      synonyms: synonymsText ? synonymsText.split(/[、,，]/).map(s => s.trim()).filter(Boolean) : [],
      usageScenario: usageScenario.trim() || '通用',
      dialect,
      region,
      speakerName: '当前用户',
      audioUrl: '',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'draft' as const,
      tags: [dialect, usageScenario.trim() || '通用'].filter(Boolean),
    };
    addEntry(newEntry);
    Taro.showToast({ title: '词条已保存', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
    console.info('[EntryDetail] New entry saved:', newEntry.id);
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (isAddMode) {
    return (
      <View className={styles.entryDetailPage}>
        <View className={styles.formCard}>
          <Text className={styles.formTitle}>新增词条</Text>
          <View className={styles.formGroup}>
            <Text className={styles.fieldLabel}>汉字 *</Text>
            <Input className={styles.formInput} placeholder="请输入汉字" value={chinese} onInput={e => setChinese(e.detail.value)} />
          </View>
          <View className={styles.formGroup}>
            <Text className={styles.fieldLabel}>音标</Text>
            <Input className={styles.formInput} placeholder="请输入国际音标" value={phonetic} onInput={e => setPhonetic(e.detail.value)} />
          </View>
          <View className={styles.formGroup}>
            <Text className={styles.fieldLabel}>释义 *</Text>
            <Input className={styles.formInput} placeholder="请输入释义" value={definition} onInput={e => setDefinition(e.detail.value)} />
          </View>
          <View className={styles.formGroup}>
            <Text className={styles.fieldLabel}>例句</Text>
            <Input className={styles.formInput} placeholder="请输入例句" value={exampleSentence} onInput={e => setExampleSentence(e.detail.value)} />
          </View>
          <View className={styles.formGroup}>
            <Text className={styles.fieldLabel}>同义说法（用顿号分隔）</Text>
            <Input className={styles.formInput} placeholder="如：锅、镬" value={synonymsText} onInput={e => setSynonymsText(e.detail.value)} />
          </View>
          <View className={styles.formGroup}>
            <Text className={styles.fieldLabel}>使用场景</Text>
            <Input className={styles.formInput} placeholder="如：日常烹饪" value={usageScenario} onInput={e => setUsageScenario(e.detail.value)} />
          </View>
          <View className={styles.formGroup}>
            <Text className={styles.fieldLabel}>方言</Text>
            <Picker mode="selector" range={DIALECTS} value={DIALECTS.indexOf(dialect)} onChange={e => setDialect(DIALECTS[e.detail.value])}>
              <View className={styles.formPicker}>
                <Text>{dialect}</Text>
                <Text className={styles.pickerArrow}>›</Text>
              </View>
            </Picker>
          </View>
          <View className={styles.formGroup}>
            <Text className={styles.fieldLabel}>地区</Text>
            <Picker mode="selector" range={REGIONS} value={REGIONS.indexOf(region)} onChange={e => setRegion(REGIONS[e.detail.value])}>
              <View className={styles.formPicker}>
                <Text>{region}</Text>
                <Text className={styles.pickerArrow}>›</Text>
              </View>
            </Picker>
          </View>
        </View>
        <View className={styles.editBtn} onClick={handleSave}>
          <Text style={{ color: '#fff', fontSize: '32rpx', fontWeight: 600 }}>保存词条</Text>
        </View>
      </View>
    );
  }

  if (!entry) {
    return (
      <View className={styles.entryDetailPage}>
        <View className={styles.fieldGroup}>
          <Text className={styles.fieldValue}>未找到该词条</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.entryDetailPage}>
      <View className={styles.mainCard}>
        <Text className={styles.chineseChar}>{entry.chinese}</Text>
        <Text className={styles.phoneticText}>[{entry.phonetic}]</Text>

        <View className={styles.playerRow}>
          <View className={styles.playBtn} onClick={handlePlay}>
            <View className={styles.playIcon} />
          </View>
          <Text className={styles.playerLabel}>
            {isPlaying ? '播放中...' : '点击播放发音'}
          </Text>
        </View>

        <View style={{ display: 'flex', justifyContent: 'center' }}>
          <StatusTag status={entry.status} size="medium" />
        </View>
      </View>

      <View className={styles.fieldGroup}>
        <Text className={styles.fieldLabel}>释义</Text>
        <Text className={styles.fieldValue}>{entry.definition}</Text>
      </View>

      <View className={styles.fieldGroup}>
        <Text className={styles.fieldLabel}>例句</Text>
        <View className={styles.exampleBox}>
          <Text className={styles.fieldValue}>{entry.exampleSentence}</Text>
        </View>
      </View>

      <View className={styles.fieldGroup}>
        <Text className={styles.fieldLabel}>同义说法</Text>
        <View className={styles.synonymList}>
          {entry.synonyms.map(synonym => (
            <Text key={synonym} className={styles.synonymTag}>
              {synonym}
            </Text>
          ))}
        </View>
      </View>

      <View className={styles.fieldGroup}>
        <Text className={styles.fieldLabel}>使用场景</Text>
        <Text className={styles.fieldValue}>{entry.usageScenario}</Text>
      </View>

      <View className={styles.fieldGroup}>
        <Text className={styles.fieldLabel}>分类标签</Text>
        <View className={styles.tagList}>
          {entry.tags.map(tag => (
            <Text key={tag} className={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
      </View>

      <View className={styles.fieldGroup}>
        <View className={styles.metaRow}>
          <Text className={styles.metaText}>
            {entry.dialect} · {entry.region}
          </Text>
          <Text className={styles.metaText}>
            发音人: {entry.speakerName}
          </Text>
        </View>
        <View className={styles.metaRow}>
          <Text className={styles.metaText}>录入日期: {entry.createdAt}</Text>
        </View>
      </View>
    </View>
  );
};

export default EntryDetailPage;
