# 🔍 语速检测诊断脚本集合

## 🚨 脚本 1: 安全检查（先运行这个）

```javascript
// 安全检查所有组件是否存在
(function safeCheck() {
  console.log('=== SleepyTube 组件检查 ===\n');
  
  // 检查控制器
  console.log('1. SleepyTubeController:', typeof window.SleepyTubeController);
  if (!window.SleepyTubeController) {
    console.error('❌ 主控制器未初始化！');
    console.log('💡 解决方法：刷新页面 (F5)');
    return;
  }
  
  const ctrl = window.SleepyTubeController;
  console.log('   - isInitialized:', ctrl.isInitialized);
  console.log('   - currentVideo:', !!ctrl.currentVideo);
  console.log('   - audioEngine:', !!ctrl.audioEngine);
  console.log('   - uiManager:', !!ctrl.uiManager);
  
  // 检查音频引擎
  console.log('\n2. AudioEngine:');
  if (!ctrl.audioEngine) {
    console.error('❌ 音频引擎未创建！');
    console.log('💡 解决方法：点击 SleepyTube 按钮启用 Sleep Mode');
    return;
  }
  
  const ae = ctrl.audioEngine;
  console.log('   - isConnected:', ae.isConnected);
  console.log('   - isEnabled:', ae.isEnabled);
  console.log('   - speechRateDetector:', !!ae.speechRateDetector);
  console.log('   - speechRateController:', !!ae.speechRateController);
  
  // 检查语速组件
  console.log('\n3. Speech Rate 组件:');
  if (!ae.speechRateDetector) {
    console.error('❌ 语速检测器未创建！');
    console.log('💡 这是个 bug，需要刷新页面');
    return;
  }
  
  const detector = ae.speechRateDetector;
  const speechCtrl = ae.speechRateController;
  
  console.log('   Detector:');
  console.log('   - isRunning:', detector.isRunning);
  console.log('   - energyHistory:', detector.energyHistory?.length || 0, 'frames');
  console.log('   - syllableIntervals:', detector.syllableIntervals?.length || 0);
  console.log('   - currentRate:', detector.currentRate?.toFixed(2) || 0, 'syl/s');
  console.log('   - category:', detector.rateCategory);
  
  console.log('\n   Controller:');
  console.log('   - isEnabled:', speechCtrl.isEnabled);
  console.log('   - isPaused:', speechCtrl.isPaused);
  console.log('   - targetRate:', speechCtrl.targetRate);
  console.log('   - currentAdjustment:', speechCtrl.currentAdjustment?.toFixed(2));
  console.log('   - playbackRate:', speechCtrl.video?.playbackRate?.toFixed(2));
  
  // 检查配置
  console.log('\n4. 配置:');
  const config = window.SleepyTubeConfig?.get();
  console.log('   - sleepModeEnabled:', config?.sleepModeEnabled);
  console.log('   - speechRateEnabled:', config?.speechRateEnabled);
  console.log('   - targetSpeechRate:', config?.targetSpeechRate);
  
  // 总结
  console.log('\n=== 诊断结果 ===');
  
  const issues = [];
  
  if (!ctrl.isInitialized) issues.push('控制器未初始化');
  if (!ae.isConnected) issues.push('音频引擎未连接（Sleep Mode 未启用）');
  if (!detector.isRunning) issues.push('语速检测器未运行');
  if (!speechCtrl.isEnabled) issues.push('语速控制器未启用');
  if (detector.currentRate === 0) issues.push('还没有检测到语速（等待中或无语音）');
  
  if (issues.length === 0) {
    console.log('✅ 所有组件正常！');
    console.log('📊 当前状态:');
    console.log('   语速:', detector.currentRate.toFixed(2), 'syl/s -', detector.rateCategory);
    console.log('   播放速度:', speechCtrl.video.playbackRate.toFixed(2) + 'x');
  } else {
    console.log('❌ 发现问题:');
    issues.forEach((issue, i) => {
      console.log(`   ${i + 1}. ${issue}`);
    });
    console.log('\n💡 请按照提示修复问题');
  }
})();
```

---

## 🔧 脚本 2: 强制启用（在脚本1确认组件存在后运行）

