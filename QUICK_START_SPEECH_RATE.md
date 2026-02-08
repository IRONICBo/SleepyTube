# 🎙️ 语速调整功能快速入门

## 📍 如何找到语速控制面板？

### 方法 1：右键菜单（推荐）

1. **打开任意 YouTube 视频**
   
2. **找到 SleepyTube 按钮**（播放器控制栏中的均衡器图标）
   ```
   YouTube 播放器底部控制栏：
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ▶️ | ⏸ | 🔊 | ⚙️ | 🎵 [SleepyTube] | 🔴 | ⚙️ | ⛶
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    ↑
              在这里（绿色均衡器图标）
   ```

3. **右键点击 SleepyTube 按钮**
   - Windows/Linux: 右键点击
   - Mac: Control + 点击 或 双指点击

4. **控制面板弹出**
   ```
   ┌─────────────────────────────────────┐
   │ 🌙 SleepyTube Control Panel        │
   ├─────────────────────────────────────┤
   │ ⚙️ Scene Mode                       │
   │   [OFF] [Sleep] [Podcast] [Movie]  │
   │                                     │
   │ 🎚️ Basic Controls                   │
   │   Compression: [Light/Med/Strong]  │
   │   Sleep EQ: ...                    │
   │                                     │
   │ 🎙️ Speech Rate  ← 在这里！          │
   │   Speech Rate Adjustment  [开关]   │  ← 点击这个开关
   │                                     │
   │ 🔍 Advanced                         │
   │   ...                              │
   └─────────────────────────────────────┘
   ```

5. **打开语速调整开关**
   - 找到 "Speech Rate Adjustment" 一行
   - 点击右侧的开关按钮（从灰色变成绿色）
   
6. **选择目标语速**
   ```
   开关打开后，下方会展开选项：
   
   Target Speech Rate:
   ┌──────┬────────┬──────┬──────┐
   │ Slow │ Normal │ Fast │ Auto │
   └──────┴────────┴──────┴──────┘
     2.5    3.5      4.5    自适应
     syl/s  syl/s    syl/s
   
   点击任意一个按钮即可设置目标语速
   ```

---

## 🎯 各个选项的含义

### Target Speech Rate（目标语速）

| 选项 | 含义 | 目标速度 | 适用场景 |
|------|------|----------|----------|
| **Slow** | 慢速 | 2.5 音节/秒 | 学习外语、记笔记 |
| **Normal** | 正常 | 3.5 音节/秒 | 日常听播客、讲座 |
| **Fast** | 快速 | 4.5 音节/秒 | 快速浏览内容 |
| **Auto** | 自动 | 自适应 | 让系统自动判断 |

### 工作原理

1. **检测当前语速**：系统实时分析音频，检测说话者的语速
2. **自动调整播放速度**：
   - 如果视频语速 > 目标语速 → 减速播放
   - 如果视频语速 < 目标语速 → 加速播放
   - 如果视频语速 ≈ 目标语速 → 正常播放

**示例**：
```
场景：看一个快节奏新闻视频
- 检测到：5.2 音节/秒（very_fast）
- 你选择：Normal (3.5 syl/s)
- 系统计算：5.2 / 3.5 = 1.49x 太快
- 自动调整：减速到 0.75x
- 结果：听起来更舒服，不那么快了
```

---

## 👁️ 如何看到语速变化？

### 位置 1：控制面板底部（实时监控）

打开右键菜单后，在 Speech Rate 部分的最底部：

```
┌─────────────────────────────────────────────┐
│ Speech Rate                                 │
│ Speech Rate Adjustment  [✓ 已开启]          │
│                                             │
│ Target Speech Rate:                         │
│ [Slow] [●Normal] [Fast] [Auto]              │
│                                             │
│ Detected: 5.2 syl/s (very_fast) | Playback: 0.75x
│           ↑ 检测到的语速        ↑ 当前播放速度
└─────────────────────────────────────────────┘
```

### 位置 2：浮动状态面板（右上角）

启用语速调整后，视频播放器右上角会出现一个浮动面板：

```
屏幕右上角：
┌─────────────────────────────┐
│ 🎙️ Speech Rate      − × │  ← 标题栏
├─────────────────────────────┤
│ Detected:  5.2 syl/s        │  ← 实时检测
│           (very_fast)       │
│ Speed:     0.75x            │  ← 当前播放速度（橙色=减速）
│ Target:    Normal           │  ← 你的目标
│ Status:    Active           │  ← 绿色=工作中
├─────────────────────────────┤
│     ⏸ Pause                │  ← 控制按钮
└─────────────────────────────┘
```

