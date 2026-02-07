# 🎉 SleepyTube v1.3.0 新功能指南

## ✅ 按照您的要求完成的改进

### 1. **简化的 Popup 界面**

#### 大按钮设计
```
┌────────────────────────────────────┐
│                                    │
│  📊    Sleep Mode                  │
│       Inactive • Click to Enable   │ ← 大按钮
│                                ●   │
│                                    │
└────────────────────────────────────┘
```

**特点**：
- ✅ 一键开启/关闭 Sleep Mode
- ✅ 清晰显示当前状态（Active/Inactive）
- ✅ 大面积点击区域，操作简单
- ✅ 视觉反馈明显（颜色变化 + 指示灯）

#### 折叠面板设计
```
▶ 🎚️ Audio Processing
▶ 🎤 Voice Enhancement  
▶ 🔊 Volume Control
▶ 📊 Waveform Display
```

**点击展开后**：
```
▼ 🎚️ Audio Processing
  Stability Level
  [ Light ] [ Medium ] [ Strong ]
  
  Sound Character
  [ Natural ] [ Gentle ] [ Soft ]
```

---

### 2. **嵌入式迷你波形图**

#### 显示位置
- **位置**：YouTube 视频播放器正下方
- **宽度**：与视频宽度一致
- **高度**：60px（紧凑设计）

#### 视觉效果
```
┌──────────────────────────────────────────┐
│ Before    After                       × │
│ ~~~~~~~~ (红色，上半部分)                │
│ ──────────────────────────────────────── │
│ ~~~~~~~~ (绿色，下半部分)                │
└──────────────────────────────────────────┘
```

**特点**：
- ✅ 实时显示处理前后波形对比
- ✅ 红色 = 处理前（原始音频）
- ✅ 绿色 = 处理后（优化音频）
- ✅ 右上角有关闭按钮（×）
- ✅ **默认开启**（启用 Sleep Mode 时自动显示）

---

## 📖 使用方法

### 第一次使用（3步）

1. **点击扩展图标**
   - 在 Chrome 工具栏找到 SleepyTube 图标 📊
   - 单击打开 Popup

2. **点击大按钮启用**
   - 点击顶部的大按钮
   - 按钮变成蓝色，文字显示"Active"
   - 指示灯变绿色 🟢

3. **查看视频页面**
   - 打开 YouTube 视频
   - 视频下方自动出现迷你波形图
   - 实时显示音频处理效果

---

### 自定义设置

#### 在 Popup 中：

**调整压缩强度**：
```
1. 点击 "Audio Processing" 展开
2. 选择 Stability Level
   - Light: 轻度处理
   - Medium: 推荐（默认）
   - Strong: 最大稳定性
```

**调整声音特性**：
```
1. 在 Audio Processing 面板
2. 选择 Sound Character
   - Natural: 原始音色
   - Gentle: 柔和（默认）
   - Soft: 超柔和
```

**启用人声增强**：
```
1. 点击 "Voice Enhancement" 展开
2. 打开 Voice Focus 开关
3. 调整 Background Reduction 滑块
   - 左边（0 dB）：不降低背景
   - 右边（-12 dB）：大幅降低背景
```

**调整音量**：
```
1. 点击 "Volume Control" 展开
2. Auto Gain 默认开启（推荐）
3. 调整 Output Volume 微调总音量
```

**关闭波形图**：
```
1. 点击 "Waveform Display" 展开
2. 关闭 "Show Mini Waveform" 开关
```

---

## 🎨 新界面特点

### Popup 优势

| 特性 | 说明 |
|------|------|
| 📏 紧凑设计 | 340px 宽度，不占太多空间 |
| 🎯 一键操作 | 大按钮快速开关 |
| 📂 有序组织 | 折叠面板分类清晰 |
| 🎨 视觉反馈 | 颜色、图标、动画 |
| 💾 自动保存 | 所有设置立即生效并保存 |

### 迷你波形图优势

