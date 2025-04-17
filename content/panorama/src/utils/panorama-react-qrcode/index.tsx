/**
 * based on
 * @license qrcode.react
 * Copyright (c) Paul O'Shannessy
 * SPDX-License-Identifier: ISC
 */

import React from 'react';
import qrcodegen from './third-party/qrcodegen';
import { PanelAttributes } from 'react-panorama-x';
import { UICanvasPanel } from './types/UICanvas';

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

type ImageSettings = {
    /**
     * 需要嵌入二维码的图片路径
     */
    src: string;
    /**
     * 图片的x坐标
     */
    x?: number;
    /**
     * 图片的y坐标
     */
    y?: number;
    /**
     * 图片的高度
     */
    height: number;
    /**
     * 图片的宽度
     */
    width: number;
    /**
     * 是否 excavate，意味着在图片周围的单元格会使用背景颜色绘制而不是前景颜色
     */
    excavate: boolean;
    /**
     * 图片的透明度
     * @defaultValue 1
     */
    opacity?: number;
};

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
     * 二维码的背景颜色
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
     * @defaultValue #FFFFFF
     */
    bgColor?: string;
    /**
     * 二维码的前景颜色
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
     * @defaultValue #000000
     */
    fgColor?: string;
    /**
     * 是否包含边距
     * @deprecated Use `marginSize` instead.
     * @defaultValue false
     */
    includeMargin?: boolean;
    /**
     * 边距的大小
     * @defaultValue 0
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
     * 插入的图片设置
     */
    imageSettings?: ImageSettings;
};

const DEFAULT_SIZE = 128;
const DEFAULT_LEVEL: ErrorCorrectionLevel = 'L';
const DEFAULT_BGCOLOR = '#FFFFFF';
const DEFAULT_FGCOLOR = '#000000';
const DEFAULT_INCLUDEMARGIN = false;
const DEFAULT_MINVERSION = 1;

const SPEC_MARGIN_SIZE = 4;
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

function getImageSettings(
    cells: Modules,
    size: number,
    margin: number,
    imageSettings?: ImageSettings
): null | {
    x: number;
    y: number;
    h: number;
    w: number;
    excavation: Excavation | null;
    opacity: number;
} {
    if (imageSettings == null) {
        return null;
    }
    const numCells = cells.length + margin * 2;
    const defaultSize = Math.floor(size);
    const scale = numCells / size;

    const w = (imageSettings.width || defaultSize) * scale;
    const h = (imageSettings.height || defaultSize) * scale;

    // 把图片放在中心位置
    const x = imageSettings.x == null ? cells.length / 2 - w / 2 + 1 : imageSettings.x * scale;
    const y = imageSettings.y == null ? cells.length / 2 - h / 2 + 1 : imageSettings.y * scale;

    const opacity = imageSettings.opacity == null ? 1 : imageSettings.opacity;

    let excavation = null;
    if (imageSettings.excavate) {
        let floorX = Math.floor(x);
        let floorY = Math.floor(y);
        let ceilW = Math.ceil(w + x - floorX);
        let ceilH = Math.ceil(h + y - floorY);
        excavation = { x: floorX, y: floorY, w: ceilW, h: ceilH };
    }

    return { x, y, h, w, excavation, opacity };
}

function getMarginSize(includeMargin: boolean, marginSize?: number): number {
    if (marginSize != null) {
        return Math.max(Math.floor(marginSize), 0);
    }
    return includeMargin ? SPEC_MARGIN_SIZE : DEFAULT_MARGIN_SIZE;
}

