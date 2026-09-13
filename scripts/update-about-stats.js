#!/usr/bin/env node
// Compatibility entry point: validate reviewed public content without collecting
// local activity, private repositories, machine inventory, or usage statistics.
import { readFileSync } from 'node:fs'

const about = JSON.parse(readFileSync(new URL('../data/about.json', import.meta.url), 'utf8'))
const allowed = new Set(['name', 'role', 'intro', 'personal', 'currentWork'])
const unexpected = Object.keys(about).filter(key => !allowed.has(key))
if (unexpected.length) throw new Error('About content has unreviewed fields. Review data/about.json before building.')
for (const key of allowed) {
  if (typeof about[key] !== 'string' || !about[key].trim()) throw new Error(`Missing reviewed About field: ${key}`)
}
const projects = JSON.parse(readFileSync(new URL('../data/projects.json', import.meta.url), 'utf8'))
if (projects.some(project => project.visibility !== 'public' || project.source !== 'GitHub public' || Object.hasOwn(project, 'verified'))) {
  throw new Error('Project data must contain reviewed public records without raw verification notes.')
}
console.log('Reviewed public content structure validated. No statistics collected or files rewritten.')
