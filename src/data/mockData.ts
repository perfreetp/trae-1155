import type { Project, VillageTask, RecordingSession, DictEntry, Speaker, ReviewItem, LearningTopic, LearningSample, UserStats, UploadItem, OfflinePackage } from '@/types';

export const mockProjects: Project[] = [
  { id: 'p1', name: '闽南语泉州片区', region: '福建泉州', dialect: '闽南语', totalTasks: 24, completedTasks: 16, status: 'active', coverImage: 'https://picsum.photos/id/787/750/400' },
  { id: 'p2', name: '客家话梅县调查', region: '广东梅州', dialect: '客家话', totalTasks: 18, completedTasks: 12, status: 'active', coverImage: 'https://picsum.photos/id/1082/750/400' },
  { id: 'p3', name: '吴语苏州话采录', region: '江苏苏州', dialect: '吴语', totalTasks: 20, completedTasks: 20, status: 'completed', coverImage: 'https://picsum.photos/id/1015/750/400' },
  { id: 'p4', name: '粤语台山话记录', region: '广东台山', dialect: '粤语', totalTasks: 15, completedTasks: 8, status: 'active', coverImage: 'https://picsum.photos/id/1036/750/400' },
  { id: 'p5', name: '湘语长沙话保护', region: '湖南长沙', dialect: '湘语', totalTasks: 22, completedTasks: 5, status: 'paused', coverImage: 'https://picsum.photos/id/1039/750/400' },
  { id: 'p6', name: '赣语南昌话保存', region: '江西南昌', dialect: '赣语', totalTasks: 16, completedTasks: 10, status: 'active', coverImage: 'https://picsum.photos/id/1044/750/400' },
  { id: 'p7', name: '晋语太原话采录', region: '山西太原', dialect: '晋语', totalTasks: 12, completedTasks: 3, status: 'active', coverImage: 'https://picsum.photos/id/3/750/400' },
  { id: 'p8', name: '徽语歙县调查', region: '安徽歙县', dialect: '徽语', totalTasks: 10, completedTasks: 7, status: 'active', coverImage: 'https://picsum.photos/id/1018/750/400' },
  { id: 'p9', name: '平话南宁采录', region: '广西南宁', dialect: '平话', totalTasks: 14, completedTasks: 0, status: 'paused', coverImage: 'https://picsum.photos/id/787/750/400' },
  { id: 'p10', name: '闽东语福州话', region: '福建福州', dialect: '闽东语', totalTasks: 19, completedTasks: 14, status: 'active', coverImage: 'https://picsum.photos/id/1082/750/400' },
];

export const mockVillageTasks: VillageTask[] = [
  { id: 'v1', villageName: '安海镇', region: '福建泉州', dialect: '闽南语', status: 'in_progress', totalEntries: 200, completedEntries: 145, assignee: '张调查员', deadline: '2026-08-01' },
  { id: 'v2', villageName: '洛阳镇', region: '福建泉州', dialect: '闽南语', status: 'unclaimed', totalEntries: 180, completedEntries: 0, deadline: '2026-09-01' },
  { id: 'v3', villageName: '梅城镇', region: '广东梅州', dialect: '客家话', status: 'completed', totalEntries: 150, completedEntries: 150, assignee: '李调查员', deadline: '2026-07-01' },
  { id: 'v4', villageName: '松口镇', region: '广东梅州', dialect: '客家话', status: 'in_progress', totalEntries: 160, completedEntries: 80, assignee: '王调查员', deadline: '2026-08-15' },
  { id: 'v5', villageName: '同里镇', region: '江苏苏州', dialect: '吴语', status: 'reviewing', totalEntries: 220, completedEntries: 220, assignee: '赵调查员', deadline: '2026-06-30' },
  { id: 'v6', villageName: '周庄镇', region: '江苏苏州', dialect: '吴语', status: 'unclaimed', totalEntries: 190, completedEntries: 0, deadline: '2026-10-01' },
  { id: 'v7', villageName: '台城镇', region: '广东台山', dialect: '粤语', status: 'in_progress', totalEntries: 170, completedEntries: 60, assignee: '陈调查员', deadline: '2026-09-15' },
  { id: 'v8', villageName: '广海镇', region: '广东台山', dialect: '粤语', status: 'unclaimed', totalEntries: 130, completedEntries: 0, deadline: '2026-10-15' },
  { id: 'v9', villageName: '望城县', region: '湖南长沙', dialect: '湘语', status: 'in_progress', totalEntries: 200, completedEntries: 45, assignee: '刘调查员', deadline: '2026-11-01' },
  { id: 'v10', villageName: '浏阳市', region: '湖南长沙', dialect: '湘语', status: 'unclaimed', totalEntries: 165, completedEntries: 0, deadline: '2026-12-01' },
];

