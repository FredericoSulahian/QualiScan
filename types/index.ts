export interface GherkinScenario {
  title: string
  steps: string[]
  tags?: string[]
}

export interface ComparisonResult {
  missing: GherkinScenario[]
  overlap: GherkinScenario[]
  edgeCases: GherkinScenario[]
}

export interface FileUpload {
  name: string
  content: string
  type: FileType
}

export interface AnalysisResult {
  scenarios: GherkinScenario[]
  summary: string
}

export enum FileType {
  SOURCE = 'source',
  QA = 'qa'
}