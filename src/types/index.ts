export interface TextResponse {
  id: string;
  text: string;
  timestamp: number;
}

export interface ScaleResponse {
  id: string;
  value: number; // 1 - 100
  timestamp: number;
}

export interface PollState {
  textResponses: TextResponse[];
  scaleResponses: ScaleResponse[];
}

export interface SlideData {
  id: string;
  number: number;
  title: string;
  chapter: string;
}

export interface EditableContentMap {
  [key: string]: string;
}
