/**
 * Error Handler Utility
 * Konsisten menangani error dari API
 */

/**
 * Extract error message dari berbagai format error
 * @param {Error} err - Error object
 * @returns {string} - Error message yang user-friendly
 */
export const getErrorMessage = (err) => {
  if (err.response?.data?.message) {
    return err.response.data.message
  }
  if (err.message) {
    return err.message
  }
  return 'Terjadi kesalahan yang tidak diketahui'
}

/**
 * Get specific error message berdasarkan status code
 * @param {Error} err - Error object
 * @returns {string} - Specific error message
 */
export const getSpecificErrorMessage = (err) => {
  const status = err.response?.status
  const code = err.code

  if (status === 422) {
    return 'Data yang Anda masukkan tidak valid. Periksa kembali form Anda.'
  }
  
  if (status === 500) {
    return 'Terjadi kesalahan pada server. Pastikan Python engine sedang berjalan dan coba lagi.'
  }
  
  if (status === 0 || code === 'ERR_NETWORK') {
    return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
  }
  
  if (status === 401) {
    return 'Sesi Anda telah berakhir. Silakan login kembali.'
  }
  
  if (status === 403) {
    return 'Anda tidak memiliki izin untuk melakukan aksi ini.'
  }
  
  if (status === 404) {
    return 'Data yang Anda cari tidak ditemukan.'
  }

  return getErrorMessage(err)
}

