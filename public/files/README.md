# 文件下载目录

这个目录用于存放可供用户下载的文件。

## 如何添加文件

1. 将你的文件放在 `/public/files/` 目录下
2. 在 `/pages/downloads/index.js` 文件中的 `downloadFiles` 数组中添加相应的文件信息

## 示例配置

```javascript
{
  id: 1,
  name: '你的文件名.pdf',
  description: '文件描述',
  size: '2.5 MB',
  category: '文档',
  path: '/files/你的文件名.pdf',
  icon: '📄'
}
```

## 支持的文件类型

- 文档：PDF、DOCX、TXT 等
- 表格：XLSX、CSV 等
- 演示：PPTX 等
- 压缩包：ZIP、RAR 等
- 图片：JPG、PNG、SVG 等
- 其他：任何其他类型的文件

## 注意事项

- 确保文件大小适中，避免影响加载速度
- 文件名中不要使用特殊字符
- 定期清理不再需要的文件
- 建议对大文件使用外部存储服务（如 CDN）

## 访问页面

文件下载页面的访问地址是：`/downloads`
