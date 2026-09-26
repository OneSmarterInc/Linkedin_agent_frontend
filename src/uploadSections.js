export const UPLOAD_SECTIONS = [
  { value: 'PROFILE', label: 'Profile screenshots', description: 'Name, headline, About, location, and visible skills.' },
  { value: 'EXPERIENCE', label: 'Experience', description: 'Job titles, employers, dates, and responsibilities.' },
  { value: 'EDUCATION', label: 'Education', description: 'Schools, degrees, subjects, and study dates.' },
  { value: 'CERTIFICATES', label: 'Certificates', description: 'Certificate names, issuers, dates, and credential IDs.' },
]
export const emptySelection = () => Object.fromEntries(UPLOAD_SECTIONS.map(s => [s.value, []]))
export const selectionCount = selected => UPLOAD_SECTIONS.reduce((n, s) => n + (selected[s.value]?.length || 0), 0)
export function uploadFormData(selected) {
  const form = new FormData()
  for (const section of UPLOAD_SECTIONS) {
    for (const file of selected[section.value] || []) {
      form.append('images', file)
      form.append('image_sections', section.value)
    }
  }
  form.append('auto_process', 'true')
  return form
}