**颜色含义**：
- 🟠 **橙色** (Speed < 0.9x)：减速播放
- 🟢 **绿色** (Speed 0.9-1.1x)：正常速度
- 🔵 **蓝色** (Speed > 1.1x)：加速播放

### 位置 3：通知弹窗（临时显示）

重要事件会在右上角弹出通知（3秒后消失）：

```
启用时：
┌────────────────────────────┐
│ ✅ Speech Rate Active      │
│ Target: Normal             │
└────────────────────────────┘

速度变化时：
┌────────────────────────────┐
│ ⚡ Speed Adjusting         │
│ 1.00x → 0.75x              │
└────────────────────────────┘

手动调速时：
┌────────────────────────────┐
│ ⚠️ Manual Speed            │
│ Auto-adjustment paused     │
│ for 30s                    │
└────────────────────────────┘
```

---

## 🧪 测试步骤（确认功能正常）

### 5 分钟快速测试

1. **重新加载扩展**
   ```
   打开：chrome://extensions/
   找到：SleepyTube
   点击：刷新图标 🔄
   ```

2. **打开测试视频**
   - 推荐：快节奏新闻、脱口秀、TED演讲
   - 确保有清晰的语音内容

3. **先启用 Sleep Mode**
   - 点击 SleepyTube 按钮（左键单击）
   - 按钮变绿 ✓

4. **打开控制面板**
   - 右键点击 SleepyTube 按钮
   - 面板弹出

5. **向下滚动找到 "Speech Rate"**
   - 在面板中间偏下位置
   - 标题是 "🎙️ Speech Rate"

6. **打开开关**
   - 点击 "Speech Rate Adjustment" 右侧的开关
   - 开关变绿 ✓
   - 下方展开选项

7. **选择 "Normal"**
   - 点击 "Normal" 按钮
   - 按钮高亮显示

8. **观察变化**：
   - ✅ 右上角弹出绿色通知："✅ Speech Rate Active"
   - ✅ 右上角出现浮动面板
   - ✅ 面板底部显示："Detected: X.X syl/s | Playback: X.XXx"
   - ✅ 如果视频语速快，应该看到速度 < 1.0x（减速）

---

## 🎮 控制按钮说明

### 浮动面板按钮

```
┌─────────────────────────────┐
│ 🎙️ Speech Rate      − × │
│                   ↑   ↑   │
│                   │   └─ Close (关闭功能)
│                   └───── Minimize (最小化)
├─────────────────────────────┤
│ ...数据显示...              │
├─────────────────────────────┤
│     ⏸ Pause                │  ← Pause/Resume (暂停/恢复)
└─────────────────────────────┘
```

| 按钮 | 功能 | 效果 |
|------|------|------|
| **−** (最小化) | 折叠面板 | 只保留标题栏，隐藏内容 |
| **×** (关闭) | 禁用功能 | 移除面板，恢复原速度 |
| **⏸ Pause** | 暂停调整 | 冻结当前速度，不再自动调整 |
| **▶ Resume** | 恢复调整 | 继续自动检测和调整速度 |

---

## 🐛 常见问题

### Q1: 找不到 Speech Rate 选项

**可能原因**：
- 扩展版本太旧，需要重新加载

**解决方法**：
```bash
1. chrome://extensions/
2. 找到 SleepyTube
3. 点击 "移除"
4. 点击 "加载已解压的扩展程序"
5. 选择 extension 文件夹
6. 重新打开 YouTube
```

### Q2: 右键菜单没有反应

**解决方法**：
- 确保点击的是 SleepyTube 按钮（绿色均衡器图标）
- 不是 YouTube 自己的设置按钮
- 刷新 YouTube 页面 (F5)

### Q3: 打开开关后没有展开选项

**检查**：
```javascript
// 在 Console (F12) 中运行：
const container = document.getElementById('speech-rate-container');
console.log('Container display:', container ? container.style.display : 'not found');

// 如果输出 "none"，手动显示：
if (container) container.style.display = 'block';
```

### Q4: 浮动面板没有出现

**检查**：
1. 确保 Sleep Mode 已启用（按钮是绿色）
2. 确保 Speech Rate 开关已打开
3. 播放视频（不是暂停状态）
4. 等待 3-5 秒让检测启动

