import test from 'node:test'
import assert from 'node:assert/strict'
import { emptySelection, selectionCount, uploadFormData } from './uploadSections.js'

test('four sections preserve every file and aligned category in a single batch', () => {
  const selected = emptySelection()
  for (const key of Object.keys(selected)) selected[key] = [new File(['a'], `${key}-1.png`), new File(['b'], `${key}-2.png`)]
  const form = uploadFormData(selected)
  assert.equal(selectionCount(selected), 8)
  assert.equal(form.getAll('images').length, 8)
  assert.deepEqual(form.getAll('image_sections'), ['PROFILE','PROFILE','EXPERIENCE','EXPERIENCE','EDUCATION','EDUCATION','CERTIFICATES','CERTIFICATES'])
  assert.equal(form.get('auto_process'), 'true')
  assert.deepEqual(form.getAll('images').map(f => f.name), Object.values(selected).flat().map(f => f.name))
})

test('optional empty sections add no files or misplaced labels', () => {
  const selected = emptySelection()
  selected.CERTIFICATES = [new File(['certificate'], 'certificate.png')]
  const form = uploadFormData(selected)
  assert.equal(selectionCount(selected), 1)
  assert.deepEqual(form.getAll('image_sections'), ['CERTIFICATES'])
  assert.equal(selectionCount(emptySelection()), 0)
})
