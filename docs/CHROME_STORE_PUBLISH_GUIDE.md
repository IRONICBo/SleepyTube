# Chrome 扩展发布指南

## 📦 SleepyTube Chrome Web Store 发布完整流程

**目标**: 将 SleepyTube 扩展上架到 Chrome Web Store，让用户一键安装。

**版本**: v1.3.0  
**预计发布时间**: 2026-03-01  
**审核周期**: 1-3 个工作日

---

## 目录
1. [发布前准备](#1-发布前准备)
2. [创建开发者账号](#2-创建开发者账号)
3. [准备扩展资源](#3-准备扩展资源)
4. [填写商店信息](#4-填写商店信息)
5. [提交审核](#5-提交审核)
6. [审核通过后](#6-审核通过后)
7. [常见审核问题](#7-常见审核问题)
8. [发布后运营](#8-发布后运营)

---

## 1. 发布前准备

### 1.1 必需材料清单

#### ✅ 技术文件

| 文件/项目 | 要求 | 状态 | 备注 |
|----------|------|------|------|
| **manifest.json** | V3 格式 | ✅ 已完成 | 确保所有权限声明清晰 |
| **图标集** | 16x16, 32x32, 48x48, 128x128 | ✅ 已完成 | PNG 格式，透明背景 |
| **隐私政策** | 独立页面URL | ⚠️ 待创建 | 必须托管在公开网址 |
| **用户协议** | 可选 | ⚠️ 待创建 | 推荐提供 |
| **源代码** | ZIP 打包 | ✅ 可打包 | 不包含 node_modules |

#### ✅ 营销材料

| 材料类型 | 尺寸要求 | 数量 | 状态 | 备注 |
|---------|---------|------|------|------|
| **小图标** | 128x128px | 1张 | ✅ 已有 | icon-128.png |
| **宣传图** | 1400x560px | 1张 | 📸 待制作 | 突出核心功能 |
| **截图** | 1280x800px 或 640x400px | 3-5张 | 📸 待制作 | 展示主要界面 |
| **宣传视频** | YouTube链接 | 可选 | ❌ 暂无 | 可后续补充 |

---

### 1.2 检查清单

#### 功能完整性
- [ ] 所有核心功能正常运行
- [ ] 无明显 Bug
- [ ] 性能优化完成 (CPU < 5%, 内存 < 50MB)
- [ ] 兼容最新版 Chrome
- [ ] 测试多种视频场景 (ASMR, 播客, 电影等)

#### 用户体验
- [ ] Onboarding 流程流畅
- [ ] UI/UX 符合 Material Design 规范
- [ ] 支持国际化 (至少英文 + 中文)
- [ ] 错误处理完善，有友好提示
- [ ] 快捷键无冲突

#### 安全与隐私
- [ ] 不收集用户数据
- [ ] AI API Key 本地存储
- [ ] 无外部请求（除AI API）
- [ ] manifest权限最小化
- [ ] 代码无混淆（便于审核）

#### 法务合规
- [ ] 隐私政策页面已创建
- [ ] 用户协议已创建（可选）
- [ ] 不侵犯 YouTube 商标权
- [ ] 不误导用户（如声称"官方"）

---

## 2. 创建开发者账号

### 2.1 注册流程

#### Step 1: 访问开发者控制台

**URL**: https://chrome.google.com/webstore/devconsole

**要求**:
- 拥有 Google 账号
- 年满 18 岁
- 同意开发者协议

**截图标注**:
```
[📸 截图24: Chrome 开发者控制台首页]
└─ 标注: "Get started" 或 "Sign in" 按钮
```

---

#### Step 2: 支付注册费

**费用**: $5 美元（一次性）

**支付方式**:
- 信用卡 (Visa, Mastercard, Amex)
- 借记卡

**注意事项**:
- 费用不可退
- 仅首次注册需支付
- 发布多个扩展无需额外费用

**截图标注**:
```
[📸 截图25: 支付注册费页面]
├─ 标注1: 费用说明 "$5.00 USD"
└─ 标注2: 支付按钮
```

---

#### Step 3: 填写开发者信息

**必填字段**:
- **开发者名称**: SleepyTube Team（或你的名字）
- **电子邮件**: 公开显示的联系邮箱
- **网站** (可选): https://sleepytube.github.io
- **验证身份**: 提供政府ID（部分地区要求）

**建议**:
- 使用专业邮箱（避免个人邮箱）
- 网站使用 GitHub Pages 即可

**截图标注**:
```
[📸 截图26: 开发者信息填写]
├─ 标注1: 开发者名称输入框
├─ 标注2: 电子邮件输入框
└─ 标注3: 网站URL输入框
```

---

### 2.2 账号验证

**验证方式** (二选一):
1. 邮箱验证: Google 发送确认链接
2. 身份验证: 上传身份证/护照（部分地区）

**验证时长**: 1-2 个工作日

---

## 3. 准备扩展资源

### 3.1 打包扩展文件

#### 创建发布版本

**步骤**:
```bash
# 1. 进入项目目录
cd /path/to/SleepyTube

# 2. 清理临时文件
rm -rf extension/.DS_Store
rm -rf extension/node_modules

# 3. 创建 ZIP 包
cd extension
zip -r ../sleepytube-v1.3.0.zip * -x "*.git*" -x "*.DS_Store"

# 4. 验证 ZIP 内容
unzip -l ../sleepytube-v1.3.0.zip
```

**必须包含的文件**:
```
sleepytube-v1.3.0.zip
├── manifest.json           ← 必需
├── icons/
│   ├── icon-16.png
│   ├── icon-32.png
│   ├── icon-48.png
│   └── icon-128.png        ← 必需
├── content/
│   ├── main.js
│   ├── audio-engine.js
│   ├── ui-manager.js
│   ├── video-predictor.js
│   └── ...
├── popup/
│   ├── popup.html
│   ├── popup.js
│   ├── popup.css
│   └── ...
├── onboarding/
│   ├── onboarding.html
│   ├── onboarding.js
│   ├── onboarding.css
│   └── i18n.js
└── README.md               ← 推荐
```

**不应包含**:
- ❌ node_modules/
- ❌ .git/
- ❌ .DS_Store
- ❌ *.log
- ❌ 测试文件

---

### 3.2 准备截图素材

#### 截图要求

| 类型 | 尺寸 | 格式 | 数量 | 用途 |
|------|------|------|------|------|
| **主截图** | 1280x800px | PNG/JPG | 必需 | 首屏展示 |
| **附加截图** | 1280x800px | PNG/JPG | 2-4张 | 功能展示 |
| **宣传图** | 1400x560px | PNG/JPG | 1张 | 搜索结果缩略图 |

#### 推荐截图内容

**截图 1: Onboarding 场景选择**
```
[📸 截图27: Onboarding - Scene Selection]
内容: 显示3个场景卡片 (Sleep/Podcast/Movie)
重点标注:
├─ 精美的渐变图标
├─ 清晰的场景说明
└─ 简洁的UI设计
```

**截图 2: Popup 面板 - 实时波形**
```
[📸 截图28: Popup - Live Waveform]
内容: 显示波形和场景切换
重点标注:
├─ Before/After 波形对比
├─ 场景标签高亮
└─ 当前设置预览
```

**截图 3: YouTube 播放器 - Player 按钮**
```
[📸 截图29: YouTube Player Button]
内容: 视频播放器内的 SleepyTube 按钮
重点标注:
├─ 按钮位置（音量右侧）
├─ 启用状态（金色）
└─ 与 YouTube UI 融合
```

**截图 4: 高级设置面板**
```
[📸 截图30: Advanced Settings]
内容: 展开的高级设置界面
重点标注:
├─ 折叠式设计
├─ 参数滑块
└─ AI 状态指示器
```

**截图 5: AI 徽章显示**
```
[📸 截图31: AI Predictor Badges]
内容: YouTube 首页视频徽章
重点标注:
├─ 绿色 "✓ 音质良好" 徽章
├─ 橙色 "⚠ X个问题" 徽章
└─ Tooltip 详情
```

#### 制作建议
- 使用高分辨率显示器截图（2x Retina）
- 添加适当的标注和箭头
- 保持UI语言一致（建议英文）
- 使用浅色主题（更清晰）
- 文字可读性强

---

### 3.3 准备宣传图

#### 设计规范

**尺寸**: 1400x560px  
**格式**: PNG 或 JPG  
**文件大小**: < 1MB

**设计元素**:
```
┌─────────────────────────────────────────┐
│                                         │
│  [Logo]  SleepyTube                     │
│                                         │
│  Transform YouTube into a               │
│  Sleep-Safe Audio Experience            │
│                                         │
│  ✓ Volume Stabilization                │
│  ✓ AI Quality Prediction                │
│  ✓ Zero Latency                         │
│                                         │
│  [Before/After Waveform 示意图]         │
│                                         │
└─────────────────────────────────────────┘
```

**颜色方案**:
- 主色: #F5A524 (金色)
- 背景: #1A1A1A (深色) 或 #FFFFFF (浅色)
- 文字: 高对比度

**工具推荐**:
- Figma (在线设计)
- Canva (模板丰富)
- Photoshop (专业)

---

### 3.4 撰写隐私政策

#### 必需内容

**隐私政策模板**: (保存为 `docs/PRIVACY_POLICY.md`)

```markdown
# SleepyTube 隐私政策

最后更新: 2026-02-08

## 数据收集

SleepyTube **不收集**任何用户数据。

### 我们不收集:
- ❌ 个人身份信息
- ❌ 观看历史
- ❌ 浏览记录
- ❌ IP 地址
- ❌ Cookie

## 数据存储

### 本地存储 (Chrome Storage API)
- 用户配置（场景、参数设置）
- AI API Key (加密存储在用户浏览器本地)
- AI 预测缓存 (24小时自动清除)

**存储位置**: 浏览器本地存储，不上传到任何服务器。

## 第三方服务

### AI 视频预测 (可选功能)
当用户启用 AI 预测功能时:
- 发送数据: 视频标题、频道名称、视长（非个人信息）
- 接收方: Google Gemini API 或 OpenAI API
- 用途: 预测视频音频质量
- 用户控制: 可随时禁用功能并删除 API Key

**重要**: 用户自备 API Key，SleepyTube 不存储或传输 API Key 到我们的服务器。

## 权限说明

### 必需权限:
- `storage`: 保存用户配置
- `activeTab`: 访问当前 YouTube 标签页
- `scripting`: 注入音频处理代码

### 可选权限:
- 无

## 用户权利

用户可随时:
- 清除所有本地存储数据
- 卸载扩展
- 禁用 AI 功能

## 联系我们

如有隐私相关问题:
- Email: privacy@sleepytube.com
- GitHub: https://github.com/sleepytube/sleepytube/issues

## 政策更新

我们可能会更新本隐私政策。更新后会在扩展中通知用户。

---

© 2026 SleepyTube Team. All rights reserved.
```

#### 托管隐私政策

**方式1: GitHub Pages** (推荐)
```bash
# 1. 创建 docs/pages/privacy.html
# 2. 启用 GitHub Pages
# 3. URL: https://sleepytube.github.io/privacy.html
```

**方式2: Google Sites**
```
1. 访问 https://sites.google.com
2. 创建新站点
3. 粘贴隐私政策内容
4. 发布并复制 URL
```

**方式3: 独立域名**
```
如果有独立域名(如 sleepytube.com):
https://sleepytube.com/privacy
```

---

## 4. 填写商店信息

### 4.1 创建新Item

**步骤**:
1. 登录开发者控制台
2. 点击 "New Item" 按钮
3. 上传 ZIP 文件 (`sleepytube-v1.3.0.zip`)
4. 等待上传完成（自动解析 manifest.json）

**截图标注**:
```
[📸 截图32: 创建新Item]
├─ 标注1: "New Item" 按钮
├─ 标注2: 上传 ZIP 文件区域
└─ 标注3: 上传进度条
```

---

### 4.2 填写商店详情

#### 基本信息

| 字段 | 内容 | 要求 |
|------|------|------|
| **产品名称** | SleepyTube | 45字符以内 |
| **简短描述** | Transform YouTube into a sleep-safe audio experience with intelligent volume control and AI prediction | 132字符以内 |
| **详细描述** | (见下方) | 16,000字符以内 |
| **类别** | Productivity（或 Entertainment） | 单选 |
| **语言** | English (主要) + 中文 (额外) | 多选 |

#### 详细描述模板

```markdown
# SleepyTube - Sleep-Safe YouTube Audio

Transform YouTube into a sleep-safe audio experience. No more sudden volume spikes or jarring sounds that wake you up!

## 🌙 Core Features

### Volume Stabilization
- **Smart Compression**: Automatically smooths volume differences
- **Brickwall Limiter**: Hard cap on maximum volume
- **Auto Gain Control**: Consistent loudness (-18 LUFS)

### Sleep EQ
- **Frequency Optimization**: Reduces harsh high frequencies and rumbling bass
- **Gentle Sound Processing**: Makes any video gentle enough for sleep

### AI Video Predictor 🤖 NEW!
- **Pre-Watch Analysis**: Predict audio quality before watching
- **Quality Badges**: Visual indicators on video thumbnails
- **Issue Detection**: Identifies sudden sounds, fast speech, volume changes
- **Free & Paid Options**: Gemini AI (free) or OpenAI (premium)

### Voice Focus Mode
- **Speech Enhancement**: Enhances speech clarity
- **Background Ducking**: Lowers music during speech

## 🎬 Scene Presets

Choose from 4 optimized presets:

1. **Sleep Mode** 😴
   - Ultra-gentle, strong compression
   - Perfect for ASMR, white noise

2. **Podcast Mode** 🎤
   - Voice clarity focused
   - Background noise reduction

3. **Movie Mode** 🎬
   - Balanced experience
   - Preserves dynamic range

4. **Custom Mode** ⚙️
   - Manual control over all parameters

## ✨ Key Highlights

✅ **Zero Latency**: Real-time processing using Web Audio API  
✅ **100% Private**: All processing happens locally  
✅ **Free Forever**: No subscriptions, no ads  
✅ **Open Source**: Fully auditable code  
✅ **Easy to Use**: One-click activation  

## 🚀 How It Works

1. Install the extension
2. Open any YouTube video
3. Click the SleepyTube button in the player
4. Enjoy smooth, sleep-safe audio!

## 🤖 AI Predictor Setup (Optional)

1. Open extension popup → Settings
2. Enable "AI Video Prediction"
3. Choose provider (Gemini = Free, OpenAI = Paid)
4. Enter your API key
5. Badges will appear on video thumbnails!

Get free Gemini API key: https://makersuite.google.com/app/apikey

## 🔒 Privacy

- No data collection
- No tracking
- All processing is local
- AI features only send video metadata (title, channel, duration)

## 📞 Support

- GitHub: https://github.com/sleepytube/sleepytube
- Issues: https://github.com/sleepytube/sleepytube/issues
- Discussions: https://github.com/sleepytube/sleepytube/discussions

---

**Not affiliated with YouTube or Google.**  
**Open source under MIT License.**
```

---

### 4.3 上传图片资源

#### 上传清单

| 图片类型 | 尺寸 | 必需/可选 | 数量 |
|---------|------|-----------|------|
| 商店图标 | 128x128px | ✅ 必需 | 1张 |
| 截图 | 1280x800px | ✅ 必需 | 至少1张 |
| 宣传图 | 1400x560px | ✅ 必需 | 1张 |
| 宣传视频 | YouTube URL | ⚠️ 可选 | 0-1个 |

**截图标注**:
```
[📸 截图33: 上传图片资源界面]
├─ 标注1: 商店图标上传区
├─ 标注2: 截图上传区（可拖拽排序）
└─ 标注3: 宣传图上传区
```

---

### 4.4 配置权限说明

#### 必填字段

**单用途描述** (Single Purpose):
```
SleepyTube is an audio processing tool that stabilizes YouTube video volume and predicts audio quality using AI.
```

**权限理由** (Permission Justifications):

| 权限 | 理由 |
|------|------|
| `storage` | Store user preferences (scene settings, AI API keys) locally |
| `activeTab` | Access YouTube video element to apply audio processing |
| `scripting` | Inject audio processing code into YouTube pages |

**远程代码** (Remote Code):
```
不使用，选择 "No"
```

**截图标注**:
```
[📸 截图34: 权限配置界面]
├─ 标注1: Single Purpose 输入框
├─ 标注2: Permission Justifications 列表
└─ 标注3: Remote Code 单选框 (选择 No)
```

---

### 4.5 设置隐私实践

#### 数据使用声明

**是否收集用户数据?**: 否

**数据处理方式**:
```
选项:
☑ Data is NOT collected
☐ Data is collected but NOT sold
☐ Data is used for limited purposes
```

**隐私政策 URL**:
```
https://sleepytube.github.io/privacy.html
(或你托管的 URL)
```

**截图标注**:
```
[📸 截图35: 隐私实践配置]
├─ 标注1: 数据收集声明选择
└─ 标注2: 隐私政策 URL 输入框
```

---

## 5. 提交审核

### 5.1 最终检查

**提交前确认**:
- [ ] manifest.json 版本号正确
- [ ] 所有截图已上传
- [ ] 隐私政策 URL 可访问
- [ ] 描述无拼写错误
- [ ] 权限理由已填写
- [ ] 分类正确

---

### 5.2 提交步骤

**步骤**:
1. 点击页面底部 "Save draft" 保存草稿
2. 点击右上角 "Submit for review"
3. 阅读并同意开发者协议
4. 确认提交

**截图标注**:
```
[📸 截图36: 提交审核按钮]
├─ 标注1: "Save draft" 按钮
└─ 标注2: "Submit for review" 按钮
```

---

### 5.3 审核时长

**预计时间**:
- 首次提交: 1-3 个工作日
- 更新提交: 几小时到 1 天

**审核状态**:
- ⏳ Pending review (审核中)
- ✅ Published (已发布)
- ❌ Rejected (被拒绝)
- ⚠️ Needs clarification (需说明)

---

## 6. 审核通过后

### 6.1 发布设置

**可见性选项**:
- **Public**: 所有人可见（推荐）
- **Unlisted**: 仅通过链接访问
- **Private**: 仅指定用户

**建议**: 选择 Public

---

### 6.2 发布到特定地区

**地区限制** (可选):
- 全球发布: 选择 "All countries"
- 特定地区: 选择国家列表

**建议**: All countries (最大化用户覆盖)

---

### 6.3 获取商店链接

**扩展 URL 格式**:
```
https://chrome.google.com/webstore/detail/[extension-id]
```

**示例**:
```
https://chrome.google.com/webstore/detail/sleepytube/abcdefghijklmnopqrstuvwxyz
```

**分享链接**:
1. 复制 URL
2. 添加到 GitHub README
3. 添加到官网\n---

## 7. 常见审核问题

### 7.1 被拒绝的常见原因

| 原| 解决方案 |
|------|------|---------|
| **权限过度** | 请求的权限超过功能需要 | 移除不必要的权限 |
| **隐私政策缺失** | 未提供隐私政 | 创建并托管隐私政策 |
| **描述误导** | 描述与实际功能不符 | 修改描述，确保准确 |
| **侵犯商标** | 名称/图标侵犯他人商标 | 更换名称或图标 |
| **代码混淆** | 代码不可读，难以审核 | 提供n| **恶意行为** | 检测到恶意代码 | 移除可疑代码，解释功能 |
| **功能缺失** | 扩展无法正常工作 | 修复 Bug，重新测试 |

---

### 7.2 申诉流程

**如果被拒绝**:
1. 阅的详细原因
2. 根据反馈修改扩展
3. 重新上传 ZIP 文件
4. 在备注中说明修改内容
5. 再次提交审核

**备注示例**:
```
修改内容:
1. 移除了 "tabs" 权限，改用 "activeTab"
2. 添加了隐私政策链接: https://sleepytube.github.io/privacy
3. 更新了权限说明，详细解释每个权限的用途
4. 修复了 Onboarding 页面的 Bug

请重新审核，谢谢!
```

---
 8. 发布后运营

### 8.1 更新扩展

**更新流程**:
```
1. 修改代码并测试
2. 更新 manifest.json 版本号
   (如 1.3.0 → 1.3.1)
3. 重新打包 ZIP
4. 上传到开发者控制台
5. 填写更新日志 (Changelog)
6. 提交审核
```

**更新日志示例**:
```
Version 1.3.1 (2026-03-15)
--------------------nFixed:
- AI Predictor badge not显示 on some video cards
- Popup panel flickering issue

Improved:
- Reduced CPU usage by 20%
- Optimized waveform rendering

New:
- Added Spanish language support
```

---

### 8.2 用户反馈管理

****商店评论**: 定期回复用户评论
2. **GitHub Issues**: 处理 Bug 报告
3. **Email**: 回复用户咨询

**回复模板**:
```
感谢反馈！
我们已经修复了这个问题，将在下一个版本 (v1.3.2) 中发布。026-03-20

如需立即使用，可以从 GitHub 下载开发版：
https://github.com/sleepytube/sleepytube

再epyTube Team
```

---

### 8.3 推广策略

**免费推广**:
1tHub README 添加商店徽章
2. 在 ProductHunt 发布
3. 在 Reddit (r/xtensions) 分享
4. 在 Twitter/X 发推
5. 在相关论坛 (如 ASMR 社区) 分享

**付费推广** (可选):
1. Google Ads (针对关键词 "youtube sleep", "asm
2. Reddit Ads
3. YouTube 视频广告

---

### 8.4 数据分析\n- **安装量**: 每周安装数
- **活跃用户**: DAU (日活) / WAU (周活评分**: 目标 4.5+ 星
- **崩溃率**: 目标 < 0.1%
- **卸载率**: 越低越好

**工具**:
- Chrome Web Store 内置分析
- Google Analytics (可选，在官网集成)

---

## 9. 附录

### 9.1 检查清单总表

**发布前**:
- [ ] manifest.json 版本正确
- [ ] 所有功能测试通过
- [ ] 隐私政策已托管
- [ ] 截n- [ ] 宣传图已设计
- [ ] 开发者账号已注册
- [ ] 注册费已支付

**提交时**:
- [ ] ZIP 文件正确打包
- [ ] 商店描述已填写
- [ ] 权限理由已说明
- [ ] 图片资源已上传
- [ 置
- [ ] 最终检查无误

**发布后**:
- [ ] 商店链接已分享
- [ ] GitHub README 已更新
- [ ] 用户反馈渠道已建立
- [ ] 定期检查评论和 Issues

---

### 9.2 有用的资源

**官方文档**:
- Chrome Web Store 开发者文档: https://developer.chrome.com/docs/webstore/
- Manifest V3 迁移指南: httpdeveloper.chrome.com/docs/extensions/mv3/intro/
- 权限说明: https://developer.chrome.com/docs/extensions/mv3/declare_permis社区资源**:
- r/chrome_extensions (Reddit)
- Stack Overflow (tag: google-chrome-extension)
- Chrome Extensions Google Group
n### 9.3 常见问题 FAQ

**Q1: 审核需要多久？**
A: 首次 1-3 天，更新几小时到 1n
**Q2: 可以申诉审核结果吗？**
A: 可以，在开发者控制台回复审核邮件。

**Q3: 如何提升安装量？**
A: 优化商店描述、截分，社交媒体推广。

**Q4: 可以修改已发布的扩展名称吗？**
A: 可以，但会失去之前的评分和评论。

**Q5: 隐私政策必须提供吗？**
A: 是的，所有扩展都必须提供隐私政策 URL。

-
## 10. 结语

遵循本指南，你将能够顺利地将 SleepyTube 发布到 Chrome Web Store。

**记- 用户体验第一
- 持续迭代优化
- 积极回应反馈
- 保持透明诚信

祝发布顺利！🎉\n**文档版本**: v1.0  
**维护者**: SleepyTube Team  
**最后更新**: 2026-02-08

如有疑问，欢迎在 GitHub Discussions 提问！
