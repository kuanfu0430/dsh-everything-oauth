import { EverythingOAuthSession } from './bundle.js'

const MAX_REQUEST_IMAGE_BYTES = 20 * 1024 * 1024
const REQUEST_IMAGE_PIXEL_BUDGET = 2048 * 2048
const REQUEST_IMAGE_MAX_BYTES = 1024 * 1024

// The bundled plugin was built against an older dsh-llm-pi-ai profile shape.
// Patch its profile factory before apply() creates a session so image requests
// always receive the finite budgets required by newer Harness releases.
const profiles = EverythingOAuthSession.prototype.profiles
EverythingOAuthSession.prototype.profiles = async function profilesWithImageBudgets() {
  const resolved = await profiles.call(this)
  for (const profile of resolved.values()) {
    profile.maxRequestImageBytes ??= MAX_REQUEST_IMAGE_BYTES
    profile.requestImagePixelBudget ??= REQUEST_IMAGE_PIXEL_BUDGET
    profile.requestImageMaxBytes ??= REQUEST_IMAGE_MAX_BYTES
  }
  return resolved
}

export * from './bundle.js'
