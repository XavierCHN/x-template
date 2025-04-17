import type { PanelAttributes } from 'react-panorama-x';

type CanvasGraphOptions = {
    bkg_color: string;
    spokes_color: string;
    spoke_thickness: number;
    spoke_softness: number;
    spoke_length_scale: number;
    guideline_color: string;
    guideline_thickness: number;
    guideline_softness: number;
    guideline_count: number;
    deadzone_percent: number;
    scale: number;
};
type GraphPolyOptions = {
    line_color: string;
    fill_color_inner: string;
    fill_color_outer: string;
    line_tickness: number;
    line_softness: number;
};
export interface UICanvasPanel extends Panel {
    IsSizeValid(): boolean;
    ClearJS(color: string): void;
    SetGraphOptions(options: CanvasGraphOptions): void;
    DrawSoftLinePointsJS(
        count: number,
        points: [x1: number, y1: number, x2: number, y2: number],
        width: number,
        unknown: number,
        color: string
    ): void;
    DrawGraphBackground(count: number): void;
    DrawGraphPoly(points: number[], options: GraphPolyOptions): void;
    DrawShadedPoly(count: number, points: number, colors: string[]): void;
    DrawLineCircleJS(x: number, y: number, radius: number, color: string): void;
    DrawFilledCircleJS(x: number, y: number, radius: number, color: string): void;
    DrawFilledWedgeJS(x: number, y: number, radius: number, start_angle: number, end_angle: number, color: string): void;
    SetDrawColor(color: string): void;
}

export interface UICanvasPanelAttributes<T extends Panel> extends PanelAttributes<T> {}
