import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import Head from 'next/head'

const DownloadsIndex = ({ downloadFiles, fileCategories, siteInfo }) => {
  const allCategories = Object.keys(fileCategories || {})
  const hasFiles = downloadFiles && downloadFiles.length > 0

  const siteName = siteInfo?.title || siteConfig('TITLE') || 'NotionNext'
  const siteDescription =
    siteInfo?.description || siteConfig('DESCRIPTION') || '分享的文件资源列表'

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
                当前还没有可供下载的文件，请稍后再来查看。
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
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {downloadFiles.map(file => (
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
              )}
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

export async function getStaticProps() {
  // 定义可下载文件列表
  // 你可以根据需要修改这个列表，添加更多文件
  const downloadFiles = [
    {
      id: 1,
      name: '示例文档.pdf',
      description: '这是一个示例PDF文档',
      size: '2.5 MB',
      category: '文档',
      path: '/files/sample-document.pdf',
      icon: '📄'
    },
    {
      id: 2,
      name: '项目说明.docx',
      description: '项目详细说明文档',
      size: '1.2 MB',
      category: '文档',
      path: '/files/project-readme.docx',
      icon: '📝'
    },
    {
      id: 3,
      name: '数据报表.xlsx',
      description: 'Excel数据统计报表',
      size: '800 KB',
      category: '表格',
      path: '/files/data-report.xlsx',
      icon: '📊'
    },
    {
      id: 4,
      name: '演示文稿.pptx',
      description: 'PowerPoint演示文稿',
      size: '5.3 MB',
      category: '演示',
      path: '/files/presentation.pptx',
      icon: '📽️'
    },
    {
      id: 5,
      name: '压缩包.zip',
      description: '资源打包文件',
      size: '10.5 MB',
      category: '压缩包',
      path: '/files/resources.zip',
      icon: '📦'
    },
    {
      id: 6,
      name: '图片素材.jpg',
      description: '高清图片素材',
      size: '3.2 MB',
      category: '图片',
      path: '/files/image-asset.jpg',
      icon: '🖼️'
    }
  ]

  // 按类别分组
  const categories = {}
  downloadFiles.forEach(file => {
    if (!categories[file.category]) {
      categories[file.category] = []
    }
    categories[file.category].push(file)
  })

  return {
    props: {
      downloadFiles,
      fileCategories: categories,
      siteInfo: {
        title: siteConfig('TITLE') || 'NotionNext',
        description: siteConfig('DESCRIPTION') || ''
      }
    },
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig('NEXT_REVALIDATE_SECOND', BLOG.NEXT_REVALIDATE_SECOND)
  }
}

export default DownloadsIndex
