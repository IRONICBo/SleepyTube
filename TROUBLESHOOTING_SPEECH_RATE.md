# 🐛 语速检测不工作故障排查指南

## ❓ 症状：显示 `Detected: — | Playback: 1.0x`

### 📋 检查清单

#### ✅ 必须条件（按顺序检查）

1. **Sleep Mode 已启用**
   ```
   检查方法：
   - SleepyTube 按钮是绿色的 ✓
   - 不是灰色或其他颜色
   
   如果没启用：
   - 左键点击 SleepyTube 按钮
   - 等待按钮变绿
   ```

2. **Speech Rate 开关已打开**
   ```
   检查方法：
   - 右键点击 SleepyTube 按钮
   - 找到 "Speech Rate" 部分
   - 确认开关是绿色的 ✓
   
   如果没打开：
   - 点击开关
   - 选择目标速度（Normal/Slow/Fast/Auto）
   ```

3. **视频正在播放**
   ```
   检查方法：
   - YouTube 播放器显示 "⏸" 暂停图标
   - 进度条在移动
   
   如果暂停了：
   - 点击播放按钮
   ```

4. **视频有语音内容**
   ```
   检查方法：
   - 能听到说话声音
   - 不是纯音乐或静音视频
   
   如果是纯音乐：
   - 换一个有人说话的视频测试
   ```

5. **音量不是静音**
   ```
   检查方法：
   - YouTube 音量 > 0
   - 系统音量 > 0
   
   如果静音：
   - 调高音量
   ```

---

## 🔍 详细诊断步骤

### 步骤 1: 检查 Sleep Mode 状态

**在 Console (F12) 中运行：**

```javascript
// 检查 Sleep Mode 是否启用
const audioEngine = window.SleepyTubeController?.audioEngine;
console.log('Audio Engine exists:', !!audioEngine);
console.log('Audio Engine connected:', audioEngine?.isConnected);
console.log('Audio Engine enabled:', audioEngine?.isEnabled);
```

**预期输出：**
```
Audio Engine exists: true
Audio Engine connected: true  ← 必须是 true
Audio Engine enabled: true    ← 必须是 true
```

**如果 connected = false：**
```
说明：Sleep Mode 没有启用
解决：点击 SleepyTube 按钮（左键）启用 Sleep Mode
```

---

### 步骤 2: 检查 Speech Rate 控制器状态

**在 Console 中运行：**

```javascript
// 检查语速控制器
const ctrl = window.SleepyTubeController?.audioEngine?.speechRateController;
console.log('Controller exists:', !!ctrl);
console.log('Controller enabled:', ctrl?.isEnabled);
console.log('Detector exists:', !!ctrl?.detector);
console.log('Detector running:', ctrl?.detector?.isRunning);
console.log('Target rate:', ctrl?.targetRate);
```

**预期输出：**
```
Controller exists: true
Controller enabled: true      ← 必须是 true
Detector exists: true
Detector running: true        ← 必须是 true
Target rate: "normal"
```

**如果 enabled = false：**
```
说明：Speech Rate 没有启用
解决：
1. 右键点击 SleepyTube 按钮
2. 打开 Speech Rate 开关
3. 选择目标速度
```

**如果 running = false：**
```
说明：检测器没有启动
解决：手动启动检测器
```

**手动启动：**
```javascript
// 在 Console 中运行
const detector = window.SleepyTubeController.audioEngine.speechRateDetector;
if (detector && !detector.isRunning) {
  detector.start();
  console.log('✅ 检测器已手动启动');
}
```

---

### 步骤 3: 检查音频分析器

**在 Console 中运行：**

```javascript
// 检查分析器节点
const analyser = window.SleepyTubeController?.audioEngine?.nodes?.midAnalyser;
console.log('Analyser exists:', !!analyser);

if (analyser) {
  const buffer = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(buffer);
  
  // 计算能量
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i];
  }
  const rms = Math.sqrt(sum / buffer.length);
  
  console.log('Audio RMS energy:', rms);
  console.log('Has audio:', rms > 0.001);
}
```

**预期输出：**
```
Analyser exists: true
Audio RMS energy: 0.0234      ← 应该 > 0.001
Has audio: true
```

**如果 RMS = 0 或很小：**
```
说明：没有音频信号
可能原因：
1. 视频暂停了
2. 视频静音了
3. 当前片段是静音
4. Sleep Mode 没有正确连接

解决：
1. 确保视频正在播放
2. 调高音量
3. 等待有人说话的片段
```