export const mockRecordingSessions: RecordingSession[] = [
  { id: 'r1', villageName: '安海镇', speakerName: '陈老伯', speakerAge: 78, speakerGender: 'male', date: '2026-05-20', duration: 3600, status: 'completed', entries: 32, hasConsent: true, noiseLevel: 'low' },
  { id: 'r2', villageName: '安海镇', speakerName: '林阿婆', speakerAge: 82, speakerGender: 'female', date: '2026-05-21', duration: 2400, status: 'completed', entries: 28, hasConsent: true, noiseLevel: 'low' },
  { id: 'r3', villageName: '梅城镇', speakerName: '黄大叔', speakerAge: 65, speakerGender: 'male', date: '2026-05-18', duration: 1800, status: 'paused', entries: 15, hasConsent: true, noiseLevel: 'medium' },
  { id: 'r4', villageName: '台城镇', speakerName: '伍阿姨', speakerAge: 70, speakerGender: 'female', date: '2026-05-22', duration: 900, status: 'recording', entries: 8, hasConsent: true, noiseLevel: 'high' },
  { id: 'r5', villageName: '安海镇', speakerName: '许大爷', speakerAge: 85, speakerGender: 'male', date: '2026-05-23', duration: 0, status: 'draft', entries: 0, hasConsent: false },
  { id: 'r6', villageName: '松口镇', speakerName: '李阿婆', speakerAge: 76, speakerGender: 'female', date: '2026-05-15', duration: 4200, status: 'completed', entries: 45, hasConsent: true, noiseLevel: 'low' },
  { id: 'r7', villageName: '台城镇', speakerName: '陈伯', speakerAge: 72, speakerGender: 'male', date: '2026-05-19', duration: 2800, status: 'reviewing', entries: 35, hasConsent: true, noiseLevel: 'low' },
  { id: 'r8', villageName: '安海镇', speakerName: '王阿姨', speakerAge: 68, speakerGender: 'female', date: '2026-05-17', duration: 1500, status: 'paused', entries: 18, hasConsent: true, noiseLevel: 'medium' },
  { id: 'r9', villageName: '望城县', speakerName: '周老先生', speakerAge: 80, speakerGender: 'male', date: '2026-05-16', duration: 3200, status: 'completed', entries: 38, hasConsent: true, noiseLevel: 'low' },
  { id: 'r10', villageName: '同里镇', speakerName: '钱阿婆', speakerAge: 74, speakerGender: 'female', date: '2026-05-14', duration: 2600, status: 'completed', entries: 30, hasConsent: true, noiseLevel: 'low' },
];

