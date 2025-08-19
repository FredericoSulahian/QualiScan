import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateCoverage(sourceScenarios: any[], qaScenarios: any[]) {
  if (sourceScenarios.length === 0) return 0
  const covered = qaScenarios.length
  const total = sourceScenarios.length
  return Math.round((covered / total) * 100)
}

export function compareScenarios(sourceScenarios: any[], qaScenarios: any[]) {
  const sourceSet = new Set(sourceScenarios.map(s => s.title))
  const qaSet = new Set(qaScenarios.map(s => s.title))
  
  const missing = sourceScenarios.filter(s => !qaSet.has(s.title))
  const overlap = sourceScenarios.filter(s => qaSet.has(s.title))
  const edgeCases = qaScenarios.filter(s => !sourceSet.has(s.title))
  
  return { missing, overlap, edgeCases }
}