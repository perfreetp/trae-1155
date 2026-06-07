import React from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import ProgressBar from '@/components/ProgressBar';
import StatCard from '@/components/StatCard';
import StatusTag from '@/components/StatusTag';
import { mockProjects, mockVillageTasks } from '@/data/mockData';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const { recordings, entries, reviews } = useAppStore();
  const myTasks = mockVillageTasks.filter(t => t.status === 'in_progress');
  const unclaimedTasks = mockVillageTasks.filter(t => t.status === 'unclaimed');

  const totalHours = Math.floor(recordings.reduce((sum, r) => sum + (r.duration || 0), 0) / 3600);
  const pendingReviewCount = reviews.filter(r => r.status === 'pending').length;

  const handleNavigate = (url: string) => {
    Taro.navigateTo({ url });
  };

  const handleClaimTask = (taskId: string) => {
    Taro.showToast({ title: '认领成功', icon: 'success' });
    console.info('[Home] Task claimed:', taskId);
  };

  return (
    <View className={styles.homePage}>
      <View className={styles.header}>
        <Text className={styles.greeting}>方言采录工作台</Text>
        <Text className={styles.subtitle}>保护濒危语言，记录文化记忆</Text>
      </View>

      <View className={styles.statsRow}>
        <StatCard value={recordings.length} label="采录次数" highlight />
        <StatCard value={totalHours} label="已采录时长(h)" />
        <StatCard value={entries.length} label="词条总数" />
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>项目概览</Text>
        <Text className={styles.sectionMore}>查看全部</Text>
      </View>

      <ScrollView scrollX className={styles.projectScroll}>
        <View className={styles.projectList}>
          {mockProjects.filter(p => p.status === 'active').map(project => (
            <View
              key={project.id}
              className={styles.projectCard}
              onClick={() => handleNavigate('/pages/recordDetail/index')}
            >
              <Image
                src={project.coverImage}
                mode="aspectFill"
                className={styles.projectCover}
              />
              <View className={styles.projectInfo}>
                <Text className={styles.projectName}>{project.name}</Text>
                <View className={styles.projectMeta}>
                  <Text className={styles.projectDialect}>{project.dialect}</Text>
                  <Text className={styles.projectRegion}>{project.region}</Text>
                </View>
                <View className={styles.projectProgress}>
                  <Text className={styles.progressLabel}>采集进度</Text>
                  <Text className={styles.progressValue}>
                    {project.completedTasks}/{project.totalTasks}
                  </Text>
                </View>
                <ProgressBar
                  percent={Math.round((project.completedTasks / project.totalTasks) * 100)}
                  showLabel={false}
                  size="small"
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>快捷入口</Text>
      </View>

      <View className={styles.actionGrid}>
        <View className={styles.actionCard} onClick={() => handleNavigate('/pages/map/index')}>
          <View className={`${styles.actionIcon} ${styles.actionIconMap}`}>
            <Text>🗺</Text>
          </View>
          <Text className={styles.actionLabel}>方言地图</Text>
          <Text className={styles.actionDesc}>查看分布</Text>
        </View>
        <View className={styles.actionCard} onClick={() => handleNavigate('/pages/review/index')}>
          <View className={`${styles.actionIcon} ${styles.actionIconReview}`}>
            <Text>📋</Text>
          </View>
          <Text className={styles.actionLabel}>审核中心</Text>
          <Text className={styles.actionDesc}>待审{pendingReviewCount}条</Text>
        </View>
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>我的任务</Text>
        <Text className={styles.sectionMore}>全部</Text>
      </View>

      <View className={styles.taskSection}>
        {myTasks.map(task => (
          <View
            key={task.id}
            className={styles.taskCard}
            onClick={() => handleNavigate('/pages/recordDetail/index')}
          >
            <View className={styles.taskHeader}>
              <Text className={styles.taskName}>{task.villageName}</Text>
              <StatusTag status={task.status} />
            </View>
            <View className={styles.taskMeta}>
              <Text className={styles.taskDialect}>{task.dialect}</Text>
              <Text className={styles.taskDeadline}>截止 {task.deadline}</Text>
            </View>
            <View className={styles.taskProgress}>
              <Text className={styles.taskProgressLabel}>
                已完成 {task.completedEntries} 项
              </Text>
              <Text className={styles.taskProgressValue}>
                {task.completedEntries}/{task.totalEntries}
              </Text>
            </View>
            <ProgressBar
              percent={Math.round((task.completedEntries / task.totalEntries) * 100)}
              size="small"
            />
          </View>
        ))}
      </View>

      {unclaimedTasks.length > 0 && (
        <>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>待认领村点</Text>
            <Text className={styles.sectionMore}>更多</Text>
          </View>
          <View className={styles.taskSection}>
            {unclaimedTasks.slice(0, 3).map(task => (
              <View key={task.id} className={styles.taskCard}>
                <View className={styles.taskHeader}>
                  <Text className={styles.taskName}>{task.villageName}</Text>
                  <StatusTag status={task.status} />
                </View>
                <View className={styles.taskMeta}>
                  <Text className={styles.taskDialect}>{task.dialect}</Text>
                  <Text className={styles.taskDeadline}>截止 {task.deadline}</Text>
                </View>
                <Text
                  className={styles.taskProgressLabel}
                  style={{ color: '#C07842', fontWeight: 500 }}
                  onClick={() => handleClaimTask(task.id)}
                >
                  + 认领此任务
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

export default HomePage;
