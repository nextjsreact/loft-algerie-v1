import { createInstance } from 'i18next'
import Backend from 'i18next-fs-backend'
import { cookies } from 'next/headers'
import { getOptions } from './settings'
import * as fs from 'fs/promises'
import path from 'path'
 
export async function getTranslations(lng: string, ns: string | string[]) {
  const i18n = createInstance()
  await i18n
    .use(Backend)
    .init(getOptions(lng, Array.isArray(ns) ? ns : [ns]))

  // Explicitly load resources for server-side rendering
  const namespacesToLoad = Array.isArray(ns) ? ns : [ns];
  for (const namespace of namespacesToLoad) {
    try {
      const filePath = path.join(process.cwd(), 'public', 'locales', lng, `${namespace}.json`);
      const fileContents = await fs.readFile(filePath, 'utf8');
      const resources = JSON.parse(fileContents);
      i18n.addResourceBundle(lng, namespace, resources);
    } catch (error) {
      console.error(`Failed to load namespace ${namespace} for language ${lng}:`, error);
    }
  }

  return {
    t: i18n.t,
    resources: i18n.services.resourceStore.data
  }
}