/**
 * Validation Utility
 * Modular validation functions
 */

/**
 * Validate plant selection
 * @param {string|number} plantId - Plant ID
 * @returns {string|null} - Error message or null if valid
 */
export const validatePlant = (plantId) => {
  if (!plantId) {
    return 'Pilih tanaman terlebih dahulu'
  }
  return null
}

/**
 * Validate symptoms selection
 * @param {Array} selectedSymptoms - Array of selected symptom IDs
 * @returns {string|null} - Error message or null if valid
 */
export const validateSymptoms = (selectedSymptoms) => {
  if (!selectedSymptoms || selectedSymptoms.length === 0) {
    return 'Pilih minimal 1 gejala yang Anda amati pada tanaman'
  }
  return null
}

/**
 * Validate CF values for selected symptoms
 * @param {Array} selectedSymptoms - Array of selected symptom IDs
 * @param {Object} symptomCFs - Object mapping symptom ID to CF value
 * @returns {string|null} - Error message or null if valid
 */
export const validateCFValues = (selectedSymptoms, symptomCFs) => {
  const missingCF = selectedSymptoms.find(symptomId => {
    const cf = symptomCFs[symptomId]
    return cf === undefined || cf === null || cf === ''
  })

  if (missingCF) {
    return 'Pilih tingkat kepastian untuk semua gejala yang dipilih'
  }
  return null
}

/**
 * Validate complete diagnosis form
 * @param {Object} form - Form data
 * @param {Array} selectedSymptoms - Selected symptoms
 * @param {Object} symptomCFs - CF values
 * @returns {Array} - Array of error messages (empty if valid)
 */
export const validateDiagnosisForm = (form, selectedSymptoms, symptomCFs) => {
  const errors = []

  const plantError = validatePlant(form.plant_id)
  if (plantError) errors.push(plantError)

  const symptomsError = validateSymptoms(selectedSymptoms)
  if (symptomsError) errors.push(symptomsError)

  const cfError = validateCFValues(selectedSymptoms, symptomCFs)
  if (cfError) errors.push(cfError)

  return errors
}