export const mockEntries: DictEntry[] = [
  { id: 'e1', chinese: '鼎', phonetic: 'tiã¹', definition: '锅，烹饪器具', exampleSentence: '鼎内煮汤，香味飘满厝。', synonyms: ['锅', '镬'], usageScenario: '日常烹饪', dialect: '闽南语', region: '福建泉州', speakerName: '陈老伯', audioUrl: '', createdAt: '2026-05-20', status: 'approved', tags: ['器具', '厨房'] },
  { id: 'e2', chinese: '厝', phonetic: 'tshu³', definition: '家，房屋', exampleSentence: '我厝在安海镇东边。', synonyms: ['家', '房屋'], usageScenario: '居住场所', dialect: '闽南语', region: '福建泉州', speakerName: '林阿婆', audioUrl: '', createdAt: '2026-05-21', status: 'approved', tags: ['建筑', '住所'] },
  { id: 'e3', chinese: '箸', phonetic: 'ti⁶', definition: '筷子', exampleSentence: '食饭用箸，莫用手抓。', synonyms: ['筷子'], usageScenario: '用餐', dialect: '闽南语', region: '福建泉州', speakerName: '陈老伯', audioUrl: '', createdAt: '2026-05-20', status: 'submitted', tags: ['餐具', '用餐'] },
  { id: 'e4', chinese: '冇', phonetic: 'pan³', definition: '不结实，松软', exampleSentence: '这个面包冇冇的，不好吃。', synonyms: ['松', '软'], usageScenario: '描述质地', dialect: '客家话', region: '广东梅州', speakerName: '黄大叔', audioUrl: '', createdAt: '2026-05-18', status: 'draft', tags: ['形容词', '质地'] },
  { id: 'e5', chinese: '嬲', phonetic: 'nau¹', definition: '生气，恼怒', exampleSentence: '你莫嬲我，我唔系故意的。', synonyms: ['生气', '恼'], usageScenario: '情绪表达', dialect: '客家话', region: '广东梅州', speakerName: '李阿婆', audioUrl: '', createdAt: '2026-05-15', status: 'approved', tags: ['情绪', '形容词'] },
  { id: 'e6', chinese: '佢', phonetic: 'gi²', definition: '他，她', exampleSentence: '佢今日去赶圩了。', synonyms: ['他', '她'], usageScenario: '人称代词', dialect: '客家话', region: '广东梅州', speakerName: '黄大叔', audioUrl: '', createdAt: '2026-05-18', status: 'submitted', tags: ['代词'] },
  { id: 'e7', chinese: '孭', phonetic: 'me¹', definition: '背，背负', exampleSentence: '阿妈孭着细崽去买菜。', synonyms: ['背'], usageScenario: '动作描述', dialect: '粤语', region: '广东台山', speakerName: '伍阿姨', audioUrl: '', createdAt: '2026-05-22', status: 'draft', tags: ['动词', '动作'] },
  { id: 'e8', chinese: '靓', phonetic: 'lɛŋ³', definition: '漂亮，好看', exampleSentence: '这件衫好靓啊！', synonyms: ['漂亮', '好看'], usageScenario: '赞美', dialect: '粤语', region: '广东台山', speakerName: '伍阿姨', audioUrl: '', createdAt: '2026-05-22', status: 'submitted', tags: ['形容词', '外貌'] },
  { id: 'e9', chinese: '汏', phonetic: 'da⁶', definition: '洗，清洗', exampleSentence: '把衣裳汏汏清爽。', synonyms: ['洗'], usageScenario: '日常家务', dialect: '吴语', region: '江苏苏州', speakerName: '钱阿婆', audioUrl: '', createdAt: '2026-05-14', status: 'approved', tags: ['动词', '家务'] },
  { id: 'e10', chinese: '弗', phonetic: 'fəʔ⁵', definition: '不，否定', exampleSentence: '我弗晓得。', synonyms: ['不', '没'], usageScenario: '否定表达', dialect: '吴语', region: '江苏苏州', speakerName: '钱阿婆', audioUrl: '', createdAt: '2026-05-14', status: 'approved', tags: ['副词', '否定'] },
  { id: 'e11', chinese: '唆', phonetic: 'so¹', definition: '吮吸', exampleSentence: '细伢子唆手指头。', synonyms: ['吸', '嘬'], usageScenario: '动作描述', dialect: '湘语', region: '湖南长沙', speakerName: '周老先生', audioUrl: '', createdAt: '2026-05-16', status: 'submitted', tags: ['动词', '动作'] },
  { id: 'e12', chinese: '坼', phonetic: 'tsha⁵', definition: '裂开，裂缝', exampleSentence: '墙坼了一条缝。', synonyms: ['裂', '缝'], usageScenario: '状态描述', dialect: '湘语', region: '湖南长沙', speakerName: '周老先生', audioUrl: '', createdAt: '2026-05-16', status: 'draft', tags: ['动词', '状态'] },
];

