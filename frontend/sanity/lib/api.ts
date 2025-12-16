function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}

export const dataset = assertValue(
  process.env.SANITY_DATASET,
  'Missing environment variable: SANITY_DATASET',
)

export const projectId = assertValue(
  process.env.SANITY_PROJECT_ID,
  'Missing environment variable: SANITY_PROJECT_ID',
)

export const apiVersion = process.env.SANITY_API_VERSION || '2025-09-25'
export const studioUrl = process.env.SANITY_STUDIO_URL || 'http://localhost:3333'
