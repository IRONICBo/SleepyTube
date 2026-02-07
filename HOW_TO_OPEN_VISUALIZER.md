# 🎨 如何打开音频可视化器

## 方法 1：自动弹出（推荐）⚡

这是最简单的方式：

1. **打开任意 YouTube 视频**
   - 例如：https://www.youtube.com/watch?v=dQw4w9WgXcQ

2. **找到 SleepyTube 按钮**
   - 位置：YouTube 播放器右下角控制栏
   - 图标：📊 竖条形均衡器图标
   - 在音量滑块和设置按钮之间

3. **点击按钮启用 Sleep Mode**
   - 按钮变绿色高亮
   - 等待 **1.2 秒**

4. **可视化器自动弹出** 🎉
   - 应该在屏幕中央出现一个深色面板
   - 显示红色和绿色波形

---

## 方法 2：手动打开 🖱️

如果自动弹出没有显示：

1. **右键点击** SleepyTube 按钮（均衡器图标）

2. **设置面板打开**
   - 深色浮动面板
   - 显示各种设置选项

3. **向下滚动找到按钮**
   - 标题："Show Audio Monitor"
   - 图标：📊 + 文字
   - 通常在面板底部

4. **点击 "Show Audio Monitor" 按钮**
   - 可视化器立即弹出

---

## 方法 3：开发者控制台 💻

如果上述方法都不行，可以手动调用：

1. **打开开发者工具**
   - Windows/Linux: `F12` 或 `Ctrl + Shift + I`
   - Mac: `Cmd + Option + I`

2. **切换到 Console 标签**

3. **输入以下命令并按回车**：
   ```javascript
   window.SleepyTubeController.uiManager.toggleVisualizer()
   ```

4. **可视化器应该立即显示**

---

## 📍 可视化器的位置

可视化器显示在：
- **位置**：屏幕正中央
- **大小**：850px 宽 × 约 600px 高
- **层级**：覆盖在页面内容之上（z-index: 10001）
- **背景**：深色渐变（#1a1a1a → #0a0a0a）

---

## 🔍 视觉检查清单

打开后应该看到：

### 顶部标题栏
```
┌─────────────────────────────────────────┐
│ 🎵 SleepyTube Audio Monitor        [×] │
└─────────────────────────────────────────┘
```

### 主画布区域
```
┌─────────────────────────────────────────┐
│ [Before Processing]  [After Processing] │
│                                         │
│  ~~~~~~~ (红色波形，上半部分)            │
│  ─────────────────── (中线)             │
│  ~~~~~~~ (绿色波形，下半部分)            │
│                                         │
└─────────────────────────────────────────┘
```

### 指标卡片区域
```
┌──────────────────┬──────────────────┐
│ Current Loudness │ AGC Gain         │
│ -18.5 dB         │ +3.2 dB          │
│ ████████░░░      │ ░░░████░░░       │
└──────────────────┴──────────────────┘
┌──────────────────┬──────────────────┐
│ Peaks Suppressed │ Peak Reduction   │
│ 42               │ 5.2 dB           │
└──────────────────┴──────────────────┘
┌─────────────────────────────────────┐
│ Compression Activity                │
│ ██████░░░░░░ Ratio: 4.0:1           │
└─────────────────────────────────────┘
```

### 底部信息栏
```
┌─────────────────────────────────────────┐
│ ⏱️ Real-time @ 60 FPS  ⚡ Zero latency │
└─────────────────────────────────────────┘
```

---

## 🐛 故障排除

### 问题 1：按钮没有出现
**检查**：
```javascript
// 在控制台输入：
document.querySelector('#sleepytube-toggle')
```
- 如果返回 `null`：按钮未注入，检查扩展是否加载
- 如果返回 `<button...>`：按钮已注入，继续下一步

### 问题 2：点击按钮无反应
**检查**：
```javascript
// 在控制台输入：
window.SleepyTubeController.audioEngine
```
- 如果返回 `null`：音频引擎未初始化，等待几秒后重试
- 如果返回 `AudioEngine {…}`：音频引擎已就绪

### 问题 3：可视化器不显示
**手动检查 DOM**：
```javascript
// 1. 检查可视化器元素是否存在
const viz = document.querySelector('.sleepytube-visualizer');
console.log('Visualizer element:', viz);

// 2. 检查可视化器的样式
if (viz) {
  const styles = getComputedStyle(viz);
  console.log('Opacity:', styles.opacity);
  console.log('Display:', styles.display);
  console.log('Position:', styles.position);
  console.log('Z-index:', styles.zIndex);
}

// 3. 手动添加可见类
if (viz) {
  viz.classList.add('visualizer-visible');
}
```

**预期结果**：
- `opacity` 应该是 `"1"`（可见时）或 `"0"`（隐藏时）
- `position` 应该是 `"fixed"`
- `z-index` 应该是 `"10001"`

