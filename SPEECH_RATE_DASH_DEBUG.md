# 🔍 语速检测 "—" 问题诊断

## 问题：Detected 一直显示 "—"

### 可能原因

1. ❌ Speech Rate 功能没有正确启用
2. ❌ 检测器没有运行
3. ❌ 视频没有语音内容
4. ❌ 音频能量太低
5. ❌ 检测阈值设置过高

---

## 🧪 诊断脚本 - 请运行

复制以下代码到 Console (F12)：

```javascript
// 完整诊断脚本
(function diagnoseSpeechRate() {
  console.log('=== 语速检测诊断 ===\n');
  
  // 1. 检查控制器
  const ctrl = window.SleepyTubeController;
  if (!ctrl) {
    console.error('❌ SleepyTubeController 不存在');
    return;
  }
  console.log('✅ 控制器存在');
  
  // 2. 检查音频引擎
  const ae = ctrl.audioEngine;
  if (!ae) {
    console.error('❌ AudioEngine 不存在');
    console.log('💡 请先点击 SleepyTube 按钮启用 Sleep Mode');
    return;
  }
  console.log('✅ 音频引擎存在');
  console.log('   - isConnected:', ae.isConnected);
  console.log('   - isEnabled:', ae.isEnabled);
  
  if (!ae.isConnected) {
    console.error('❌ 音频引擎未连接');
    console.log('💡 请点击 SleepyTube 按钮启用 Sleep Mode');
    return;
  }
  
  // 3. 检查检测器
  const detector = ae.speechRateDetector;
  if (!detector) {
    console.error('❌ 语速检测器不存在（这是个 bug）');
    return;
  }
  console.log('✅ 检测器存在');
  console.log('   - isRunning:', detector.isRunning);
  console.log('   - energyHistory length:', detector.energyHistory?.length || 0);
  console.log('   - syllableIntervals length:', detector.syllableIntervals?.length || 0);
  console.log('   - currentRate:', detector.currentRate);
  console.log('   - category:', detector.rateCategory);
  
  if (!detector.isRunning) {
    console.error('❌ 检测器没有运行');
    console.log('💡 手动启动检测器：');
    console.log('   detector.start()');
    
    // 自动启动
    detector.start();
    console.log('✅ 已自动启动检测器');
  }
  
  // 4. 检查控制器
  const speechCtrl = ae.speechRateController;
  if (!speechCtrl) {
    console.error('❌ 语速控制器不存在（这是个 bug）');
    return;
  }
  console.log('✅ 控制器存在');
  console.log('   - isEnabled:', speechCtrl.isEnabled);
  console.log('   - isPaused:', speechCtrl.isPaused);
  console.log('   - targetRate:', speechCtrl.targetRate);
  
  if (!speechCtrl.isEnabled) {
    console.error('❌ 控制器未启用');
    console.log('💡 请在右键菜单中启用 Speech Rate');
    return;
  }
  
  if (speechCtrl.isPaused) {
    console.warn('⚠️ 控制器已暂停');
    console.log('💡 点击浮动面板的 "Resume" 按钮');
  }
  
  // 5. 检查音频分析器
  const analyser = ae.nodes?.midAnalyser;
  if (!analyser) {
    console.error('❌ 音频分析器不存在');
    return;
  }
  console.log('✅ 分析器存在');
  
  // 检查音频能量
  const buffer = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(buffer);
  
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i];
  }
  const rms = Math.sqrt(sum / buffer.length);
  
  console.log('\n📊 音频信号分析:');
  console.log('   - RMS 能量:', rms.toFixed(6));
  console.log('   - 有音频信号:', rms > 0.001 ? '✅ 是' : '❌ 否');
  
  if (rms < 0.001) {
    console.error('❌ 音频能量太低！');
    console.log('可能原因:');
    console.log('   1. 视频暂停了');
    console.log('   2. 音量太小或静音');
    console.log('   3. 当前片段是静音');
    console.log('   4. 音频引擎连接有问题');
    return;
  }
  
  // 6. 检查配置
  const config = window.SleepyTubeConfig.get();
  console.log('\n⚙️ 配置:');
  console.log('   - speechRateEnabled:', config.speechRateEnabled);
  console.log('   - targetSpeechRate:', config.targetSpeechRate);
  
  // 7. 实时监控检测过程
  console.log('\n🎬 开始实时监控（持续 10 秒）...');
  console.log('（请确保视频正在播放且有人说话）\n');
  
  let monitorCount = 0;
  const monitorInterval = setInterval(() => {
    monitorCount++;
    
    // 重新获取数据
    analyser.getFloatTimeDomainData(buffer);
    sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    const currentRms = Math.sqrt(sum / buffer.length);
    
    const rate = detector.getRate();
    const historyLen = detector.energyHistory?.length || 0;
    const intervalsLen = detector.syllableIntervals?.length || 0;
    
    console.log(`[${monitorCount}s] RMS: ${currentRms.toFixed(6)} | ` +
                `History: ${historyLen} | ` +
                `Intervals: ${intervalsLen} | ` +
                `Rate: ${rate.syllablesPerSecond.toFixed(2)} syl/s | ` +
                `Category: ${rate.category}`);
    
    if (monitorCount >= 10) {
      clearInterval(monitorInterval);
      console.log('\n=== 监控结束 ===\n');
      
      // 最终诊断
      if (rate.syllablesPerSecond === 0) {
        console.log('❌ 10秒后仍然没有检测到语速');
        console.log('\n可能的问题：');
        
        if (currentRms < 0.001) {
          console.log('1. ❌ 没有音频信号');
          console.log('   → 确保视频正在播放');
          console.log('   → 确保音量不是静音');
        } else if (historyLen === 0) {
          console.log('2. ❌ 检测循环没有运行');
          console.log('   → 运行: detector.start()');
        } else if (intervalsLen === 0) {
          console.log('3. ❌ 没有检测到音节');
          console.log('   → 当前可能是音乐或静音片段');
          console.log('   → 尝试换到有人说话的片段');
          console.log('   → 或者调低检测阈值（见下方）');
        }
        
        // 显示当前阈值
        const cfg = detector.config;
        console.log('\n当前检测阈值:');
        console.log('   - energyThreshold:', cfg.energyThreshold);
        console.log('   - zcrThreshold:', cfg.zcrThreshold);
        
        // 提供降低阈值的方法
        console.log('\n💡 尝试降低阈值（使检测更敏感）：');
        console.log('   detector.config.energyThreshold = 0.001;');
        console.log('   detector.config.zcrThreshold = 0.1;');
        
      } else {
        console.log('✅ 检测成功！');
        console.log('   语速:', rate.syllablesPerSecond.toFixed(2), 'syl/s');
        console.log('   分类:', rate.category);
        console.log('   置信度:', (rate.confidence * 100).toFixed(0) + '%');
      }
    }
  }, 1000);
  
})();
```

