export type DataPoint = { label: string; value: number; sortOrder?: number };

export type SnapContext = {
  chart: { id: string; title?: string | null; chartType: string };
  data: Array<{ label: string; value: number; sortOrder: number }>;
  stats: {
    count: number;
    min: number;
    max: number;
    sum: number;
    avg: number;
    last: number;
    prev: number;
    delta: number;
    deltaPct: number;
  };
  now: { ts: number };
};

export type SnapResult = {
  style: {
    theme?: string;
    color?: string;
    opacity?: number;
    format?: "currency" | "percent" | "compact";
    watermark?: boolean;
    highlights?: Array<{ kind: "last" | "label"; label?: string }>;
    badges?: string[];
  };
  events: Array<{ type: "alert" | "log"; message: string; rule: string }>;
};
