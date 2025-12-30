import { sql } from "@vercel/postgres"

export async function query<T = any>(strings: TemplateStringsArray, ...values: any[]) {
  return sql<T>(strings as any, ...values)
}

export { sql }