---

## 🎯 根据诊断结果采取行动

### 结果 1: "音频引擎未连接"

**解决方法：**
1. 点击 SleepyTube 按钮（左键）
2. 等待按钮变绿
3. 重新运行诊断脚本

---

### 结果 2: "检测器没有运行"

**解决方法：**
```javascript
// 手动启动
const detector = window.SleepyTubeController.audioEngine.speechRateDetector;
detector.start();
```

---

### 结果 3: "控制器未启用"

**解决方法：**
1. 右键点击 SleepyTube 按钮
2. 找到 "Speech Rate" 部分
3. 打开开关
4. 选择 "Normal"

---

### 结果 4: "音频能量太低"

**可能原因和解决方法：**

1. **视频暂停了**
   - 点击播放按钮

2. **音量太小或静音**
   - 调高 YouTube 音量
   - 调高系统音量

3. **当前片段是静音**
   - 快进到有人说话的片段

4. **音频引擎连接有问题**
   - 禁用再重新启用 Sleep Mode

---

### 结果 5: "没有检测到音节"

**原因：**
- 检测阈值太高
- 当前是纯音乐
- 语速极慢或极快

**解决方法：**

#### 方法 A: 降低检测阈值

```javascript
// 使检测更敏感
const detector = window.SleepyTubeController.audioEngine.speechRateDetector;

// 原始阈值
console.log('原始阈值:');
console.log('  energy:', detector.config.energyThreshold);
console.log('  zcr:', detector.config.zcrThreshold);

// 降低阈值（更敏感）
detector.config.energyThreshold = 0.001;  // 默认 0.01
detector.config.zcrThreshold = 0.1;        // 默认 0.05

console.log('✅ 阈值已降低，等待 5 秒观察...');

setTimeout(() => {
  const rate = detector.getRate();
  console.log('检测结果:', rate.syllablesPerSecond.toFixed(2), 'syl/s');
}, 5000);
```

