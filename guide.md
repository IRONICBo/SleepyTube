4) MDN WebAudio Examples（Web 端音频图谱搭建的最佳学习样板）

mdn/webaudio-examples：约 1.4k stars。

价值：你要做浏览器扩展/网页 MVP，WebAudio 的 compressor/analysis/节点串联，这里是最“少踩坑”的参考集合。

5) Web 端响度/计量工具（给“自适应策略”加眼睛）

domchristie/needles：约 69 stars，浏览器内 LUFS 相关计量。

lcweden/loudness-worklet：约 6 stars，但亮点是强调 BS.1770-5 合规、并支持 true-peak/LRA 等。

这类库不一定 star 很高，但它们能让你 MVP 做出“可解释的睡眠安全指标”（例如：当前 momentary loudness、true-peak 是否触顶、LRA 是否过大），对产品化很加分。

6) 直接可参考的 YouTube 音量类扩展（偏“竞品/实现方式参考”）

Kelvin-Ng/youtube-volume-normalizer：约 20 stars，通过读取 YouTube “content loudness”统计并放大，且用压缩/限制避免 clipping。

NebulaNorm 的思路：明确搭建 video → compressor → analyser → makeup gain → limiter → destination，并提到 limiter 防止 harsh clipping、可选 AGC 缓慢拉齐。

Edge 商店页也强调 compressor + limiter + 可选 auto gain，并提供“场景预设”。

结论：现有扩展大多解决“别忽大忽小”，但你的“睡眠”场景还需要 突发事件抑制（瞬态/笑声/掌声）+ 睡眠 EQ + 轻降速 这套“睡眠安全模式”闭环。

二、相关“明星产品/成熟方案”（你需要知道它们怎么定义“音频一致性”）
1) Auphonic（播客后期自动化的行业明星）

典型能力：一键设定目标参数（integrated loudness、true peak、dialog normalization、MaxLRA 等），比如常见的 -16 LUFS 之类目标，然后自动产出。

动态范围控制：可把输出限制在不同的 loudness range（比如 10 LU / 5 LU）来获得更宽/更窄的动态范围。

它对你最大的启发：

你做“睡眠版 YouTube”，核心不是一个“音量滑杆”，而是一个目标集：

最大 true-peak（防惊醒爆点）

更小的动态范围/LRA（整晚稳定）

可控的语音可懂度（睡前不费脑）

三、把这些调研结果落到你的 MVP：建议的最小可行实现（MVP）

目标：把任意 YouTube 音频变成“更低唤醒、更可预测”的 Sleep-safe audio。

MVP 产品形态（最快上线）

浏览器扩展（Chrome/Edge）

直接在 YouTube 播放页插入一个「睡眠模式」按钮（类似现有扩展把 toggle 放在播放器附近的做法）。

音频链路用 WebAudio，参考 MDN 的节点搭建范式。

MVP 的 P0 功能（必须）

Limiter（硬顶）：任何突发峰值不允许越界（防惊醒）

Compressor（压动态）：把忽大忽小压平

慢速 AGC（可选）：只做“缓慢补偿”，避免出现“呼吸感”

这套组合在扩展里已被反复验证（例如 NebulaNorm 的 compressor + makeup gain + brickwall limiter + 可选 AGC 思路）。

MVP 的 P1 功能（很建议加，能立刻体现“睡眠差异化”）

睡眠 EQ：削高频刺耳、降低背景嘈杂感（主观收益巨大）

轻度降速：0.85x–0.95x（减少信息密度）

Pro/下一阶段（用 FFmpeg、libebur128 打造壁垒）

生成“睡眠版音轨”（离线或云端）：FFmpeg dynaudnorm/loudness 链路做更强的动态控制。

用 libebur128 做 LUFS/LRA 指标闭环：让不同视频都能被拉到同一个“睡眠标准”。