function useQRCode({
    value,
    level,
    minVersion,
    includeMargin,
    marginSize,
    imageSettings,
    size,
    boostLevel,
}: {
    value: string | string[];
    level: ErrorCorrectionLevel;
    minVersion: number;
    includeMargin: boolean;
    marginSize?: number;
    imageSettings?: ImageSettings;
    size: number;
    boostLevel?: boolean;
}) {
    let qrcode = React.useMemo(() => {
        const values = Array.isArray(value) ? value : [value];
        const segments = values.reduce<qrcodegen.QrSegment[]>((accum, v) => {
            accum.push(...qrcodegen.QrSegment.makeSegments(v));
            return accum;
        }, []);
        return qrcodegen.QrCode.encodeSegments(segments, ERROR_LEVEL_MAP[level], minVersion, undefined, undefined, boostLevel);
    }, [value, level, minVersion, boostLevel]);

    const { cells, margin, numCells, calculatedImageSettings } = React.useMemo(() => {
        let cells = qrcode.getModules();

        const margin = getMarginSize(includeMargin, marginSize);
        const numCells = cells.length + margin * 2;
        const calculatedImageSettings = getImageSettings(cells, size, margin, imageSettings);
        return {
            cells,
            margin,
            numCells,
            calculatedImageSettings,
        };
    }, [qrcode, size, imageSettings, includeMargin, marginSize]);

    return {
        qrcode,
        margin,
        cells,
        numCells,
        calculatedImageSettings,
    };
}

export const PanoramaQRCode = React.forwardRef<Panel, PanelAttributes & QRProps>(function QRCodeCanvas(props, forwardedRef) {
    const {
        value,
        size = DEFAULT_SIZE,
        level = DEFAULT_LEVEL,
        bgColor = DEFAULT_BGCOLOR,
        fgColor = DEFAULT_FGCOLOR,
        includeMargin = DEFAULT_INCLUDEMARGIN,
        minVersion = DEFAULT_MINVERSION,
        boostLevel,
        marginSize,
        imageSettings,
        ...extraProps
    } = props;
    const { style, ...otherProps } = extraProps;
    const imgSrc = imageSettings?.src;
    const _canvas = React.useRef<UICanvasPanel | null>(null);
    const _image = React.useRef<ImagePanel>(null);

    // Set the local ref (_canvas) and also the forwarded ref from outside
    const setCanvasRef = React.useCallback(
        (node: UICanvasPanel | null) => {
            _canvas.current = node;
            if (typeof forwardedRef === 'function') {
                forwardedRef(node);
            } else if (forwardedRef) {
                forwardedRef.current = node;
            }
        },
        [forwardedRef]
    );

    const [isImgLoaded, setIsImageLoaded] = React.useState(false);

    const { margin, cells, numCells, calculatedImageSettings } = useQRCode({
        value,
        level,
        minVersion,
        boostLevel,
        includeMargin,
        marginSize,
        imageSettings,
        size,
    });

    React.useEffect(() => {
        // Always update the canvas. It's cheap enough and we want to be correct
        // with the current state.
        if (_canvas.current != null) {
            const canvas = _canvas.current;
            canvas.ClearJS(bgColor);

            const cellSize = size / numCells;

            let cellsToDraw = cells;
            const image = _image.current;
            const haveImageToRender = calculatedImageSettings != null && image !== null && imageSettings?.width != 0 && imageSettings?.height != 0;

            if (haveImageToRender) {
                if (calculatedImageSettings.excavation != null) {
                    cellsToDraw = excavateModules(cells, calculatedImageSettings.excavation);
                }
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
    });

    React.useEffect(() => {
        setIsImageLoaded(false);
    }, [imgSrc]);

    const canvasStyle = { height: `${size}px`, width: `${size}px`, ...style };

    let img = null;
    if (imgSrc != null) {
      const cellSize = size / numCells;
      const imageStyle = {
        flowChildren: 'none',
        marginTop: (calculatedImageSettings?.x || 0 + margin) * cellSize + 'px',
        marginLeft: (calculatedImageSettings?.y || 0 + margin) * cellSize + 'px',
        width: (calculatedImageSettings?.w || 0 + 2) * cellSize + 'px',
        height: (calculatedImageSettings?.h || 0 + 2) * cellSize + 'px',
      }

      console.log(imageStyle)

      img = (
          <Image
              src={imgSrc}
              key={imgSrc}
              style={imageStyle}
              onload={() => {
                  setIsImageLoaded(true);
              }}
              ref={_image}
          />
      );
    }
    return (
        <>
            <GenericPanel type="UICanvas" style={canvasStyle} height={size} width={size} ref={setCanvasRef} {...otherProps} />
            {img}
        </>
    );
});