| 特性 | 说明 |
|------|------|
| 📍 嵌入式 | 不遮挡视频内容 |
| 📏 紧凑 | 只有 60px 高，不占空间 |
| 👁️ 直观 | 红绿对比，一眼看出效果 |
| ⚡ 实时 | 60 FPS 流畅更新 |
| ✖️ 可关闭 | 不需要时可隐藏 |
| 🔄 默认开启 | 启用后自动显示 |

---

## 🔧 常见操作

### 快速启用/禁用
1. 点击扩展图标
2. 点击大按钮
3. 完成！

### 查看波形效果
1. 启用 Sleep Mode
2. 播放视频
3. 观察视频下方的波形图
4. 红色（原始）vs 绿色（处理后）

### 临时关闭波形图
1. 点击波形图右上角的 ×
2. 波形图隐藏
3. 再次启用：Popup → Waveform Display → 打开开关

### 调整到你喜欢的设置
1. 打开 Popup
2. 展开各个面板
3. 调整滑块和按钮
4. 设置自动保存，立即生效

---

## 💡 使用技巧

### 场景 1：睡前听播客
```
✓ Sleep Mode: ON
✓ Stability: Strong（最稳定）
✓ Character: Gentle（柔和）
✓ Voice Focus: ON（增强人声）
✓ Background Reduction: -9 dB
✓ Mini Waveform: ON（查看效果）
```

### 场景 2：睡前听音乐
```
✓ Sleep Mode: ON
✓ Stability: Medium（平衡）
✓ Character: Soft（超柔和）
✓ Voice Focus: OFF（保持音乐完整）
✓ Mini Waveform: ON
```

### 场景 3：白天看视频（不睡觉）
```
✗ Sleep Mode: OFF
✗ Mini Waveform: OFF
```

---

## 🐛 故障排除

### 波形图没有显示
**检查**：
1. Sleep Mode 是否已启用？
2. 是否在 YouTube 视频页面？
3. Mini Waveform 开关是否打开？（Popup 最后一个面板）

**解决**：
```javascript
// 在控制台运行（F12）：
window.SleepyTubeController.miniWaveform?.show()
```

### Popup 打不开
**检查**：
1. 扩展是否已加载？（chrome://extensions/）
2. 是否刷新了扩展？

**解决**：
```
1. 访问 chrome://extensions/
2. 找到 SleepyTube
3. 点击刷新图标 🔄
4. 重试
```

### 设置不生效
**检查**：
1. 是否在 YouTube 视频页面？
2. Sleep Mode 是否已启用？

**解决**：
```
1. 刷新 YouTube 页面
2. 重新启用 Sleep Mode
3. 查看控制台是否有错误
```

---

## 📊 版本对比

### v1.2.x（旧版）
- ❌ 复杂的 Popup 界面
- ❌ 需要右键点击视频页面按钮
- ❌ 可视化器占据大面积
- ❌ 设置分散

### v1.3.0（新版）
- ✅ 简洁的大按钮设计
- ✅ 折叠面板组织清晰
- ✅ 嵌入式波形图不遮挡
- ✅ 所有设置集中在 Popup
- ✅ 默认开启波形显示

---

## 🎯 总结

新版 SleepyTube 完全按照您的要求重新设计：

1. ✅ **Popup 有大按钮**
   - 清晰显示当前状态
   - 一键开启/关闭
   
2. ✅ **折叠面板自定义设置**
   - 点击展开查看详细选项
   - 与视频页面的设置一致
   
3. ✅ **视频下方嵌入式波形图**
   - 与视频等宽，60px 高
   - 显示处理前后对比
   - 默认开启，可关闭

现在使用起来更加直观和方便了！🎉

**立即体验**：
1. 刷新扩展（chrome://extensions/ → 刷新）
2. 打开 YouTube 视频
3. 点击 SleepyTube 图标
4. 点击大按钮启用
5. 查看视频下方的波形图

享受更好的睡眠听音体验！😴🎵
