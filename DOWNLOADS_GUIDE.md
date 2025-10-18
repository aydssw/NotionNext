# 文件下载页面使用指南

## 概述

已经为你创建了一个文件下载页面，位于 `/downloads` 路径。用户可以通过访问该页面浏览和下载你分享的文件，并且支持直接在页面上传新文件。

## 访问地址

- 本地开发：`http://localhost:3000/downloads`
- 生产环境：`https://你的域名/downloads`

## 功能特性

✅ **页面展示**
- 响应式设计，适配移动端和桌面端
- 支持深色模式
- 文件按类别分组显示
- 文件信息展示（名称、描述、大小、图标）
- 点击下载按钮触发文件下载
- 卡片式布局，悬停动画效果

✅ **文件上传**
- 直接在页面上传文件
- 自定义文件显示名称
- 添加文件描述信息
- 自动或手动设置文件分类
- 自定义文件图标（emoji）
- 自动计算文件大小
- 实时上传进度提示
- 上传后立即显示在列表中

## 如何使用上传功能

### 1. 页面上传（推荐）

1. 访问 `/downloads` 页面
2. 点击右上角的 "**+ 上传文件**" 按钮
3. 在弹出的表单中：
   - **选择文件**：点击选择要上传的文件（必填）
   - **显示名称**：输入文件显示名称（可选，默认使用文件名）
   - **文件描述**：输入文件的简要描述（可选）
   - **分类**：选择或输入文件分类（可选，会自动根据文件类型推荐）
   - **图标**：输入一个 emoji 作为文件图标（可选，会自动根据文件类型推荐）
4. 点击 "**上传**" 按钮
5. 等待上传完成，文件会自动显示在列表顶部

### 2. 手动添加文件（高级）

如果你需要批量添加或手动管理文件：

1. **上传文件到服务器**
   ```bash
   # 将文件复制到 public/files 目录
   cp 你的文件.pdf public/files/
   ```

2. **更新文件列表配置**
   
   编辑 `/data/downloads.json` 文件，在 `files` 数组中添加：
   
   ```json
   {
     "id": 7,
     "name": "你的文件名.pdf",
     "description": "文件描述信息",
     "size": "2.5 MB",
     "category": "文档",
     "path": "/files/你的文件名.pdf",
     "icon": "📄",
     "uploadedAt": "2024-01-01T00:00:00.000Z"
   }
   ```

## 文件分类和图标

### 自动分类

系统会根据文件扩展名自动分配分类：

| 文件类型 | 自动分类 | 默认图标 |
|---------|---------|---------|
| PDF | 文档 | 📄 |
| DOC/DOCX | 文档 | 📝 |
| XLS/XLSX | 表格 | 📊 |
| PPT/PPTX | 演示 | 📽️ |
| ZIP/RAR | 压缩包 | 📦 |
| JPG/PNG | 图片 | 🖼️ |
| MP4/AVI | 视频 | 🎬 |
| MP3/WAV | 音频 | 🎵 |

### 推荐图标 Emoji

- 📄 PDF 文档
- 📝 Word 文档
- 📊 Excel 表格
- 📽️ PowerPoint 演示
- 📦 压缩包
- 🖼️ 图片
- 🎵 音频
- 🎬 视频
- 📁 通用文件
- 📚 电子书
- 💾 安装包
- 🔧 工具

## 技术实现

### 文件存储

- **物理文件**：存储在 `/public/files/` 目录
- **元数据**：存储在 `/data/downloads.json` 文件
- **API 端点**：
  - `GET /api/downloads` - 获取文件列表
  - `POST /api/downloads/upload` - 上传新文件

### 上传流程

1. 用户在页面选择文件并填写信息
2. 前端通过 `FormData` 发送 POST 请求到 `/api/downloads/upload`
3. 服务器使用 `formidable` 解析上传的文件
4. 文件保存到 `/public/files/` 目录（带时间戳前缀避免重名）
5. 更新 `/data/downloads.json` 添加新文件记录
6. 返回新文件信息给前端
7. 前端更新页面显示新文件

### 数据结构

`/data/downloads.json` 结构：

