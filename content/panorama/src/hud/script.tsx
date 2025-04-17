import 'panorama-polyfill-x/lib/console';
import 'panorama-polyfill-x/lib/timers';
import { FlameGraph } from './flame_graph/flame_graph';

import { type FC } from 'react';
import { render } from 'react-panorama-x';
import { PanoramaQRCode } from '../utils/panorama-react-qrcode';

const Root: FC = () => {
    return (
        <>
            {
                // 如果在工具模式下显示火焰图
                Game.IsInToolsMode() && <FlameGraph />
            }
            {
                // 显示一个二维码
                <PanoramaQRCode
                    value={`https://github.com/XavierCHN/x-template`}
                    size={256}
                    excavate={6}
                    style={{ horizontalAlign: `center`, verticalAlign: `center`, backgroundColor: `#ffffff` }}
                >
                    <Image
                        src="file://{images}/logos/dota_logo_bright.psd"
                        style={{ width: `64px`, height: `64px`, horizontalAlign: `center`, verticalAlign: `center` }}
                    />
                </PanoramaQRCode>
            }
        </>
    );
};

render(<Root />, $.GetContextPanel());

console.log(`Hello, world!`);
