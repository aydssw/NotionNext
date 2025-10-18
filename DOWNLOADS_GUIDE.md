# 文件下载页面使用指南

## 概述

已经为你创建了一个文件下载页面，位于 `/downloads` 路径。用户可以通过访问该页面浏览和下载你分享的文件。

## 访问地址

本地开发：`http://localhost:3000/downloads`
生产环境：`https://你的域名/downloads`

## 功能特性

✅ 响应式设计，适配移动端和桌面端
✅ 支持深色模式
✅ 文件按类别分组显示
✅ 文件信息展示（名称、描述、大小、图标）
✅ 点击下载按钮触发文件下载
✅ 卡片式布局，悬停动画效果

## 如何添加/修改文件

### 1. 添加实际文件

将要提供下载的文件放入 `/public/files/` 目录：

```bash
cp 你的文件.pdf public/files/
```

### 2. 更新文件列表配置

编辑 `/pages/downloads/index.js` 文件，在 `downloadFiles` 数组中添加文件信息：

```javascript
const downloadFiles = [
  {
    id: 1,                              // 唯一ID
    name: '你的文件名.pdf',              // 显示的文件名
    description: '文件描述信息',         // 文件简介
    size: '2.5 MB',                     // 文件大小
    category: '文档',                   // 文件分类
    path: '/files/你的文件名.pdf',       // 文件路径（相对于public目录）
    icon: '📄'                          // 显示的图标（emoji）
  },
  // 添加更多文件...
]
```

### 3. 推荐的图标 emoji

- 📄 PDF 文档
- 📝 Word 文档
- 📊 Excel 表格
- 📽️ PowerPoint 演示
- 📦 压缩包
- 🖼️ 图片
- 🎵 音频
- 🎬 视频
- 📁 通用文件

## 文件分类

文件会自动按照 `category` 字段进行分组显示。你可以使用任何分类名称，例如：

- 文档
- 表格
- 演示
- 压缩包
- 图片
- 视频
- 音频
- 其他

## 样式定制

页面使用 Tailwind CSS 构建，如需修改样式，请编辑：
- `/pages/downloads/index.js` 中的 className

主要颜色使用蓝色系（`bg-blue-600`），如需更改：
1. 找到 `bg-blue-600` 和 `text-blue-600` 等类名
2. 替换为其他颜色，如 `bg-green-600`、`bg-purple-600` 等

## 注意事项

⚠️ **文件大小限制**
- Vercel 等平台对静态文件有大小限制（通常为 50MB）
- 对于大文件，建议使用外部 CDN 或对象存储服务

⚠️ **路径配置**
- 文件路径必须相对于 `public` 目录
- 例如：`public/files/demo.pdf` 对应路径为 `/files/demo.pdf`

⚠️ **文件安全**
- 确保不要上传敏感信息
- 所有 `public` 目录下的文件都可以被公开访问

## 示例

已经为你创建了 6 个示例文件配置：
1. 示例文档.pdf
2. 项目说明.docx
3. 数据报表.xlsx
4. 演示文稿.pptx
5. 压缩包.zip
6. 图片素材.jpg

你可以替换这些示例配置为你自己的实际文件。

## 集成到导航菜单

如果你想在网站导航中添加"下载"链接，需要根据你使用的主题进行配置。通常可以在主题的菜单配置中添加：

```javascript
{
  name: '下载',
  to: '/downloads',
  show: true
}
```

具体配置方式请参考你当前使用的主题文档。

## 技术实现

- **框架**: Next.js 14 (Pages Router)
- **样式**: Tailwind CSS
- **静态生成**: getStaticProps (SSG)
- **下载方式**: HTML5 download 属性

## 疑难解答

**Q: 文件无法下载？**
A: 确保文件已正确放置在 `public/files/` 目录，并且路径配置正确。

**Q: 如何使用外部链接？**
A: 将 `path` 字段改为完整的外部 URL，如 `https://example.com/file.pdf`

**Q: 如何隐藏某个文件？**
A: 从 `downloadFiles` 数组中移除对应的配置项即可。

**Q: 如何更改页面标题？**
A: 编辑 `/pages/downloads/index.js` 中的 `<Head>` 标签内容。

## 更新日志

- 初始版本：创建文件下载页面
- 支持分类显示
- 支持深色模式
- 响应式设计

---

如有问题或需要帮助，请查阅 Next.js 官方文档或提交 Issue。
