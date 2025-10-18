# 下载页面说明

## 页面路径

- 访问地址：`/downloads`
- 文件路径：`pages/downloads/index.js`

## 页面结构

这是一个独立的文件下载页面，使用 Tailwind CSS 构建，支持：

- 响应式布局
- 深色模式
- 文件分类显示
- 悬停动画效果

## 自定义文件列表

编辑 `pages/downloads/index.js` 中的 `getStaticProps` 函数内的 `downloadFiles` 数组：

```javascript
const downloadFiles = [
  {
    id: 1,
    name: '文件名',
    description: '文件描述',
    size: '文件大小',
    category: '文件分类',
    path: '/files/文件名',
    icon: '📄' // emoji 图标
  }
]
```

## 添加实际文件

将文件放入 `/public/files/` 目录即可。

## 注意事项

- 文件路径要与配置中的 `path` 对应
- 文件分类会自动分组显示
- 支持任何文件类型