```javascript
// 强制启用所有功能
(async function forceEnable() {
  console.log('开始强制启用...\n');
  
  // 安全检查
  if (!window.SleepyTubeController) {
    console.error('❌ 扩展未加载，请刷新页面');
    return;
  }
  
  const ctrl = window.SleepyTubeController;
  
  // Step 1: 确保有音频引擎
  if (!ctrl.audioEngine) {
    console.error('❌ 音频引擎不存在');
    console.log('💡 请点击 SleepyTube 按钮（绿色均衡器图标）');
    return;
  }
  
  const ae = ctrl.audioEngine;
  
  // Step 2: 连接音频引擎（启用 Sleep Mode）
  if (!ae.isConnected) {
    console.log('⏳ 正在连接音频引擎...');
    try {
      await ae.connect();
      console.log('✅ Sleep Mode 已启用');
    } catch (e) {
      console.error('❌ 连接失败:', e.message);
      return;
    }
  } else {
    console.log('✅ Sleep Mode 已经启用');
  }
  
  // Step 3: 启动语速检测器
  const detector = ae.speechRateDetector;
  if (!detector) {
    console.error('❌ 检测器不存在（这是个 bug）');
    return;
  }
  
  if (!detector.isRunning) {
    console.log('⏳ 正在启动语速检测器...');
    detector.start();
    console.log('✅ 语速检测器已启动');
  } else {
    console.log('✅ 语速检测器已经运行中');
  }
  
  // Step 4: 启用语速控制器
  const speechCtrl = ae.speechRateController;
  if (!speechCtrl) {
    console.error('❌ 控制器不存在（这是个 bug）');
    return;
  }
  
  if (!speechCtrl.isEnabled) {
    console.log('⏳ 正在启用语速控制器...');
    speechCtrl.enable('normal');
    console.log('✅ 语速控制器已启用（目标: Normal）');
  } else {
    console.log('✅ 语速控制器已经启用');
  }
  
  // Step 5: 等待检测结果
  console.log('\n⏳ 等待 5 秒检测语速...');
  console.log('（请确保视频正在播放且有人说话）\n');
  
  setTimeout(() => {
    const rate = detector.getRate();
    const status = speechCtrl.getStatus();
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 检测结果:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('语速:', rate.syllablesPerSecond.toFixed(2), 'syl/s');
    console.log('分类:', rate.category);
    console.log('置信度:', (rate.confidence * 100).toFixed(0) + '%');
    console.log('调整倍率:', status.adjustment.toFixed(2) + 'x');
    console.log('播放速度:', status.playbackRate.toFixed(2) + 'x');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (rate.syllablesPerSecond === 0) {
      console.log('\n⚠️ 还没有检测到语速');
      console.log('可能原因:');
      console.log('1. 视频暂停了');
      console.log('2. 当前片段是音乐/静音');
      console.log('3. 音量太小');
      console.log('4. 视频没有语音内容');
    } else {
      console.log('\n✅ 语速检测成功！');
    }
  }, 5000);
})();
```

---

## 📊 脚本 3: 实时监控（持续显示状态）

```javascript
// 每 2 秒显示一次状态
let monitorInterval = null;

function startMonitor() {
  // 清除旧的监控
  if (monitorInterval) {
    clearInterval(monitorInterval);
  }
  
  console.log('🎬 开始实时监控...');
  console.log('（运行 stopMonitor() 停止）\n');
  
  monitorInterval = setInterval(() => {
    // 安全检查
    const ctrl = window.SleepyTubeController;
    if (!ctrl?.audioEngine?.speechRateDetector) {
      console.log('⏸ 组件不可用，等待初始化...');
      return;
    }
    
    const detector = ctrl.audioEngine.speechRateDetector;
    const speechCtrl = ctrl.audioEngine.speechRateController;
    const rate = detector.getRate();
    
    // 清屏（可选）
    // console.clear();
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`⏰ ${new Date().toLocaleTimeString()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('状态:', speechCtrl.isEnabled ? '✅ 运行中' : '⏸ 已停止');
    console.log('检测器:', detector.isRunning ? '✅ 运行中' : '⏸ 已停止');
    console.log('');
    console.log('🎙️ 语速:', rate.syllablesPerSecond.toFixed(2), 'syl/s');
    console.log('📊 分类:', rate.category);
    console.log('🎯 置信度:', (rate.confidence * 100).toFixed(0) + '%');
    console.log('⚡ 调整:', speechCtrl.currentAdjustment.toFixed(2) + 'x');
    console.log('▶️ 播放:', speechCtrl.video.playbackRate.toFixed(2) + 'x');
    console.log('');
    console.log('📈 历史:', detector.energyHistory?.length || 0, 'frames');
    console.log('🔢 音节:', detector.syllableIntervals?.length || 0, 'intervals');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  }, 2000);
}

function stopMonitor() {
  if (monitorInterval) {
    clearInterval(monitorInterval);
    monitorInterval = null;
    console.log('⏹ 监控已停止');
  }
}

