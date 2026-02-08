# GitHub 配置指南

## 问题修复总结

### 1. ✅ Release Workflow 权限问题已修复

**问题**: GitHub Actions 遇到 403 权限错误，无法创建 Release

**解决方案**: 在 `.github/workflows/release.yml` 中添加了明确的权限声明：
```yaml
permissions:
  contents: write
```

### 2. ✅ GitHub Pages Workflow 已创建

**文件**: `.github/workflows/pages.yml`

**功能**: 自动部署 `docs/pages/` 目录到 GitHub Pages

## 需要手动配置的 GitHub 设置

### 步骤 1: 启用 GitHub Pages

1. 访问你的仓库: https://github.com/IRONICBo/SleepyTube
2. 点击 **Settings** (设置)
3. 在左侧菜单找到 **Pages**
4. 在 **Source** 部分选择:
   - Source: **GitHub Actions**
   - ✅ 不要选择 "Deploy from a branch"，而是选择 "GitHub Actions"

### 步骤 2: 配置 GitHub Actions 权限（重要！）

1. 在仓库的 **Settings** 页面
2. 左侧菜单找到 **Actions** → **General**
3. 滚动到 **Workflow permissions** 部分
4. 选择: **Read and write permissions** (读写权限)
5. ✅ 勾选: **Allow GitHub Actions to create and approve pull requests**
6. 点击 **Save** 保存

### 步骤 3: 验证 Release 工作流

现在 Release workflow 应该能正常工作了：

1. 访问 Actions 页面: https://github.com/IRONICBo/SleepyTube/actions
2. 找到 "Release Extension" workflow
3. 点击最新的运行记录（v0.0.1）
4. 检查是否成功创建了 Release

如果仍然失败，可能需要：
- 重新运行 workflow (点击 "Re-run all jobs")
- 或者等待几分钟后检查

### 步骤 4: 验证 GitHub Pages 部署

1. 访问 Actions 页面查看 "Deploy GitHub Pages" workflow
2. 确认部署成功
3. 访问你的 Pages 网站: https://ironicbo.github.io/SleepyTube/

## 当前状态

### ✅ 已完成
- [x] Release workflow 权限配置修复
- [x] GitHub Pages workflow 创建
- [x] Tag v0.0.1 已推送
- [x] 代码已推送到 main 分支

### ⏳ 等待自动化
- [ ] GitHub Actions 自动打包扩展程序
- [ ] 自动创建 GitHub Release
- [ ] 自动部署 GitHub Pages

### 📋 需要手动配置
- [ ] 在 GitHub 仓库设置中启用 Pages (Source: GitHub Actions)
- [ ] 在 GitHub 仓库设置中启用 Actions 读写权限

## 故障排查

### 如果 Release 仍然失败 (403)

检查以下设置：
1. Settings → Actions → General → Workflow permissions = "Read and write permissions"
2. Settings → Actions → General → 勾选 "Allow GitHub Actions to create and approve pull requests"

### 如果 Pages 部署失败

检查以下设置：
1. Settings → Pages → Source = "GitHub Actions" (不是 "Deploy from a branch")
2. 确保 `docs/pages/` 目录包含 `index.html`

## 查看结果

完成配置后，你可以访问：

- **Releases**: https://github.com/IRONICBo/SleepyTube/releases
- **GitHub Pages**: https://ironicbo.github.io/SleepyTube/
- **Actions 运行记录**: https://github.com/IRONICBo/SleepyTube/actions

## 下次发布新版本

只需要执行以下命令：

```bash
# 1. 更新版本号
# 编辑 extension/manifest.json 中的 version 字段

# 2. 提交更改
git add .
git commit -m "chore: bump version to x.x.x"
git push origin main

# 3. 创建并推送 tag
git tag -a vx.x.x -m "Release vx.x.x - Description"
git push origin vx.x.x

# GitHub Actions 会自动：
# - 打包扩展程序
# - 创建 GitHub Release
# - 上传 .zip 文件
```

---

**生成时间**: 2026-02-09  
**版本**: v0.0.1
