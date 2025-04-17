import 'panorama-polyfill-x/lib/console';
import 'panorama-polyfill-x/lib/timers';
import { FlameGraph } from './flame_graph/flame_graph';

import { type FC } from 'react';
import { render } from 'react-panorama-x';
import { PanoramaQRCode } from '../utils/panorama-react-qrcode';
import type { UICanvasPanel } from '../utils/panorama-react-qrcode/types/UICanvas';

const Root: FC = () => {
    return (
        <>
            {
                // 如果在工具模式下显示火焰图
                Game.IsInToolsMode() && <FlameGraph />
            }
            {
                // 显示一个二维码
                // <PanoramaQRCode value={`https://github.com/XavierCHN/x-template`} size={256} />
            }
        </>
    );
};

render(<Root />, $.GetContextPanel());

console.log(`Hello, world!`);
