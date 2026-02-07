# 🎛️ SleepyTube Popup 使用指南

## 🎉 新功能：完整设置面板

现在所有详细配置都移到了扩展的 Popup 中，使用更加直观方便！

---

## 📍 如何打开 Popup

### 方法 1：点击扩展图标
1. 在 Chrome 工具栏找到 SleepyTube 图标 📊
2. 单击图标

### 方法 2：右键菜单
1. 右键点击 SleepyTube 图标
2. 选择"管理扩展"或直接左键点击

---

## 🎨 Popup 界面布局

```
┌──────────────────────────────────────┐
│ 📊 SleepyTube                        │
│    Sleep-safe YouTube audio          │
│    ● Active / ● Ready / ● Inactive   │ ← 状态指示
├──────────────────────────────────────┤
│                                      │
│ ┌────────────────────────────────┐   │
│ │ Sleep Mode              [ON]   │   │ ← 主开关
│ │ Enable audio normalization...  │   │
│ └────────────────────────────────┘   │
│                                      │
│ ▼ Show Advanced Settings             │ ← 展开按钮
│                                      │
│ ═══ STABILITY LEVEL ═══              │
│ [ Light ] [ Medium ] [ Strong ]      │ ← 压缩强度
│                                      │
│ ═══ SOUND SOFTENING ═══              │
│ [ Natural ] [ Gentle ] [ Ultra Soft ]│ ← EQ 预设
│                                      │
│ Voice Focus Mode            [OFF]    │ ← 人声增强
│   └─ Background Ducking: -9 dB       │
│      ╱──────●────────╲               │
│                                      │
│ Auto Gain Control           [ON]     │ ← 自动增益
│   └─ Target Loudness: -18 LUFS      │
│      ╱──────●────────╲               │
│                                      │
│ 🔊 Output Volume: 0 dB               │ ← 输出音量
│ ╱──────●────────╲                    │
│                                      │
│ [ 📊 Show Audio Monitor ]            │ ← 打开可视化器
│                                      │
│ ⓘ Open a YouTube video to see...    │
│                                      │
│ [ ? Help ] [ GitHub ]                │
├──────────────────────────────────────┤
│ SleepyTube v1.2.1                    │
└──────────────────────────────────────┘
```

---

## ⚙️ 设置说明

### 1. 主开关 - Sleep Mode

**位置**: 顶部大卡片
**功能**: 启用/禁用整个音频处理

```
┌────────────────────────────────┐
│ Sleep Mode              [ON]   │
│ Enable audio normalization...  │
└────────────────────────────────┘
```

- **开启** (绿色)：音频处理已激活
- **关闭** (灰色)：音频直通，不处理

**快捷操作**：
- 点击开关立即生效
- 也可以在视频页面点击 📊 按钮

---

### 2. 状态指示器

**位置**: 标题下方

| 状态 | 颜色 | 说明 |
|------|------|------|
| ● Active | 🟢 绿色 | Sleep Mode 已启用 |
| ● Ready | 🔵 蓝色 | 在 YouTube 页面，准备就绪 |
| ● Inactive | ⚫ 灰色 | 不在 YouTube 页面 |

---

### 3. 高级设置展开/折叠

**按钮**: "Show Advanced Settings" / "Hide Advanced Settings"

- 默认：折叠（简洁界面）
- 点击：展开显示所有详细设置
- 再次点击：折叠隐藏

**建议**:
- 首次使用：展开查看所有选项
- 日常使用：折叠只显示主开关

---

### 4. Stability Level（稳定性级别）

**功能**: 控制动态范围压缩强度

```
[ Light ] [ Medium ] [ Strong ]
```

| 选项 | 说明 | 适合 |
|------|------|------|
| **Light** | 轻度压缩 | 音质优先，保留更多动态 |
| **Medium** ⭐ | 中度压缩（推荐） | 平衡音质与稳定性 |
| **Strong** | 强力压缩 | 最大稳定性，适合睡眠 |

**效果**:
- Light: 保留自然动态，轻微平滑
- Medium: 明显减少音量波动
- Strong: 几乎消除所有突然变化

---

### 5. Sound Softening（声音柔化）

**功能**: 调整音色，减少刺耳感

```
[ Natural ] [ Gentle ] [ Ultra Soft ]
```

| 选项 | 说明 | 效果 |
|------|------|------|
| **Natural** | 原始音色 | 不改变频率响应 |
| **Gentle** ⭐ | 温和柔化（推荐） | 轻微削减高频 |
| **Ultra Soft** | 超级柔和 | 大幅削减高频和低频 |

**调整内容**:
- 高频（High Shelf）：削减 8kHz 以上
- 低频（Low Shelf）：削减 80Hz 以下

---

### 6. Voice Focus Mode（人声增强模式）

**功能**: 增强语音清晰度，降低背景音

```
Voice Focus Mode            [OFF]
  └─ Background Ducking: -9 dB
     ╱──────●────────╲
```

**开关**:
- **ON**: 启用人声增强
- **OFF**: 全频段平衡

**Ducking 滑块**:
- 范围：0 dB 到 -12 dB
- 默认：-9 dB
- 效果：检测到人声时，降低背景音的分贝数

**适合**:
- ✅ 播客、采访、教学视频
- ✅ ASMR（有语音部分）
- ❌ 纯音乐视频

---

### 7. Auto Gain Control（自动增益控制）

