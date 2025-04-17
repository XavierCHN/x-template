import { PanelAttributes } from "react-panorama-x";

type CanvasGraphOptions = {
  bkg_color: string;
  spoke_length: number;
  guideline_count: number;
  deadzone_percent: number;
};
type GraphPolyOptions = {
  line_color: string;
  fill_color_inner: string;
  fill_color_outer: string;
};
export interface UICanvasPanel extends Panel {
  IsSizeValid(): boolean;
  ClearJS(color: string): void;
  SetGraphOptions(options: CanvasGraphOptions): void;
  DrawSoftLinePointsJS(count: number, points: [x1: number, y1: number, x2: number, y2: number], width: number, unknown: number, color: string): void;
  DrawGraphBackground(count: number): void;
  DrawGraphPoly(points: number[], options: GraphPolyOptions): void;
}

export interface UICanvasPanelAttributes<T extends Panel> extends PanelAttributes<T> {
}