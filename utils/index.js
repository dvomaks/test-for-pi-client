export const formatSize = function (bytes, decimalPoint = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1000
  const dm = decimalPoint
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