**功能**: 自动调整音量，保持一致响度

```
Auto Gain Control           [ON]
  └─ Target Loudness: -18 LUFS
     ╱──────●────────╲
```

**开关**:
- **ON**: 启用 AGC（推荐）
- **OFF**: 手动控制音量

**Target Loudness 滑块**:
- 范围：-24 LUFS（安静）到 -12 LUFS（响亮）
- 默认：-18 LUFS（舒适）
- 单位：LUFS（响度单位）

**工作原理**:
- 实时测量音频响度
- 自动调整增益达到目标
- 平滑过渡（无突变）

**效果**:
- 安静视频自动提升音量
- 响亮视频自动降低音量
- 切换视频时保持一致

---

### 8. Output Volume（输出音量）

**功能**: 手动微调最终输出音量

```
🔊 Output Volume: 0 dB
╱──────●────────╲
-12 dB    0 dB    +12 dB
```

- 范围：-12 dB 到 +12 dB
- 默认：0 dB（中性）
- 步进：1 dB

**使用场景**:
- 整体音量太小：向右调（+）
- 整体音量太大：向左调（-）
- 配合 AGC 使用：微调到个人偏好

---

### 9. Show Audio Monitor（显示音频监视器）

**按钮**: `[ 📊 Show Audio Monitor ]`

**功能**: 打开实时音频可视化器

**点击后**:
- 在视频页面弹出可视化器窗口
- 显示红色/绿色波形对比
- 实时指标更新

**注意**: 需要在 YouTube 视频页面才能使用

---

## 🔄 设置同步

### 自动保存
- **所有设置自动保存**到 Chrome 同步存储
- 关闭 Popup 后设置依然保留
- 切换视频时设置继续生效

### 跨标签页同步
- 在一个标签页修改设置
- 其他标签页自动更新
- 实时生效，无需刷新

### 实时应用
- Popup 中的更改**立即生效**
- 无需点击"保存"按钮
- 调整滑块时实时听到变化

---

## 💡 使用技巧

### 快速设置（推荐）

**第一次使用**:
1. 打开 Popup
2. 开启 Sleep Mode
3. 选择 Medium 压缩 + Gentle EQ
4. 启用 Auto Gain Control
5. 完成！

**进阶调整**:
1. 点击"Show Advanced Settings"
2. 根据视频内容调整：
   - 播客：开启 Voice Focus
   - 音乐：关闭 Voice Focus
   - 太吵：Strong 压缩 + Ultra Soft EQ
   - 太闷：Light 压缩 + Natural EQ

### 常见场景

**🎧 睡前听播客**:
```
✓ Sleep Mode: ON
✓ Compression: Strong
✓ EQ: Gentle
✓ Voice Focus: ON (Ducking -9dB)
✓ AGC: ON (Target -18 LUFS)
✓ Output: 0 dB
```

**🎵 睡前听音乐**:
```
✓ Sleep Mode: ON
✓ Compression: Medium
✓ EQ: Ultra Soft
✓ Voice Focus: OFF
✓ AGC: ON (Target -18 LUFS)
✓ Output: -3 dB (更轻柔)
```

**📺 看教学视频**:
```
✓ Sleep Mode: ON
✓ Compression: Light
✓ EQ: Natural
✓ Voice Focus: ON (Ducking -6dB)
✓ AGC: ON (Target -15 LUFS)
✓ Output: 0 dB
```

---

## ⌨️ 键盘快捷键

虽然 Popup 主要用鼠标操作，但可以设置快捷键：

1. 访问 `chrome://extensions/shortcuts`
2. 找到 SleepyTube
3. 设置快捷键，例如：
   - `Alt+S`: 切换 Sleep Mode
   - `Alt+V`: 显示可视化器

---

## 🐛 故障排除

### Popup 无法打开
```
解决方案：
1. 刷新扩展：chrome://extensions/ → 刷新图标
2. 重启浏览器
3. 重新安装扩展
```

### 设置不生效
```
检查：
1. 是否在 YouTube 视频页面？
2. 页面是否已加载完成？
3. 控制台是否有错误？
```

### 调整滑块没反应
```
步骤：
1. 拖动滑块
2. 松开鼠标（触发 change 事件）
3. 等待 0.5 秒生效
```

---

## 📝 与旧版对比

### 旧版（右键菜单）:
```
❌ 需要在视频页面右键点击按钮
❌ 浮动面板可能被遮挡
❌ 设置不够直观
❌ 切换页面后消失
```

### 新版（Popup）:
```
✅ 从任意页面访问（点击图标）
✅ 固定在扩展栏，不会被遮挡
✅ 清晰的分组和说明
✅ 设置持久化保存
```

---

## 🎯 总结

新的 Popup 设计让 SleepyTube 的使用更加简单直观：

- ✨ **一键访问**：点击图标即可调整所有设置
- 🎨 **现代界面**：清晰的图标、颜色编码、动画效果
- 🔧 **完整功能**：所有配置集中在一处
- 💾 **自动保存**：更改立即生效并保存
- 📊 **实时反馈**：滑块、开关、按钮即时响应

**建议**：
1. 首次使用时展开高级设置，熟悉所有选项
2. 日常使用时只需调整主开关
3. 根据不同内容类型切换预设
4. 使用可视化器查看处理效果

享受更安心的睡眠听音体验！😴🎵
