import {createClient} from '@sanity/client'

export const serverClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN, // 🔒 SERVER ONLY
  useCdn: false,
})