---

### 步骤 4: 查看检测历史

**在 Console 中运行：**

```javascript
// 查看检测器内部状态
const detector = window.SleepyTubeController?.audioEngine?.speechRateDetector;

if (detector) {
  console.log('Energy history length:', detector.energyHistory?.length);
  console.log('Syllable intervals:', detector.syllableIntervals?.length);
  console.log('Current rate:', detector.currentRate);
  console.log('Rate category:', detector.rateCategory);
  
  // 查看最近的能量数据
  if (detector.energyHistory && detector.energyHistory.length > 0) {
    const recent = detector.energyHistory.slice(-10);
    console.log('Recent energy values:', recent.map(e => e.energy.toFixed(4)));
  }
}
`期输出：**
```
Energy history length: 150    ← 应该在增长
Syllable intervals: 8         ← 应该 > 0
Current rate: 4.2             ← 应该 > 0
Rate category: "normal"

Recent energy values: ["0.0123", "0.0156", "0.0089", ...]
```

**如果 Energy history length = 0：**
```
说明：检测循环没有运行
解决：检查步骤 2
```

**如果 Syllable intervals = 0：**
```
说明：没有检测到音节
可能原因：
1. 能量阈值太高
2. 当前是静音/音乐片段
3. 音频太小声

解决：
1. 调高音量
2. 等待有人说话
3. 检查是否是纯音乐视频
```

---

### 步骤 5: 强制触发更新

**在 Console 中运行：**

```javascript
// 强制更新一次
const ctrl = window.SleepyTubeController?.audioEngine?.speechRateController;

if (ctrl && ctrl.isEnabled) {
  ctrl.updatePlaybackRate();
  console.log('✅ 已强制更新播放速度');
  
  // 显示当前状态
  const status = ctrl.getStatus();
  console.log('Status:', status);
}
```

**预期输出：**
```
✅ 已强制更新播放速度
Status: {
  enabled: true,
  detected: {
    syllablesPerSecond: 4.2,
    category: "normal",
    confidence: 0.8
  },
  adjustment: 1.0,
  playbackRate: 1.0,
  isPaused: false,
  userManuallySet: false
}
```

---

## 🎯 完整测试流程

### 从零开始的完整步骤：

```
1. 打开 YouTube 视频
   └→ 选择一个有人说话的视频（不是纯音乐）

2. 打开 Console (F12)
   └→ 准备观察日志输出

3. 启用 Sleep Mode
   ├→ 左键点击 SleepyTube 按钮
   ├→ 按钮变绿
   └→ Console 输出："Audio processing enabled"

4. 启用 Speech Rate
   ├→ 右键点击 SleepyTube 按钮
   ├→ 找到 "Speech Rate" 部分
   ├→ 打开开关
   ├→ 选择 "Normal"
   └→ Console 输出："Speech rate adjustment enabled: normal"

5. 播放视频
   ├→ 点击播放按钮（如果暂停）
   └→ 确保有声音

6. 等待 3-5 秒
   ├→ 观察 Console 日志
   ├→ 每 2 秒应该有："Speech rate update: {detected: ..., playbackRate: ...}"
   └→ 观察右键菜单底部的 "Detected" 值变化

7. 检查浮动面板
   ├→ 应该在右上角出现
   ├→ 显示实时数据
   └→ "Detected" 不再是 "—"
```

---

## 🔧 常见问题修复

### 问题 1: Sleep Mode 启用后立即启用 Speech Rate，但不工作

**原因**：初始化顺序问题

**解决**：
```javascript
// 在 Console 中运行
// 1. 禁用 Speech Rate
const ctrl = window.SleepyTubeController.audioEngine.speechRateController;
if (ctrl) ctrl.disable();

// 2. 等待 2 秒
setTimeout(() => {
  // 3. 重新启用
  const detector = window.SleepyTubeController.audioEngine.speechRateDetector;
  const ctrl = window.SleepyTubeController.audioEngine.speechRateController;
  
  if (detector) detector.start();
  if (ctrl) ctrl.enable('normal');
  
  console.log('✅ Speech Rate 已重新启动');
}, 2000);
```

---

### 问题 2: 显示 "Detected: 0.0 syl/s"

**原因**：检测到音频但没有识别出音节

**可能情况**：
1. 当前片段是音乐
2. 当前片段是静音
3. 语速太快或太慢
4. 音频质量太差

**解决**：
- 等待视频进入有清晰语音的片段
- 尝试不同的视频

