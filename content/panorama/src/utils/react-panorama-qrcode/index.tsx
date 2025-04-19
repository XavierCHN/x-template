/**
 * based on
 * @license qrcode.react
 * Copyright (c) Paul O'Shannessy
 * SPDX-License-Identifier: ISC
 */

import React from 'react';
import qrcodegen from './third-party/qrcodegen';
import type { PanelAttributes } from 'react-panorama-x';

type Modules = ReturnType<qrcodegen.QrCode['getModules']>;
type Excavation = { x: number; y: number; w: number; h: number };
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

type ERROR_LEVEL_MAPPED_TYPE = {
    [index in ErrorCorrectionLevel]: qrcodegen.QrCode.Ecc;
};

const ERROR_LEVEL_MAP: ERROR_LEVEL_MAPPED_TYPE = {
    L: qrcodegen.QrCode.Ecc.LOW,
    M: qrcodegen.QrCode.Ecc.MEDIUM,
    Q: qrcodegen.QrCode.Ecc.QUARTILE,
    H: qrcodegen.QrCode.Ecc.HIGH,
} as const;

type QRProps = {
    /**
     * 二维码中使用的数据，例如链接地址等
     */
    value: string | string[];
    /**
     * 要渲染的二维码的大小，以像素为单位
     */
    size: number;
    /**
     * 二维码的容错级别
     * @see https://www.qrcode.com/en/about/error_correction.html
     * @defaultValue L
     */
    level?: ErrorCorrectionLevel;
    /**
     * 二维码的前景颜色
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
     * @defaultValue #000000
     */
    fgColor?: string;
    /**
     * 边距的大小
     * @defaultValue 1
     */
    marginSize?: number;
    /**
     * 编码QR Code时使用的最小版本。有效值为1-40，值越高，QR Code越复杂。
     * 最优（最低）版本是根据提供的值确定的，使用`minVersion`作为下界。
     * @defaultValue 1
     */
    minVersion?: number;
    /**
     * 如果启用，结果的错误纠正级别可能高于指定的错误纠正级别选项
     * @defaultValue true
     */
    boostLevel?: boolean;
    /**
     * 中间空出的部分大小，以cell为单位
     */
    excavate?: number;
};

interface CanvasPanel extends Panel {
    ClearJS(color: string): void;
    DrawSoftLinePointsJS(
        count: number,
        points: [x1: number, y1: number, x2: number, y2: number],
        width: number,
        unknown: number,
        color: string
    ): void;
}

const DEFAULT_SIZE = 128;
const DEFAULT_LEVEL: ErrorCorrectionLevel = 'L';
const DEFAULT_FGCOLOR = '#000000';
const DEFAULT_MINVERSION = 1;

const DEFAULT_MARGIN_SIZE = 1;

function excavateModules(modules: Modules, excavation: Excavation): Modules {
    return modules.slice().map((row, y) => {
        if (y < excavation.y || y >= excavation.y + excavation.h) {
            return row;
        }
        return row.map((cell, x) => {
            if (x < excavation.x || x >= excavation.x + excavation.w) {
                return cell;
            }
            return false;
        });
    });
}

function getMarginSize(marginSize?: number): number {
    if (marginSize != null) {
        return Math.max(Math.floor(marginSize), 0);
    }
    return DEFAULT_MARGIN_SIZE;
}

function useQRCode({
    value,
    level,
    minVersion,
    marginSize,
    boostLevel,
}: {
    value: string | string[];
    level: ErrorCorrectionLevel;
    minVersion: number;
    marginSize?: number;
    boostLevel?: boolean;
}) {
    const qrcode = React.useMemo(() => {
        const values = Array.isArray(value) ? value : [value];
        const segments = values.reduce<qrcodegen.QrSegment[]>((accum, v) => {
            accum.push(...qrcodegen.QrSegment.makeSegments(v));
            return accum;
        }, []);
        return qrcodegen.QrCode.encodeSegments(segments, ERROR_LEVEL_MAP[level], minVersion, undefined, undefined, boostLevel);
    }, [value, level, minVersion, boostLevel]);

    const memoizedResult = React.useMemo(() => {
        const cells = qrcode.getModules();
        const margin = getMarginSize(marginSize);
        const numCells = cells.length + margin * 2;
        return {
            cells,
            margin,
            numCells,
        };
    }, [qrcode, marginSize]);

    return {
        qrcode,
        ...memoizedResult,
    };
}

export const PanoramaQRCode = React.forwardRef<Panel, PanelAttributes & QRProps>(function QRCodeCanvas(props, forwardedRef) {
    const {
        value,
        size = DEFAULT_SIZE,
        level = DEFAULT_LEVEL,
        fgColor = DEFAULT_FGCOLOR,
        minVersion = DEFAULT_MINVERSION,
        boostLevel,
        marginSize,
        excavate = 0,
        ...extraProps
    } = props;
    const { style, ...otherProps } = extraProps;

    const _canvas = React.useRef<CanvasPanel | null>(null);

    // Set the local ref (_canvas) and also the forwarded ref from outside
    const setCanvasRef = React.useCallback(
        (node: CanvasPanel | null) => {
            _canvas.current = node;
            if (typeof forwardedRef === 'function') {
                forwardedRef(node);
            } else if (forwardedRef) {
                forwardedRef.current = node;
            }
        },
        [forwardedRef]
    );

    const { margin, cells, numCells } = useQRCode({
        value,
        level,
        minVersion,
        boostLevel,
        marginSize,
    });

    React.useEffect(() => {
        // Always update the canvas. It's cheap enough and we want to be correct
        // with the current state.
        if (_canvas.current != null) {
            const canvas = _canvas.current;

            // ClearJS方法有bug，如果alpha不是0，会导致绘制错误
            // 因此我们移除了方法的bgColor支持
            canvas.ClearJS(`rgba(0, 0, 0, 0)`);

            const cellSize = size / numCells;

            let cellsToDraw = cells;

            // 计算需要避让的部分
            if (excavate > 0) {
                const excavation = {
                    x: Math.floor(numCells / 2 - excavate / 2),
                    y: Math.floor(numCells / 2 - excavate / 2),
                    w: excavate,
                    h: excavate,
                };
                cellsToDraw = excavateModules(cells, excavation);
            }

            cellsToDraw.forEach(function (row, rdx) {
                row.forEach(function (cell, cdx) {
                    if (cell) {
                        canvas.DrawSoftLinePointsJS(
                            2,
                            [
                                (cdx + margin) * cellSize,
                                (rdx + 0.5 + margin) * cellSize,
                                (cdx + 1 + margin) * cellSize,
                                (rdx + 0.5 + margin) * cellSize,
                            ],
                            cellSize,
                            0,
                            fgColor
                        );
                    }
                });
            });
        }
    }, [_canvas, size, numCells, cells, excavate, fgColor, margin]);

    const canvasStyle = React.useMemo(() => ({ height: `${size}px`, width: `${size}px`, ...style }), [size, style]);

    return (
        <>
            <GenericPanel type="UICanvas" style={canvasStyle} ref={setCanvasRef} {...otherProps} />
        </>
    );
});
