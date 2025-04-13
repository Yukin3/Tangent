export interface GraphData {
    nodes: { id: string; label?: string }[];
    links: { source: string; target: string }[];
  }