**手动检查**：
```javascript
// F12 Console:
const ctrl = window.SleepyTubeController?.audioEngine?.speechRateController;
console.log('Enabled:', ctrl?.isEnabled);
console.log('Panel:', document.getElementById('st-rate-indicator'));

// 如果 enabled=true 但没有面板，手动创建：
if (ctrl && ctrl.isEnabled && !ctrl.indicator) {
  ctrl.createIndicator();
}
```

### Q5: 速度变化太慢/太快

**调整灵敏度**：
- 选择不同的目标速度
- "Slow" = 更激进的减速
- "Fast" = 更激进的加速
- "Auto" = 智能自适应

---

## 📊 数据含义

### Detected（检测到的语速）

```
显示：5.2 syl/s (very_fast)
       ↑          ↑
       数值      分类
```

**分类标准**：
| 分类 | 范围 (音节/秒) | 说明 |
|------|----------------|------|
| very_slow | < 2.0 | 非常慢（耳语、冥想） |
| slow | 2.0 - 3.0 | 慢速（教学） |
| normal | 3.0 - 4.0 | 正常（日常对话） |
| fast | 4.0 - 5.0 | 快速（播客、演讲） |
| very_fast | > 5.0 | 非常快（新闻、脱口秀） |

### Speed（播放速度）

```
显示：0.75x
      ↑
      播放倍率
```

**含义**：
- `1.0x` = 正常速度
- `0.75x` = 慢 25%（减速）
- `1.25x` = 快 25%（加速）
- `0.5x` = 最慢（一半速度）
- `1.5x` = 最快（1.5倍速度）

### Status（状态）

| 状态 | 颜色 | 含义 |
|------|------|------|
| **Active** | 🟢 绿色 | 正常工作，自动调整中 |
| **Paused** | 🟠 橙色 | 已暂停，不调整速度 |

---

## 🎯 最佳实践

### 场景推荐

| 场景 | 推荐设置 | 原因 |
|------|----------|------|
| **学习外语** | Slow (2.5) | 听清每个单词 |
| **记笔记** | Slow (2.5) | 有时间写下内容 |
| **听播客** | Normal (3.5) | 舒适的听感 |
| **快速浏览** | Fast (4.5) | 节省时间 |
| **入睡** | Normal (3.5) + Sleep Mode | 稳定、不刺激 |
| **看新闻** | Normal (3.5) | 减慢快节奏的播报 |
| **ASMR** | 关闭 | ASMR 本身就很慢 |

### 与 Sleep Mode 配合使用

**推荐组合**：
```
Sleep Mode: 启用
├─ Scene: Sleep
│  ├─ Compression: Strong
│  ├─ EQ: Ultra Soft
│  └─ Voice Focus: Off
│
└─ Speech Rate: 启用
   └─ Target: Normal (3.5 syl/s)

效果：音量稳定 + 速度舒适 = 完美入睡体验
```

---

## 📹 视频教程（文字版）

### 完整操作流程

```
1. 打开 YouTube 视频
   └→ 等待播放器加载完成

2. 点击 SleepyTube 按钮（左键）
   └→ 按钮变绿，Sleep Mode 启用

3. 右键点击 SleepyTube 按钮
   └→ 控制面板弹出

4. 向下滚动到 "Speech Rate" 部分
   └→ 看到 "Speech Rate Adjustment" 开关

5. 点击开关
   └→ 开关变绿，下方展开选项

6. 点击 "Normal" 按钮
   └→ 按钮高亮，设置生效

7. 关闭控制面板（点击面板外任意位置）
   └→ 面板消失

8. 观察右上角
   ├→ 绿色通知："✅ Speech Rate Active"
   └→ 浮动面板显示实时数据

9. 播放视频，等待 3-5 秒
   └→ 看到 "Detected" 开始显示数据
   └→ "Speed" 开始调整

10. 享受！
```

---

## 🚀 下一步

学会使用后，可以：
1. **尝试不同视频类型**：新闻、播客、教学、ASMR
2. **对比不同目标速度**：Slow vs Normal vs Fast
3. **测试手动调速**：看 30 秒暂停功能
4. **使用暂停/恢复**：控制调整行为
5. **配合 Scene Mode**：一键设置完美组合

---

## 📚 相关文档

- `TESTING_SPEECH_RATE_UX.md` - 完整测试指南
- `SPEECH_RATE_UX_IMPLEMENTATION.md` - 技术实现细节
- `SPEECH_RATE_TECHNICAL.md` - 检测算法原理
- `SPEECH_RATE_GUIDE.md` - 用户使用手册

---

**现在你知道在哪里找到语速控制了！** 🎉

有任何问题，随时问我！