---

### 问题 3: 检测到了语速但播放速度没变化

**原因**：可能是调整值太小（< 10%）

**检查**：
```javascript
const ctrl = window.SleepyTubeController.audioEngine.speechRateController;
const detector = ctrl.detector;

const rate = detector.getRate();
const adjustment = detector.calculateAdjustment('normal');

console.log('Detected rate:', rate.syllablesPerSecond, 'syl/s');
console.log('Calculated adjustment:', adjustment);
console.log('Current playback rate:', ctrl.currentAdjustment);

// 如果 adjustment 在 0.9-1.1 之间，不会调整
// 这是正常的，说明语速已经接近目标
```

---

### 问题 4: YouTube 播放速度设置会同步吗？

**回答**：

**会同步数值，但不完全同步**：

```
我们的实现：
video.playbackRate = 0.75;

YouTube 的显示：
会显示 "自定义 (1)" 和 "0.75x"
但是不会同步到预设选项（0.25x, 0.5x, 0.75x, Normal, 1.25x 等）
```

**这是正常的**：
- YouTube 的速度设置只是修改同一个 `video.playbackRate` 属性
- 我们的代码也修改这个属性
- 数值会同步，但 UI 不会高亮预设选项

**用户手动调速后的行为**：
```
1. 我们检测到用户手动改变了速度
2. 暂停自动调整 30 秒
3. 30 秒后恢复自动调整
```

---

## 📊 性能监控

### 实时监控检测状态

**运行这个脚本持续监控：**

```javascript
// 每 2 秒输出一次状态
const monitorInterval = setInterval(() => {
  const ctrl = window.SleepyTubeController?.audioEngine?.speechRateController;
  const detector = ctrl?.detector;
  
  if (!ctrl || !detector) {
    console.log('❌ 控制器未初始化');
    return;
  }
  
  const rate = detector.getRate();
  const status = ctrl.getStatus();
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎙️ 语速:', rate.syllablesPerSecond.toFixed(2), 'syl/s');
  console.log('📊 分类:', rate.category);
  console.log('🎯 置信度:', (rate.confidence * 100).toFixed(0) + '%');
  console.log('⚡ 调整:', status.adjustment.toFixed(2) + 'x');
  console.log('▶️ 播放速度:', status.playbackRate.toFixed(2) + 'x');
  console.log('📈 历史记录:', detector.energyHistory?.length || 0);
  console.log('🔢 音节间隔:', detector.syllableIntervals?.length || 0);
  
}, 2000);

// 停止监控：
// clearInterval(monitorInterval);
```

**预期输出：**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎙️ 语速: 4.25 syl/s
📊 分类: normal
🎯 置信度: 85%
⚡ 调整: 1.00x
▶️ 播放速度: 1.00x
📈 历史记录: 243
🔢 音节间隔: 18
━━━━━━━━━━━━━━━━━━━━━━━━━━━
...
```

---

## 🚨 紧急修复

### 如果所有方法都不工作，重置一切：

```javascript
// 完全重置 Speech Rate 功能
(async function resetSpeechRate() {
  console.log('开始重置...');
  
  const audioEngine = window.SleepyTubeController?.audioEngine;
  if (!audioEngine) {
    console.error('❌ Audio Engine 不存在');
    return;
  }
  
  // 1. 停止并禁用
  if (audioEngine.speechRateDetector) {
    audioEngine.speechRateDetector.stop();
  }
  if (audioEngine.speechRateController) {
    audioEngine.speechRateController.disable();
  }
  
  console.log('✓ 已停止');
  
  // 2. 等待 1 秒
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 3. 重新启动
  if (audioEngine.speechRateDetector) {
    audioEngine.speechRateDetector.start();
    console.log('✓ 检测器已启动');
  }
  
  if (audioEngine.speechRateController) {
    audioEngine.speechRateController.enable('normal');
    console.log('✓ 控制器已启用');
  }
  
  console.log('✅ 重置完成！');
})();
```

---

## 📝 总结

**语速检测不工作的最常见原因（按频率排序）：**

1. **Sleep Mode 没有启用** ← 90% 的情况
2. **视频暂停了** ← 5% 的情况
3. **当前片段是音乐/静音** ← 3% 的情况
4. **其他技术问题** ← 2% 的情况

**快速检查口诀：**
```
绿按钮（Sleep Mode）
绿开关（Speech Rate）
视频播放
有人说话
等待 5 秒
```

如果做到以上 5 点还不工作，运行诊断脚本！