export const mockSpeakers: Speaker[] = [
  { id: 's1', name: '陈老伯', age: 78, gender: 'male', birthplace: '福建泉州安海镇', dialect: '闽南语', latitude: 24.72, longitude: 118.48, recordingCount: 32, avatar: 'https://picsum.photos/id/64/200/200' },
  { id: 's2', name: '林阿婆', age: 82, gender: 'female', birthplace: '福建泉州安海镇', dialect: '闽南语', latitude: 24.73, longitude: 118.49, recordingCount: 28, avatar: 'https://picsum.photos/id/91/200/200' },
  { id: 's3', name: '黄大叔', age: 65, gender: 'male', birthplace: '广东梅州梅城镇', dialect: '客家话', latitude: 24.30, longitude: 116.12, recordingCount: 15, avatar: 'https://picsum.photos/id/177/200/200' },
  { id: 's4', name: '伍阿姨', age: 70, gender: 'female', birthplace: '广东台山台城镇', dialect: '粤语', latitude: 22.25, longitude: 112.79, recordingCount: 8, avatar: 'https://picsum.photos/id/338/200/200' },
  { id: 's5', name: '钱阿婆', age: 74, gender: 'female', birthplace: '江苏苏州同里镇', dialect: '吴语', latitude: 31.16, longitude: 120.72, recordingCount: 30, avatar: 'https://picsum.photos/id/1027/200/200' },
  { id: 's6', name: '周老先生', age: 80, gender: 'male', birthplace: '湖南长沙望城县', dialect: '湘语', latitude: 28.35, longitude: 112.83, recordingCount: 38, avatar: 'https://picsum.photos/id/64/200/200' },
  { id: 's7', name: '许大爷', age: 85, gender: 'male', birthplace: '福建泉州安海镇', dialect: '闽南语', latitude: 24.71, longitude: 118.47, recordingCount: 0, avatar: 'https://picsum.photos/id/177/200/200' },
  { id: 's8', name: '李阿婆', age: 76, gender: 'female', birthplace: '广东梅州松口镇', dialect: '客家话', latitude: 24.28, longitude: 116.18, recordingCount: 45, avatar: 'https://picsum.photos/id/91/200/200' },
  { id: 's9', name: '陈伯', age: 72, gender: 'male', birthplace: '广东台山台城镇', dialect: '粤语', latitude: 22.24, longitude: 112.78, recordingCount: 35, avatar: 'https://picsum.photos/id/338/200/200' },
  { id: 's10', name: '王阿姨', age: 68, gender: 'female', birthplace: '福建泉州安海镇', dialect: '闽南语', latitude: 24.74, longitude: 118.50, recordingCount: 18, avatar: 'https://picsum.photos/id/1027/200/200' },
];

export const mockReviewItems: ReviewItem[] = [
  { id: 'rv1', entryId: 'e3', chinese: '箸', phonetic: 'ti⁶', transcription: '食饭用箸，莫用手抓。', audioUrl: '', status: 'pending', version: 1, createdAt: '2026-05-20' },
  { id: 'rv2', entryId: 'e4', chinese: '冇', phonetic: 'pan³', transcription: '这个面包冇冇的，不好吃。', audioUrl: '', status: 'pending', version: 1, createdAt: '2026-05-18' },
  { id: 'rv3', entryId: 'e6', chinese: '佢', phonetic: 'gi²', transcription: '佢今日去赶圩了。', audioUrl: '', status: 'pending', version: 1, createdAt: '2026-05-18' },
  { id: 'rv4', entryId: 'e7', chinese: '孭', phonetic: 'me¹', transcription: '阿妈孭着细崽去买菜。', audioUrl: '', status: 'pending', version: 1, createdAt: '2026-05-22' },
  { id: 'rv5', entryId: 'e8', chinese: '靓', phonetic: 'lɛŋ³', transcription: '这件衫好靓啊！', audioUrl: '', status: 'approved', version: 2, reviewer: '审核员甲', createdAt: '2026-05-22' },
  { id: 'rv6', entryId: 'e11', chinese: '唆', phonetic: 'so¹', transcription: '细伢子唆手指头。', audioUrl: '', status: 'rejected', version: 1, reviewer: '审核员乙', feedback: '音标标记有误，请核实', createdAt: '2026-05-16' },
];

export const mockLearningTopics: LearningTopic[] = [
  { id: 'lt1', name: '日常问候', description: '各地方言中的日常问候用语', coverImage: 'https://picsum.photos/id/312/750/400', sampleCount: 24, category: '社交' },
  { id: 'lt2', name: '饮食文化', description: '方言中的饮食相关词汇与表达', coverImage: 'https://picsum.photos/id/292/750/400', sampleCount: 36, category: '生活' },
  { id: 'lt3', name: '亲属称谓', description: '不同方言中的亲属称呼体系', coverImage: 'https://picsum.photos/id/401/750/400', sampleCount: 28, category: '社会' },
  { id: 'lt4', name: '自然风物', description: '描述自然景观与天气的方言词汇', coverImage: 'https://picsum.photos/id/1015/750/400', sampleCount: 20, category: '自然' },
  { id: 'lt5', name: '农耕用语', description: '传统农耕生产中的方言词汇', coverImage: 'https://picsum.photos/id/580/750/400', sampleCount: 32, category: '生产' },
  { id: 'lt6', name: '民间故事', description: '用方言讲述的民间传说与故事', coverImage: 'https://picsum.photos/id/835/750/400', sampleCount: 15, category: '文化' },
  { id: 'lt7', name: '婚丧习俗', description: '方言中的婚丧嫁娶用语', coverImage: 'https://picsum.photos/id/625/750/400', sampleCount: 18, category: '习俗' },
  { id: 'lt8', name: '童谣谚语', description: '各地方言童谣与谚语', coverImage: 'https://picsum.photos/id/1080/750/400', sampleCount: 22, category: '文化' },
];

