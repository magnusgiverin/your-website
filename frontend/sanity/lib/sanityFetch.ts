import { serverClient } from "./serverClient"

interface SanityFetchProps {
  query: string
  params?: Record<string, any>
  revalidate?: number | false
}

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
}: SanityFetchProps): Promise<{ data: T }> {
  const data = await serverClient.fetch<T>(query, params, {
    next: revalidate === false ? undefined : { revalidate },
  })

  return { data }
}