// 自动开始监控
startMonitor();
```

---

## 🎯 脚本 4: 手动测试调整

```javascript
// 手动测试速度调整（不需要真实检测）
function testSpeedAdjustment(targetSpeed) {
  const ctrl = window.SleepyTubeController?.audioEngine?.speechRateController;
  
  if (!ctrl) {
    console.error('❌ 控制器不可用');
    return;
  }
  
  console.log(`⏳ 正在调整播放速度到 ${targetSpeed}x...`);
  
  ctrl.isUpdating = true;
  ctrl.video.playbackRate = targetSpeed;
  ctrl.currentAdjustment = targetSpeed;
  ctrl.isUpdating = false;
  
  console.log(`✅ 播放速度已调整为 ${targetSpeed}x`);
  console.log('💡 现在可以在 YouTube 播放器右下角看到速度变化');
  
  // 更新 UI
  if (ctrl.indicator) {
    ctrl.updateIndicatorUI('active');
  }
}

// 使用示例:
// testSpeedAdjustment(0.75);  // 减速到 0.75x
// testSpeedAdjustment(1.25);  // 加速到 1.25x
// testSpeedAdjustment(1.0);   // 恢复正常
```

---

## 🔄 脚本 5: 完全重置

```javascript
// 完全重置扩展（核武器选项）
async function fullReset() {
  console.log('🔄 开始完全重置...\n');
  
  const ctrl = window.SleepyTubeController;
  if (!ctrl) {
    console.error('❌ 扩展未加载');
    return;
  }
  
  // 1. 断开音频引擎
  if (ctrl.audioEngine?.isConnected) {
    console.log('⏳ 断开音频引擎...');
    ctrl.audioEngine.disconnect();
    console.log('✅ 已断开');
  }
  
  // 2. 停止所有组件
  if (ctrl.audioEngine?.speechRateDetector) {
    ctrl.audioEngine.speechRateDetector.stop();
  }
  if (ctrl.audioEngine?.speechRateController) {
    ctrl.audioEngine.speechRateController.disable();
  }
  
  console.log('✅ 所有组件已停止');
  
  // 3. 等待 2 秒
  console.log('⏳ 等待 2 秒...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 4. 重新连接
  console.log('⏳ 重新连接音频引擎...');
  await ctrl.audioEngine.connect();
  console.log('✅ 音频引擎已连接');
  
  // 5. 启用语速检测
  if (ctrl.audioEngine.speechRateDetector) {
    ctrl.audioEngine.speechRateDetector.start();
    console.log('✅ 检测器已启动');
  }
  
  if (ctrl.audioEngine.speechRateController) {
    ctrl.audioEngine.speechRateController.enable('normal');
    console.log('✅ 控制器已启用');
  }
  
  console.log('\n🎉 重置完成！');
  console.log('💡 请等待 5 秒观察检测结果');
}

// 运行：
// fullReset();
```

---

## 📝 使用说明

### 第一次测试时：

1. **先运行脚本 1（安全检查）**
   ```javascript
   // 复制粘贴脚本 1 的代码
   ```
   
2. **根据结果决定下一步**：
   - 如果显示 "所有组件正常" → 查看检测结果
   - 如果显示问题 → 运行脚本 2（强制启用）
   
3. **如果还不工作**：
   - 运行脚本 3（实时监控）观察状态变化
   - 运行脚本 4（手动测试）验证速度调整是否有效
   
4. **最后手段**：
   - 运行脚本 5（完全重置）

---

## 🚨 常见错误处理

### 错误 1: `SleepyTubeController is undefined`

**解决**：
```
1. 刷新页面 (F5)
2. 等待 2-3 秒让扩展加载
3. 再次运行脚本
```

### 错误 2: `audioEngine is undefined`

**解决**：
```
1. 点击 SleepyTube 按钮（左键）
2. 等待按钮变绿
3. 再次运行脚本
```

### 错误 3: `Cannot read properties of null`

**解决**：
```
1. 确保视频正在播放
2. 确保不是直播或特殊视频
3. 尝试换一个普通视频
```

---

## 💡 快速故障排除流程图

```
打开 YouTube 视频
      ↓
运行脚本 1 (安全检查)
      ↓
    有错误?
   ↙     ↘
 是       否
 ↓        ↓
按提示   运行脚本 3
修复     (实时监控)
 ↓        ↓
运行     观察数据
脚本 2    ↓
(强制   正常吗?
启用)   ↙   ↘
 ↓    是    否
等5秒  ↓     ↓
 ↓   完成  运行
查看       脚本 5
结果       (重置)
```
