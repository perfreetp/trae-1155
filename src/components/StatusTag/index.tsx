import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface StatusTagProps {
  status: string;
  size?: 'small' | 'medium';
}

const statusMap: Record<string, { label: string; type: string }> = {
  active: { label: '进行中', type: 'active' },
  paused: { label: '已暂停', type: 'warning' },
  completed: { label: '已完成', type: 'success' },
  unclaimed: { label: '待认领', type: 'default' },
  in_progress: { label: '进行中', type: 'active' },
  reviewing: { label: '审核中', type: 'info' },
  draft: { label: '草稿', type: 'default' },
  recording: { label: '采录中', type: 'recording' },
  submitted: { label: '已提交', type: 'info' },
  approved: { label: '已通过', type: 'success' },
  rejected: { label: '已退回', type: 'error' },
  pending: { label: '待审核', type: 'warning' },
  uploading: { label: '上传中', type: 'active' },
  failed: { label: '失败', type: 'error' },
};

const StatusTag: React.FC<StatusTagProps> = ({ status, size = 'small' }) => {
  const config = statusMap[status] || { label: status, type: 'default' };

  return (
    <View
      className={classnames(
        styles.tag,
        styles[config.type],
        size === 'medium' ? styles.tagMedium : styles.tagSmall
      )}
    >
      <Text
        className={classnames(
          styles.text,
          styles[`${config.type}Text`],
          size === 'medium' ? styles.textMedium : styles.textSmall
        )}
      >
        {config.label}
      </Text>
    </View>
  );
};

export default StatusTag;
