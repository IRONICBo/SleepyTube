# SleepyTube 测试指南

## 🐛 已修复的问题

### 问题描述
- ❌ 找不到 video 元素
- ❌ 音频曲线和按钮没有注入
- ❌ 扩展完全无法工作

### 根本原因
**语法错误**：`extension/content/main.js` 第 378 行有重复的 `break;` 语句和多余的 `}`，导致整个脚本无法加载。

```javascript
// 错误代码：
case 'getSpeechRateStatus':
  // ...
  break;
  }  // ← 多余的 }
  break;  // ← 重复的 break

// 正确代码：
case 'getSpeechRateStatus':
  // ...
  break;
```

### 修复提交
```
2b39337 fix: syntax error in message handler
```

## ✅ 测试步骤

### 1. 加载扩展

```bash
# Chrome 浏览器
1. 打开 chrome://extensions/
2. 开启「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择目录：SleepyTube/extension/
```

### 2. 检查扩展已加载

在扩展页面应该看到：
- ✅ **SleepyTube - YouTube Sleep Mode**
- ✅ 绿色的equalizer图标
- ✅ 版本号：1.3.0
- ✅ 没有错误提示

### 3. 测试基本功能

#### A. 打开 YouTube 视频

```
1. 访问 https://www.youtube.com/watch?v=任意视频ID
2. 等待视频加载
```

#### B. 检查按钮注入

应该在视频播放器右上角看到：
- ✅ **SleepyTube 按钮**（灰色=关闭，绿色=开启）
- ✅ 鼠标悬停显示 tooltip

#### C. 检查控制台日志

打开 DevTools（F12），Console 标签页应该看到：

```
[SleepyTube] Initializing SleepyTube...
[SleepyTube] Booting on /watch
[SleepyTube] Starting button injection...
[SleepyTube] Detected Watch page, injecting Watch button
[SleepyTube] Found controls element: <div class="ytp-right-controls">
[SleepyTube] UI injected early ✨
[SleepyTube] Found video element: .html5-video-player > video.html5-main-video
[SleepyTube] Audio engine initialized successfully
[SleepyTube] SleepyTube ready (audio connected) 🎵
[SleepyTube] Content script loaded
```

如果看到错误，说明还有问题。

### 4. 测试功能

#### A. 开启 Sleep Mode

```
1. 点击 SleepyTube 按钮（或点击扩展图标）
2. 选择场景：Sleep / Podcast / Movie
3. 按钮应该变成绿色
4. 应该看到音频波形显示（红色=Before, 绿色=After）
```

#### B. 测试音频处理

```
1. 播放视频
2. 观察音量变化是否被压缩
3. 调整音量，测试 AGC 是否工作
4. 切换场景，测试配置是否生效
```

#### C. 测试压缩热力图

```
1. 开启 Sleep Mode
2. 视频进度条下方应该显示彩色的压缩热力图
3. 绿色=正常，黄色=中度压缩，红色=强压缩
```

#### D. 测试语速调整（Podcast 模式）

```
1. 选择 Podcast 场景
2. 打开高级设置（⚙️）
3. 检查 Speech Rate Adjustment 已开启
4. 播放快速说话的视频
5. 观察实时检测和播放速度调整
```

## 🔍 故障排除

### 问题：按钮仍然没有注入

**解决**：
1. 检查控制台是否有 JavaScript 错误
2. 确认所有文件都已加载：
   ```javascript
   // 在控制台输入：
   window.SleepyTubeUtils
   window.SleepyTubeConfig
   window.UIManager
   window.AudioEngine
   window.SleepyTubeController
   ```
3. 刷新页面（Ctrl/Cmd + R）
4. 重新加载扩展

### 问题：找不到 video 元素

**检查**：
```javascript
// 控制台输入：
document.querySelector('.html5-video-player > video.html5-main-video')
```

如果返回 `null`，说明 YouTube 页面结构变化了。

**解决**：
更新 `main.js` 中的 video 选择器。

### 问题：音频没有处理

**检查**：
```javascript
// 控制台输入：
window.SleepyTubeController.audioEngine
window.SleepyTubeController.audioEngine.isConnected
```

应该返回 AudioEngine 对象和 `true`。

### 问题：语速检测不工作

**检查**：
1. 确认是 Podcast 场景
2. 确认视频有清晰的人声
3. 等待 10-15 秒让检测稳定
4. 查看控制台是否有语速日志

## 📊 验证清单

测试前请确认：

- [ ] 所有 JS 文件无语法错误
- [ ] manifest.json 配置正确
- [ ] 扩展已在 Chrome 中加载
- [ ] YouTube 页面已打开
- [ ] DevTools 控制台已打开

测试后应看到：

- [ ] SleepyTube 按钮已注入
- [ ] 按钮点击可切换状态
- [ ] 音频处理生效
- [ ] 波形可视化显示
- [ ] 压缩热力图显示
- [ ] Popup 界面正常
- [ ] 场景切换正常
- [ ] 无控制台错误

## 🎯 下一步

如果所有测试通过：

1. ✅ 基本功能正常
2. ✅ 可以开始使用
3. ✅ 可以准备发布

如果仍有问题：

1. 查看控制台错误日志
2. 检查网络请求是否失败
3. 确认 YouTube 页面结构没变
4. 尝试不同的 YouTube 页面（watch vs shorts）

---

**当前版本**: 1.4.0  
**最后测试**: 2026-02-08  
**状态**: ✅ 语法错误已修复
