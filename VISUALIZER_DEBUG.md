# 🔧 可视化器手动打开脚本

## 问题诊断

您遇到的情况：
```
可视化器对象存在: false
可视化器是否可见: undefined
```

这表示可视化器对象还没有被创建。

---

## 🚀 立即解决方案

### 步骤 1：完整诊断

在浏览器控制台（F12）粘贴并运行：

```javascript
// ============================================
// SleepyTube 可视化器完整诊断脚本
// ============================================

console.log('🔍 开始诊断...\n');

// 1. 检查核心对象
const ctrl = window.SleepyTubeController;
const ui = ctrl?.uiManager;
const engine = ctrl?.audioEngine;

console.log('步骤 1: 核心对象检查');
console.log('  ✓ Controller:', !!ctrl);
console.log('  ✓ UI Manager:', !!ui);
console.log('  ✓ Audio Engine:', !!engine);
console.log('  ✓ AudioVisualizer 类:', typeof window.AudioVisualizer);

// 2. 检查音频引擎状态
if (engine) {
  console.log('\n步骤 2: 音频引擎状态');
  console.log('  ✓ 已初始化:', engine.isInitialized);
  console.log('  ✓ 已连接:', engine.isConnected);
  console.log('  ✓ 已启用:', engine.isEnabled);
  console.log('  ✓ 有节点:', !!engine.nodes);
} else {
  console.error('  ✗ 音频引擎未初始化！需要先点击 Sleep Mode 按钮');
}

// 3. 检查可视化器
if (ui) {
  console.log('\n步骤 3: 可视化器状态');
  console.log('  ✓ 可视化器对象:', !!ui.visualizer);
  console.log('  ✓ 是否可见:', ui.visualizer?.isVisible);
  
  // 检查 DOM
  const vizDom = document.querySelector('.sleepytube-visualizer');
  console.log('  ✓ DOM 元素:', !!vizDom);
  
  if (vizDom) {
    const styles = getComputedStyle(vizDom);
    console.log('  ✓ Opacity:', styles.opacity);
    console.log('  ✓ Display:', styles.display);
  }
}

// 4. 建议操作
console.log('\n📋 建议操作:');

if (!engine || !engine.isInitialized) {
  console.log('  1️⃣ 先点击 YouTube 播放器的 📊 按钮启用 Sleep Mode');
  console.log('  2️⃣ 等待按钮变成绿色');
  console.log('  3️⃣ 然后运行"手动打开"脚本');
} else if (!ui?.visualizer) {
  console.log('  ➡️ 可以直接运行"手动打开"脚本');
} else {
  console.log('  ✅ 一切正常！可视化器应该已经显示');
}

console.log('\n✅ 诊断完成');
```

---

### 步骤 2：手动创建并打开可视化器

诊断完成后，运行此脚本**强制创建并打开**可视化器：

```javascript
// ============================================
// 手动创建并打开可视化器
// ============================================

console.log('🚀 开始手动打开可视化器...\n');

try {
  const ctrl = window.SleepyTubeController;
  const ui = ctrl?.uiManager;
  const engine = ctrl?.audioEngine;
  
  // 检查前置条件
  if (!ctrl) {
    throw new Error('SleepyTube 控制器未找到！扩展可能未加载');
  }
  
  if (!ui) {
    throw new Error('UI 管理器未找到！');
  }
  
  if (!window.AudioVisualizer) {
    throw new Error('AudioVisualizer 类未加载！检查 visualizer.js 是否正确加载');
  }
  
  // 创建可视化器（如果不存在）
  if (!ui.visualizer) {
    console.log('📦 创建新的可视化器对象...');
    ui.visualizer = new window.AudioVisualizer(engine);
    console.log('✅ 可视化器对象已创建');
  } else {
    console.log('✅ 可视化器对象已存在');
  }
  
  // 显示可视化器
  console.log('👁️ 显示可视化器...');
  ui.visualizer.show();
  
  // 验证
  setTimeout(() => {
    const vizDom = document.querySelector('.sleepytube-visualizer');
    const isVisible = ui.visualizer.isVisible;
    const hasClass = vizDom?.classList.contains('visualizer-visible');
    
    console.log('\n🔍 验证结果:');
    console.log('  ✓ DOM 元素存在:', !!vizDom);
    console.log('  ✓ isVisible 标记:', isVisible);
    console.log('  ✓ CSS 类已添加:', hasClass);
    
    if (vizDom) {
      const styles = getComputedStyle(vizDom);
      console.log('  ✓ Opacity:', styles.opacity);
      console.log('  ✓ Transform:', styles.transform);
      console.log('  ✓ Z-index:', styles.zIndex);
      
      if (styles.opacity === '1') {
        console.log('\n🎉 成功！可视化器应该在屏幕中央显示');
        console.log('   如果看不到，请检查是否被其他元素遮挡');
      } else {
        console.warn('\n⚠️ 可视化器已创建但不可见');
        console.log('   尝试手动设置样式...');
        
        // 强制设置为可见
        vizDom.style.opacity = '1';
        vizDom.style.pointerEvents = 'all';
        vizDom.style.transform = 'translate(-50%, -50%) scale(1)';
        
        console.log('✅ 已强制设置为可见');
      }
    } else {
      console.error('\n❌ DOM 元素未创建！');
      console.log('   尝试手动注入...');
      ui.visualizer.inject();
      ui.visualizer.show();
    }
  }, 500);
  
} catch (error) {
  console.error('❌ 错误:', error.message);
  console.log('\n💡 可能的解决方案:');
  console.log('  1. 刷新页面重试');
  console.log('  2. 重新加载扩展 (chrome://extensions/)');
  console.log('  3. 检查是否在 YouTube 视频页面');
  console.log('  4. 打开开发者工具查看详细错误');
}
```

