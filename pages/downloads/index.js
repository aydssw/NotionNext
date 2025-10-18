import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import Head from 'next/head'
import { useState, useMemo, useEffect } from 'react'
import fs from 'fs/promises'
import path from 'path'

const DownloadsIndex = ({ initialFiles, siteInfo }) => {
  const [files, setFiles] = useState(initialFiles || [])
  const [uploading, setUploading] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  // 表单状态
  const [formData, setFormData] = useState({
    displayName: '',
    description: '',
    category: '',
    icon: '',
    file: null
  })

  // 按类别分组
  const fileCategories = useMemo(() => {
    const categories = {}
    files.forEach(file => {
      const cat = file.category || '其他'
      if (!categories[cat]) {
        categories[cat] = []
      }
      categories[cat].push(file)
    })
    return categories
  }, [files])

  const allCategories = Object.keys(fileCategories)
  const hasFiles = files.length > 0

  const siteName = siteInfo?.title || siteConfig('TITLE') || 'NotionNext'
  const siteDescription =
    siteInfo?.description || siteConfig('DESCRIPTION') || '分享的文件资源列表'

  // 首次加载时从 API 获取最新数据
  useEffect(() => {
    const fetchLatestFiles = async () => {
      try {
        const response = await fetch('/api/downloads')
        if (!response.ok) return
        const data = await response.json()
        if (Array.isArray(data.files) && data.files.length > 0) {
          setFiles(data.files)
        }
      } catch (error) {
        console.error('Failed to fetch downloads:', error)
      }
    }

    fetchLatestFiles()
  }, [])

  // 处理文件选择
  const handleFileChange = e => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        file,
        displayName: prev.displayName || file.name
      }))
    }
  }

  // 处理表单提交
  const handleSubmit = async e => {
    e.preventDefault()

    if (!formData.file) {
      alert('请选择文件')
      return
    }

    setUploading(true)
    setUploadProgress('正在上传...')

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', formData.file)
      formDataToSend.append('displayName', formData.displayName)
      formDataToSend.append('description', formData.description)
      if (formData.category) {
        formDataToSend.append('category', formData.category)
      }
      if (formData.icon) {
        formDataToSend.append('icon', formData.icon)
      }

      const response = await fetch('/api/downloads/upload', {
        method: 'POST',
        body: formDataToSend
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setUploadProgress('上传成功！')
        // 添加新文件到列表
        setFiles(prev => [result.file, ...prev])
        // 重置表单
        setFormData({
          displayName: '',
          description: '',
          category: '',
          icon: '',
          file: null
        })
        // 重置文件输入
        const fileInput = document.querySelector('input[type="file"]')
        if (fileInput) fileInput.value = ''
        // 关闭表单
        setTimeout(() => {
          setShowUploadForm(false)
          setUploadProgress('')
        }, 2000)
      } else {
        setUploadProgress(`上传失败: ${result.error || '未知错误'}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadProgress(`上传失败: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  // 从现有文件中提取分类选项
  const existingCategories = useMemo(() => {
    const cats = new Set()
    files.forEach(f => {
      if (f.category) cats.add(f.category)
    })
    return Array.from(cats)
  }, [files])

  return (
    <>
      <Head>
        <title>文件下载 - {siteName}</title>
        <meta
          name="description"
          content={`${siteName} 的文件下载中心 - ${siteDescription}`}
        />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-sm font-medium text-blue-800 dark:text-blue-200">
                  下载中心
                </span>
                <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                  文件下载中心
                </h1>
                <p className="mt-2 max-w-2xl text-base text-gray-600 dark:text-gray-400">
                  浏览并下载分享给你的文件资源，点击下载按钮即可获取文件。
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:w-60">
                <button
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
                >
                  {showUploadForm ? '取消上传' : '+ 上传文件'}
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 transition hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  ← 返回首页
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                上传新文件
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    选择文件 *
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    required
                    className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    显示名称
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        displayName: e.target.value
                      }))
                    }
                    placeholder="自动使用文件名"
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    文件描述
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        description: e.target.value
                      }))
                    }
                    placeholder="简要描述这个文件"
                    rows={3}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      分类（可选）
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          category: e.target.value
                        }))
                      }
                      placeholder="自动根据文件类型"
                      list="categories"
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <datalist id="categories">
                      {existingCategories.map(cat => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      图标 Emoji（可选）
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, icon: e.target.value }))
                      }
                      placeholder="如: 📄 📊 🖼️"
                      maxLength={2}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {uploading ? '上传中...' : '上传'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 transition hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    取消
                  </button>
                  {uploadProgress && (
                    <span
                      className={`text-sm ${
                        uploadProgress.includes('成功')
                          ? 'text-green-600 dark:text-green-400'
                          : uploadProgress.includes('失败')
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {uploadProgress}
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          {!hasFiles ? (
            <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-6 py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h2 className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                暂无文件
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                点击上方"上传文件"按钮添加第一个文件。
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {allCategories.length > 0 ? (
                allCategories.map(category => (
                  <section key={category}>
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {category}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          共 {fileCategories[category].length} 个文件
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      {fileCategories[category].map(file => (
                        <article
                          key={file.id}
                          className="group flex cursor-pointer flex-col justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700 text-2xl">
                              {file.icon || '📁'}
                            </div>
                            <div className="flex-1 space-y-1">
                              <h3 className="line-clamp-1 text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                {file.name}
                              </h3>
                              <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                                {file.description}
                              </p>
                            </div>
                          </div>

                          <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {file.size}
                            </div>
                            <a
                              href={file.path}
                              download
                              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                            >
                              下载
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-5 w-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12M12 16.5V3"
                                />
                              </svg>
                            </a>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ))
              ) : null}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mt-12">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  const dataPath = path.join(process.cwd(), 'data', 'downloads.json')
  let files = []

  try {
    const rawData = await fs.readFile(dataPath, 'utf-8')
    const parsed = JSON.parse(rawData)
    files = parsed.files || []
  } catch (error) {
    console.error('Failed to read downloads.json:', error)
    // 使用空数组作为默认值
  }

  // 按上传时间倒序
  files.sort(
    (a, b) =>
      new Date(b.uploadedAt || 0).getTime() -
      new Date(a.uploadedAt || 0).getTime()
  )

  return {
    props: {
      initialFiles: files,
      siteInfo: {
        title: siteConfig('TITLE') || 'NotionNext',
        description: siteConfig('DESCRIPTION') || ''
      }
    }
  }
}

export default DownloadsIndex