### 问题 4：CSS 未加载
**检查样式表**：
```javascript
// 检查是否有可视化器相关的 CSS
const styleSheets = Array.from(document.styleSheets);
const sleepytubeStyles = styleSheets.find(sheet => 
  sheet.href && sheet.href.includes('sleepytube')
);

if (sleepytubeStyles) {
  console.log('Styles loaded:', sleepytubeStyles.href);
  
  // 检查规则数量
  console.log('CSS rules:', sleepytubeStyles.cssRules.length);
} else {
  console.error('SleepyTube styles NOT loaded!');
}
```

### 问题 5：波形不动
**检查音频上下文**：
```javascript
const engine = window.SleepyTubeController.audioEngine;

if (engine) {
  console.log('Audio context state:', engine.audioContext.state);
  console.log('Is connected:', engine.isConnected);
  console.log('Has nodes:', !!engine.nodes);
  
  // 检查分析器
  if (engine.nodes) {
    console.log('Source analyser:', engine.nodes.sourceAnalyser);
    console.log('Output analyser:', engine.nodes.outputAnalyser);
  }
}
```

**预期结果**：
- `state` 应该是 `"running"`
- `isConnected` 应该是 `true`
- 两个 analyser 都应该存在

---

## 🎬 完整演示步骤

### 第一次使用（完整流程）

1. **重新加载扩展**
   ```
   1. 打开 chrome://extensions/
   2. 找到 SleepyTube
   3. 点击刷新图标 🔄
   ```

2. **打开 YouTube**
   ```
   1. 访问 https://www.youtube.com
   2. 点击任意视频
   3. 等待视频播放器加载（约 1-2 秒）
   ```

3. **验证按钮已注入**
   ```
   1. 查看播放器右下角
   2. 应该看到均衡器图标 📊
   3. 鼠标悬停应显示 tooltip
   ```

4. **启用 Sleep Mode**
   ```
   1. 点击 📊 按钮
   2. 按钮变绿色高亮 ✅
   3. 音频开始淡入（1 秒）
   ```

5. **等待可视化器**
   ```
   1. 等待 1.2 秒
   2. 屏幕中央应出现深色面板
   3. 看到红色和绿色波形动画
   ```

6. **验证动画正常**
   ```
   1. 播放视频
   2. 波形应该随音频跳动
   3. 指标应该实时更新
   ```

---

## 📸 截图参考位置

### 按钮位置
```
YouTube 播放器底部：
[播放/暂停] [下一个] [音量 🔊▬▬▬▬] [📊] [⚙️设置] [剧场模式] [全屏]
                                     ↑
                                这里就是 SleepyTube 按钮
```

### 可视化器位置
```
浏览器窗口：
┌─────────────────────────────────────────────┐
│                                             │
│           YouTube 视频播放器                │
│                                             │
│         ┌──────────────────┐                │
│         │  可视化器面板    │                │
│         │  (屏幕正中央)    │                │
│         │  850px × 600px  │                │
│         └──────────────────┘                │
│                                             │
│         视频描述和评论...                   │
└─────────────────────────────────────────────┘
```

---

## ⌨️ 快速调试命令

复制粘贴到控制台快速诊断：

```javascript
// 完整诊断脚本
console.log('=== SleepyTube 诊断 ===');

// 1. 检查控制器
const ctrl = window.SleepyTubeController;
console.log('✓ Controller exists:', !!ctrl);

// 2. 检查 UI 管理器
const ui = ctrl?.uiManager;
console.log('✓ UI Manager exists:', !!ui);

// 3. 检查可视化器对象
const viz = ui?.visualizer;
console.log('✓ Visualizer object exists:', !!viz);

// 4. 检查可视化器 DOM
const vizDom = document.querySelector('.sleepytube-visualizer');
console.log('✓ Visualizer in DOM:', !!vizDom);

// 5. 检查可见性
if (vizDom) {
  const styles = getComputedStyle(vizDom);
  console.log('✓ Opacity:', styles.opacity);
  console.log('✓ Visibility:', viz?.isVisible);
}

// 6. 检查音频引擎
const engine = ctrl?.audioEngine;
console.log('✓ Audio engine exists:', !!engine);
console.log('✓ Audio initialized:', engine?.isInitialized);
console.log('✓ Audio connected:', engine?.isConnected);

// 7. 尝试打开可视化器
console.log('\n尝试打开可视化器...');
if (ui && typeof ui.toggleVisualizer === 'function') {
  ui.toggleVisualizer();
  console.log('✓ 已调用 toggleVisualizer()');
} else {
  console.error('✗ 无法调用 toggleVisualizer()');
}
```

---

## 💡 提示

- 可视化器需要视频正在播放才能看到波形动画
- 如果视频暂停，波形会变成一条直线
- 第一次打开可能需要等待 1-2 秒初始化
- 关闭可视化器：点击右上角的 ✕ 按钮

---

**如果以上所有方法都不行**，请提供：
1. 浏览器控制台的错误信息截图
2. 运行诊断脚本的输出
3. Chrome 版本号
4. 是否看到 SleepyTube 按钮

我会帮您进一步排查！🔍
