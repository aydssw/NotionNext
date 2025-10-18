import fs from 'fs/promises'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'data', 'downloads.json')

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const fileData = await fs.readFile(dataFilePath, 'utf-8')
      const data = JSON.parse(fileData)
      const files = Array.isArray(data.files) ? data.files : []

      // 按上传时间倒序
      files.sort((a, b) => new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0))

      res.status(200).json({ files })
    } catch (error) {
      if (error.code === 'ENOENT') {
        res.status(200).json({ files: [] })
      } else {
        console.error('Failed to read downloads.json:', error)
        res.status(500).json({ error: '无法读取下载列表' })
      }
    }
    return
  }

  res.setHeader('Allow', 'GET')
  res.status(405).json({ error: 'Method not allowed' })
}
