# 下载页面说明

## 页面路径

- 访问地址：`/downloads`
- 文件路径：`pages/downloads/index.js`
- 数据文件：`data/downloads.json`
- 上传接口：`pages/api/downloads/upload.js`
- 列表接口：`pages/api/downloads/index.js`

## 页面结构

这是一个独立的文件下载页面，使用 Tailwind CSS 构建，支持：

- 响应式布局
- 深色模式
- 文件分类分组显示
- 卡片式文件展示
- 页面内文件上传
- 上传成功后自动刷新列表

## 功能说明

1. **文件列表**：
   - 从 `data/downloads.json` 中读取数据
   - 按分类分组展示
   - 显示文件名称、描述、大小、图标
   - 点击按钮即可下载

2. **文件上传**：
   - 点击页面右上角的 “+ 上传文件” 按钮展开上传表单
   - 支持自定义显示名称、描述、分类、图标
   - 上传完成后自动加入文件列表

3. **数据持久化**：
   - 上传的实际文件保存在 `/public/files/` 目录
   - 文件元信息保存在 `/data/downloads.json`

## 自定义与扩展

- 修改页面样式：编辑 `pages/downloads/index.js` 中的 Tailwind 类名
- 调整上传限制：修改 `pages/api/downloads/upload.js` 中的 `maxFileSize`
- 扩展图标/分类逻辑：在上传接口的辅助函数中添加规则
- 添加权限控制：在上传接口中校验用户身份或密钥

## 注意事项

- 默认为所有用户可上传，生产环境建议添加身份验证
- Vercel 无服务器环境为只读，部署时需使用外部对象存储
- 上传文件最大 100MB，可按需调整
- 删除文件需要手动同时删除物理文件与 JSON 中的记录
