import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()

  let title = 'Oops! Terjadi Kesalahan'
  let message = 'Halaman atau sumber daya yang Anda cari tidak dapat diproses saat ini.'
  let statusCode = 500

  if (isRouteErrorResponse(error)) {
    statusCode = error.status
    if (error.status === 404) {
      title = '404 - Halaman Tidak Ditemukan'
      message = 'Maaf, halaman yang Anda tuju tidak ditemukan atau telah dipindahkan.'
    } else if (error.status === 401) {
      title = '401 - Akses Ditolak'
      message = 'Anda harus login terlebih dahulu untuk mengakses halaman ini.'
    } else if (error.status === 403) {
      title = '403 - Dilarang'
      message = 'Anda tidak memiliki hak akses untuk membuka halaman ini.'
    }
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-block p-4 rounded-full bg-stone-800 border border-stone-700">
          <span className="text-4xl font-mono font-bold text-amber-500">{statusCode}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-stone-400 text-sm leading-relaxed">{message}</p>
        <div className="pt-4 flex justify-center gap-4">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-lg bg-stone-100 text-stone-900 font-medium text-sm hover:bg-stone-200 transition-colors"
          >
            Kembali ke Beranda
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-lg bg-stone-800 border border-stone-700 text-stone-200 font-medium text-sm hover:bg-stone-700 transition-colors"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    </div>
  )
}