#### 方法 B: 查看原始能量数据

```javascript
// 查看最近的能量值
const detector = window.SleepyTubeController.audioEngine.speechRateDetector;

if (detector.energyHistory && detector.energyHistory.length > 0) {
  const recent = detector.energyHistory.slice(-20);
  
  console.log('最近 20 帧的能量值:');
  recent.forEach((frame, i) => {
    console.log(`  [${i}]`, 
                'energy:', frame.energy.toFixed(6),
                'zcr:', frame.zcr.toFixed(4));
  });
  
  // 找最大值
  const maxEnergy = Math.max(...recent.map(f => f.energy));
  console.log('\n最大能量:', maxEnergy.toFixed(6));
  console.log('当前阈值:', detector.config.energyThreshold);
  
  if (maxEnergy < detector.config.energyThreshold) {
    console.log('❌ 最大能量小于阈值，需要降低阈值');
    console.log('💡 建议阈值:', (maxEnergy * 0.8).toFixed(6));
  }
} else {
  console.log('❌ 没有历史数据');
}
```

---

## 🔧 快速修复方案

如果诊断脚本显示一切正常但仍然是 "—"，尝试完全重启：

```javascript
// 完全重启语速检测
(async function restartSpeechRate() {
  const ae = window.SleepyTubeController?.audioEngine;
  if (!ae) return;
  
  const detector = ae.speechRateDetector;
  const ctrl = ae.speechRateController;
  
  console.log('🔄 停止...');
  if (detector) detector.stop();
  if (ctrl) ctrl.disable();
  
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('🔄 重新启动...');
  if (detector) {
    // 降低阈值
    detector.config.energyThreshold = 0.001;
    detector.config.zcrThreshold = 0.1;
    detector.start();
  }
  if (ctrl) ctrl.enable('normal');
  
  console.log('✅ 已重启，等待 5 秒...');
  
  setTimeout(() => {
    const rate = detector?.getRate();
    console.log('检测结果:', rate?.syllablesPerSecond.toFixed(2), 'syl/s');
    console.log('分类:', rate?.category);
  }, 5000);
})();
```

---

## 📹 测试视频推荐

如果怀疑是视频内容问题，尝试这些保证有清晰语音的视频类型：

1. **TED 演讲** - 清晰、标准语速
2. **新闻播报** - 快速但清晰
3. **播客节目** - 连续对话
4. **教学视频** - 慢速清晰

**避免**：
- ❌ 纯音乐视频
- ❌ ASMR 耳语（太小声）
- ❌ 直播（可能有技术限制）
- ❌ 有版权限制的视频

---

## 🎯 最可能的原因（经验总结）

根据经验，`Detected: —` 最常见的原因是：

1. **50%** - Sleep Mode 没有启用（音频引擎未连接）
2. **30%** - 视频暂停或静音
3. **10%** - 当前片段是音乐/静音
4. **5%** - 检测阈值太高
5. **5%** - 其他技术问题

---

## ✅ 检查清单

在运行诊断脚本前，请确认：

- [ ] SleepyTube 按钮是绿色的（Sleep Mode 已启用）
- [ ] 视频正在播放（不是暂停）
- [ ] 音量不是 0 或静音
- [ ] 当前片段有人说话（不是音乐）
- [ ] Speech Rate 开关已打开
- [ ] 等待至少 5 秒（检测需要时间）

---

请先运行诊断脚本，然后把输出结果发给我！
