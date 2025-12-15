import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId} from '@/sanity/lib/api'

export const clientSide = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN,
})
