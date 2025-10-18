import fs from 'fs/promises'
import path from 'path'
import { IncomingForm } from 'formidable'

export const config = {
  api: {
    bodyParser: false
  }
}

// 根据文件扩展名获取图标
function getIconByExtension(filename) {
  const ext = path.extname(filename).toLowerCase()
  const iconMap = {
    '.pdf': '📄',
    '.doc': '📝',
    '.docx': '📝',
    '.txt': '📝',
    '.xlsx': '📊',
    '.xls': '📊',
    '.csv': '📊',
    '.pptx': '📽️',
    '.ppt': '📽️',
    '.zip': '📦',
    '.rar': '📦',
    '.7z': '📦',
    '.jpg': '🖼️',
    '.jpeg': '🖼️',
    '.png': '🖼️',
    '.gif': '🖼️',
    '.svg': '🖼️',
    '.mp4': '🎬',
    '.avi': '🎬',
    '.mov': '🎬',
    '.mp3': '🎵',
    '.wav': '🎵',
    '.flac': '🎵'
  }
  return iconMap[ext] || '📁'
}

// 根据文件扩展名获取分类
function getCategoryByExtension(filename) {
  const ext = path.extname(filename).toLowerCase()
  const categoryMap = {
    '.pdf': '文档',
    '.doc': '文档',
    '.docx': '文档',
    '.txt': '文档',
    '.xlsx': '表格',
    '.xls': '表格',
    '.csv': '表格',
    '.pptx': '演示',
    '.ppt': '演示',
    '.zip': '压缩包',
    '.rar': '压缩包',
    '.7z': '压缩包',
    '.jpg': '图片',
    '.jpeg': '图片',
    '.png': '图片',
    '.gif': '图片',
    '.svg': '图片',
    '.mp4': '视频',
    '.avi': '视频',
    '.mov': '视频',
    '.mp3': '音频',
    '.wav': '音频',
    '.flac': '音频'
  }
  return categoryMap[ext] || '其他'
}

// 格式化文件大小
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 清理文件名，移除特殊字符
function sanitizeFilename(filename) {
  // 保留扩展名
  const ext = path.extname(filename)
  const base = path.basename(filename, ext)
  // 移除或替换特殊字符
  const sanitized = base.replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '-')
  return sanitized + ext
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'files')
    const dataPath = path.join(process.cwd(), 'data', 'downloads.json')

    // 确保目录存在
    await fs.mkdir(uploadsDir, { recursive: true })
    await fs.mkdir(path.dirname(dataPath), { recursive: true })

    // 解析表单数据
    const form = new IncomingForm({
      uploadDir: uploadsDir,
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024 // 100MB
    })

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        else resolve([fields, files])
      })
    })

    const uploadedFile = files.file?.[0] || files.file
    if (!uploadedFile) {
      return res.status(400).json({ error: '没有上传文件' })
    }

    // 获取表单字段
    const displayName =
      (fields.displayName?.[0] || fields.displayName || '').trim() ||
      uploadedFile.originalFilename
    const description =
      (fields.description?.[0] || fields.description || '').trim() || '暂无描述'
    const customCategory = (
      fields.category?.[0] ||
      fields.category ||
      ''
    ).trim()
    const customIcon = (fields.icon?.[0] || fields.icon || '').trim()

    // 生成唯一文件名
    const originalName = uploadedFile.originalFilename || 'unknown'
    const sanitized = sanitizeFilename(originalName)
    const timestamp = Date.now()
    const uniqueName = `${timestamp}-${sanitized}`
    const finalPath = path.join(uploadsDir, uniqueName)

    // 移动文件到最终位置
    await fs.rename(uploadedFile.filepath, finalPath)

    // 获取文件大小
    const stats = await fs.stat(finalPath)
    const fileSize = formatFileSize(stats.size)

    // 读取现有数据
    let data = { files: [] }
    try {
      const rawData = await fs.readFile(dataPath, 'utf-8')
      data = JSON.parse(rawData)
    } catch (error) {
      // 文件不存在，使用默认值
    }

    // 计算新ID
    const maxId = data.files.reduce((max, f) => Math.max(max, f.id || 0), 0)
    const newId = maxId + 1

    // 创建新文件记录
    const newFile = {
      id: newId,
      name: displayName,
      description,
      size: fileSize,
      category:
        customCategory || getCategoryByExtension(uploadedFile.originalFilename),
      path: `/files/${uniqueName}`,
      icon: customIcon || getIconByExtension(uploadedFile.originalFilename),
      uploadedAt: new Date().toISOString()
    }

    // 添加到列表
    data.files.push(newFile)

    // 保存更新后的数据
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8')

    // 返回成功响应
    res.status(200).json({
      success: true,
      file: newFile
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({
      error: '上传失败',
      message: error.message
    })
  }
}
