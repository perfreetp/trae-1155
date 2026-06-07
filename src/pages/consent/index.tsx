import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';

const ConsentPage: React.FC = () => {
  const [agreed, setAgreed] = useState(false);
  const [signed, setSigned] = useState(false);

  const handleConfirm = () => {
    if (!agreed || !signed) {
      Taro.showToast({ title: '请先同意并签名', icon: 'none' });
      return;
    }
    Taro.showToast({ title: '知情同意已签署', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
    console.info('[Consent] Consent signed');
  };

  return (
    <View className={styles.consentPage}>
      <Text className={styles.title}>知情同意书</Text>

      <View className={styles.consentCard}>
        <Text className={styles.consentText}>
          尊敬的发音人：{'\n\n'}
          感谢您参与本次濒危方言采录项目。在开始采录之前，请您仔细阅读以下内容：{'\n\n'}
          一、采录目的：本次采录旨在记录和保存本地方言的语言资料，用于学术研究和文化保护。{'\n\n'}
          二、采录内容：包括但不限于词汇发音、句子朗读、日常对话、民间故事等。{'\n\n'}
          三、资料用途：采录的音频、视频和文字资料将用于学术研究、方言数据库建设和文化传承教育。{'\n\n'}
          四、隐私保护：您的个人信息将严格保密，公开发表时会使用匿名化处理，不会泄露您的个人身份。{'\n\n'}
          五、自愿原则：您有权随时退出采录，无需说明理由，且不会对您造成任何不利影响。{'\n\n'}
          六、资料归属：采录资料由项目组和发音人共同所有，未经双方同意不得用于约定以外的用途。{'\n\n'}
          如您同意以上内容，请在下方勾选并签名确认。
        </Text>
      </View>

      <View className={styles.checkRow} onClick={() => setAgreed(!agreed)}>
        <View className={classnames(styles.checkbox, agreed ? styles.checkboxChecked : '')}>
          {agreed && <Text className={styles.checkmark}>✓</Text>}
        </View>
        <Text className={styles.checkLabel}>
          我已仔细阅读并理解以上内容，自愿参与本次方言采录项目。
        </Text>
      </View>

      <View className={styles.signSection}>
        <Text className={styles.signLabel}>请签名确认</Text>
        <View className={styles.signArea} onClick={() => setSigned(true)}>
          {signed ? (
            <Text style={{ fontSize: '32rpx', color: '#2D2319', fontWeight: 500 }}>张三（签名）</Text>
          ) : (
            <Text className={styles.signHint}>点击此处进行签名</Text>
          )}
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.cancelBtn} onClick={() => Taro.navigateBack()}>
          <Text style={{ fontSize: '32rpx', color: '#6B5D4F' }}>取消</Text>
        </View>
        <View
          className={classnames(
            styles.confirmBtn,
            !agreed || !signed ? styles.confirmBtnDisabled : ''
          )}
          onClick={handleConfirm}
        >
          <Text style={{ color: '#fff', fontSize: '32rpx', fontWeight: 600 }}>确认签署</Text>
        </View>
      </View>
    </View>
  );
};

export default ConsentPage;
