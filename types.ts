export interface RecreateRequest {
  imageBase64: string;
  instructions?: string;
}

export interface GenerateResult {
  html: string;
  usage?: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}