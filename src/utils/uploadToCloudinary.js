export const uploadToCloudinary = async (file) => {
  if (!file) {
    throw new Error('No file provided for upload.')
  }
  // Keep a working default for this project when env vars are not configured.
  const cloudName = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dxoqwusir').trim()
  const uploadPreset = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default').trim()
  const data = new FormData()
  data.append('file', file)
  data.append('upload_preset', uploadPreset)
  data.append('cloud_name', cloudName)
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: data,
  })
  const payload = await response.json()
  if (!response.ok || payload.error) {
    const details = payload.error?.message || 'Image upload failed.'
    throw new Error(`${details} (cloud: ${cloudName}, preset: ${uploadPreset})`)
  }
  const imageUrl = payload.secure_url || payload.url
  if (!imageUrl) {
    throw new Error('Cloudinary did not return an image URL.')
  }
  return imageUrl
}