---

### 步骤 3：如果还是看不到

如果运行上面的脚本后仍然看不到，运行此脚本检查 CSS：

```javascript
// ============================================
// CSS 和样式检查
// ============================================

console.log('🎨 检查 CSS 加载情况...\n');

// 1. 检查样式表是否加载
const allStyleSheets = Array.from(document.styleSheets);
console.log('总样式表数量:', allStyleSheets.length);

// 查找 SleepyTube 的样式表
const sleepytubeSheet = allStyleSheets.find(sheet => {
  try {
    return sheet.href && sheet.href.includes('sleepytube');
  } catch (e) {
    return false;
  }
});

if (sleepytubeSheet) {
  console.log('✅ SleepyTube 样式表已加载');
  console.log('   URL:', sleepytubeSheet.href);
  
  try {
    const rules = Array.from(sleepytubeSheet.cssRules || []);
    console.log('   规则数量:', rules.length);
    
    // 查找可视化器相关规则
    const vizRules = rules.filter(rule => 
      rule.selectorText && rule.selectorText.includes('visualizer')
    );
    
    console.log('   可视化器相关规则:', vizRules.length);
    
    if (vizRules.length > 0) {
      console.log('✅ 可视化器 CSS 已加载');
      console.log('   前 5 条规则:');
      vizRules.slice(0, 5).forEach(rule => {
        console.log('    -', rule.selectorText);
      });
    } else {
      console.error('❌ 未找到可视化器 CSS 规则！');
      console.log('💡 需要重新加载扩展');
    }
  } catch (e) {
    console.warn('⚠️ 无法读取样式规则 (可能是 CORS 限制)');
  }
} else {
  console.error('❌ SleepyTube 样式表未加载！');
  console.log('💡 解决方案:');
  console.log('  1. 检查 manifest.json 中的 content_scripts');
  console.log('  2. 确保 styles.css 在 css 数组中');
  console.log('  3. 重新加载扩展');
}

// 2. 手动检查特定样式
console.log('\n🔍 检查关键 CSS 类是否存在...');

const testDiv = document.createElement('div');
testDiv.className = 'sleepytube-visualizer';
document.body.appendChild(testDiv);

const computed = getComputedStyle(testDiv);
console.log('  position:', computed.position);
console.log('  z-index:', computed.zIndex);
console.log('  opacity:', computed.opacity);

if (computed.position === 'fixed') {
  console.log('✅ 基础样式已应用');
} else {
  console.error('❌ 样式未应用！');
}

testDiv.remove();
```

---

## 🎯 最简单的方法（绕过所有检查）

如果上面的都太复杂，直接运行这个一键脚本：

```javascript
// 一键创建并显示可视化器（暴力版）
(function() {
  const ui = window.SleepyTubeController?.uiManager;
  const engine = window.SleepyTubeController?.audioEngine;
  
  if (!ui) {
    alert('❌ SleepyTube 未加载！请刷新页面');
    return;
  }
  
  if (!window.AudioVisualizer) {
    alert('❌ AudioVisualizer 类未找到！请重新加载扩展');
    return;
  }
  
  // 强制创建
  if (!ui.visualizer) {
    ui.visualizer = new window.AudioVisualizer(engine);
  }
  
  // 强制显示
  ui.visualizer.show();
  
  // 延迟验证
  setTimeout(() => {
    const elem = document.querySelector('.sleepytube-visualizer');
    if (elem && getComputedStyle(elem).opacity === '1') {
      console.log('🎉 成功！请查看屏幕中央');
    } else {
      alert('⚠️ 可视化器已创建，但可能不可见。请检查控制台');
    }
  }, 600);
})();
```

---

## 📋 操作顺序总结

1. **刷新扩展**（重要！）
   ```
   chrome://extensions/ → 找到 SleepyTube → 点击刷新 🔄
   ```

2. **打开 YouTube 视频**
   ```
   任意视频都可以
   ```

3. **运行诊断脚本**
   ```
   F12 → Console → 粘贴第一个脚本
   ```

4. **查看诊断结果**
   ```
   如果提示需要启用 Sleep Mode → 点击 📊 按钮
   ```

5. **运行手动打开脚本**
   ```
   粘贴第二个脚本 → 等待 0.5 秒
   ```

6. **检查屏幕中央**
   ```
   应该看到深色面板和波形图
   ```

---

## 💡 温馨提示

- 确保在 **YouTube 视频页面**运行脚本
- 确保扩展已经 **重新加载**（最新代码）
- 第一次可能需要点击 Sleep Mode 按钮
- 如果完全看不到，可能是 CSS 文件未加载

需要我帮你进一步调试吗？请运行诊断脚本并告诉我输出结果！ 🔍