```json
{
  "files": [
    {
      "id": 1,
      "name": "显示名称.pdf",
      "description": "文件描述",
      "size": "2.5 MB",
      "category": "文档",
      "path": "/files/1234567890-filename.pdf",
      "icon": "📄",
      "uploadedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 配置说明

### 文件大小限制

默认最大上传文件大小为 **100MB**。

如需修改，编辑 `/pages/api/downloads/upload.js`：

```javascript
const form = new IncomingForm({
  uploadDir: uploadsDir,
  keepExtensions: true,
  maxFileSize: 100 * 1024 * 1024 // 修改这里的数值（字节）
})
```

### 允许的文件类型

目前支持所有文件类型。如需限制，可在 API 中添加文件类型检查。

## 安全建议

⚠️ **重要安全提示**

1. **访问控制**：建议添加身份验证来保护上传功能
2. **文件验证**：检查上传文件的类型和内容
3. **文件大小**：合理设置文件大小限制
4. **文件名安全**：系统已自动清理文件名中的特殊字符
5. **病毒扫描**：对上传文件进行病毒扫描（可选）
6. **存储配额**：监控存储空间使用情况

### 添加简单的访问控制（可选）

在 `/pages/api/downloads/upload.js` 开头添加：

```javascript
export default async function handler(req, res) {
  // 简单的密钥验证
  const uploadKey = req.headers['x-upload-key']
  if (uploadKey !== process.env.UPLOAD_SECRET_KEY) {
    return res.status(403).json({ error: '无权限' })
  }
  
  // 原有代码...
}
```

然后在前端上传时添加请求头：

```javascript
const response = await fetch('/api/downloads/upload', {
  method: 'POST',
  headers: {
    'x-upload-key': '你的密钥'
  },
  body: formDataToSend
})
```

## 样式定制

页面使用 Tailwind CSS 构建。如需修改样式，编辑 `/pages/downloads/index.js` 中的 className。

主要颜色使用蓝色系（`bg-blue-600`），修改方法：
1. 找到 `bg-blue-600`、`text-blue-600` 等类名
2. 替换为其他颜色，如 `bg-green-600`、`bg-purple-600` 等

## 常见问题

### Q: 上传失败怎么办？

**A:** 检查以下几点：
- 文件大小是否超过限制（默认 100MB）
- `/public/files/` 和 `/data/` 目录是否有写入权限
- 查看浏览器控制台和服务器日志的错误信息

### Q: 如何删除已上传的文件？

**A:** 目前需要手动删除：
1. 从 `/public/files/` 目录删除物理文件
2. 从 `/data/downloads.json` 中删除对应的记录

### Q: 文件在哪里存储？

**A:** 
- 物理文件：`/public/files/` 目录
- 元数据：`/data/downloads.json` 文件

### Q: 支持哪些文件类型？

**A:** 支持所有文件类型。系统会自动识别常见类型并分配合适的图标和分类。

### Q: 如何使用外部 CDN 存储文件？

**A:** 修改上传 API，将文件上传到 CDN，然后在 `downloads.json` 中保存 CDN 的完整 URL。

### Q: 部署到 Vercel 后上传功能无法使用？

**A:** Vercel 的无服务器函数是只读的，无法写入文件系统。建议：
1. 使用外部存储服务（如 AWS S3、Cloudflare R2）
2. 使用数据库存储元数据
3. 考虑使用 Vercel Blob 存储

### Q: 如何备份上传的文件？

**A:** 
1. 定期备份 `/public/files/` 目录
2. 备份 `/data/downloads.json` 文件
3. 建议使用版本控制系统（如 Git）管理配置文件

## 部署注意事项

### Vercel 部署

⚠️ **重要**：Vercel 的无服务器函数是只读的，上传功能需要使用外部存储。

推荐方案：
1. 使用 [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
2. 使用 AWS S3 或 Cloudflare R2
3. 使用其他对象存储服务

### 自托管部署

如果使用 Node.js 服务器自托管，确保：
1. `/public/files/` 目录有写入权限
2. `/data/` 目录有写入权限
3. 设置合适的文件大小限制

## 扩展功能建议

可以考虑添加的功能：

- ✨ 文件删除功能
- ✨ 文件编辑/重命名
- ✨ 批量上传
- ✨ 拖拽上传
- ✨ 上传进度条
- ✨ 文件搜索
- ✨ 文件预览
- ✨ 下载统计
- ✨ 访问权限控制
- ✨ 文件过期时间

## 技术支持

- **框架**: Next.js 14 (Pages Router)
- **样式**: Tailwind CSS
- **上传解析**: formidable
- **渲染方式**: getServerSideProps (SSR)

---

如有问题或需要帮助，请查阅 Next.js 官方文档或提交 Issue。