export const mockLearningSamples: LearningSample[] = [
  { id: 'ls1', topicId: 'lt1', chinese: '食未？', phonetic: 'tsiaʔ⁸ bue⁶', audioUrl: '', dialect: '闽南语', region: '福建泉州' },
  { id: 'ls2', topicId: 'lt1', chinese: '食哩么？', phonetic: 'sik⁶ li⁴ mo¹', audioUrl: '', dialect: '客家话', region: '广东梅州' },
  { id: 'ls3', topicId: 'lt1', chinese: '侬好', phonetic: 'non² hɔ³', audioUrl: '', dialect: '吴语', region: '江苏苏州' },
  { id: 'ls4', topicId: 'lt2', chinese: '鼎', phonetic: 'tiã¹', audioUrl: '', dialect: '闽南语', region: '福建泉州' },
  { id: 'ls5', topicId: 'lt2', chinese: '箸', phonetic: 'ti⁶', audioUrl: '', dialect: '闽南语', region: '福建泉州' },
  { id: 'ls6', topicId: 'lt2', chinese: '镬', phonetic: 'vɔʔ⁸', audioUrl: '', dialect: '吴语', region: '江苏苏州' },
  { id: 'ls7', topicId: 'lt3', chinese: '阿公', phonetic: 'a¹ kɔŋ¹', audioUrl: '', dialect: '闽南语', region: '福建泉州' },
  { id: 'ls8', topicId: 'lt3', chinese: '阿婆', phonetic: 'a¹ po²', audioUrl: '', dialect: '客家话', region: '广东梅州' },
  { id: 'ls9', topicId: 'lt4', chinese: '落雨', phonetic: 'lɔʔ⁸ y³', audioUrl: '', dialect: '吴语', region: '江苏苏州' },
  { id: 'ls10', topicId: 'lt4', chinese: '天光', phonetic: 'tʰĩ¹ kʊŋ¹', audioUrl: '', dialect: '闽南语', region: '福建泉州' },
];

export const mockUserStats: UserStats = {
  totalRecordings: 156,
  totalEntries: 892,
  totalDuration: 259200,
  totalReviews: 234,
  offlinePackages: 3,
  pendingUploads: 7,
  contributionRank: 12,
};

export const mockUploadItems: UploadItem[] = [
  { id: 'u1', name: '安海镇-陈老伯-20260520', size: '128MB', status: 'pending', progress: 0, createdAt: '2026-05-20' },
  { id: 'u2', name: '安海镇-林阿婆-20260521', size: '96MB', status: 'uploading', progress: 65, createdAt: '2026-05-21' },
  { id: 'u3', name: '梅城镇-黄大叔-20260518', size: '64MB', status: 'completed', progress: 100, createdAt: '2026-05-18' },
  { id: 'u4', name: '台城镇-伍阿姨-20260522', size: '45MB', status: 'failed', progress: 32, createdAt: '2026-05-22' },
  { id: 'u5', name: '松口镇-李阿婆-20260515', size: '156MB', status: 'pending', progress: 0, createdAt: '2026-05-15' },
  { id: 'u6', name: '同里镇-钱阿婆-20260514', size: '88MB', status: 'completed', progress: 100, createdAt: '2026-05-14' },
  { id: 'u7', name: '望城县-周老先生-20260516', size: '112MB', status: 'pending', progress: 0, createdAt: '2026-05-16' },
];

export const mockOfflinePackages: OfflinePackage[] = [
  { id: 'o1', name: '闽南语泉州片区', size: '256MB', dialect: '闽南语', downloadDate: '2026-05-10', entryCount: 450 },
  { id: 'o2', name: '客家话梅县调查', size: '180MB', dialect: '客家话', downloadDate: '2026-05-08', entryCount: 320 },
  { id: 'o3', name: '吴语苏州话采录', size: '210MB', dialect: '吴语', downloadDate: '2026-04-28', entryCount: 380 },
];
