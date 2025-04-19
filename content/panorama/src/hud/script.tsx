import 'panorama-polyfill-x/lib/console';
import 'panorama-polyfill-x/lib/timers';

import { type FC } from 'react';
import { render } from 'react-panorama-x';
import { PanoramaQRCode } from '../utils/react-panorama-qrcode';

const Root: FC = () => {
    return (
        <>
            {
                // 显示一个二维码作为范例
                <PanoramaQRCode
                    value={`https://github.com/XavierCHN/x-template`}
                    size={128}
                    excavate={8}
                    style={{
                        horizontalAlign: `right`,
                        verticalAlign: `bottom`,
                        marginBottom: `400px`,
                        marginRight: `100px`,
                        backgroundColor: `#ffffff`,
                        opacity: `0.6`,
                    }}
                >
                    <Image
                        src="file://{images}/logos/dota_logo_bright.psd"
                        style={{ width: `32px`, height: `32px`, horizontalAlign: `center`, verticalAlign: `center` }}
                    />
                </PanoramaQRCode>
            }
        </>
    );
};

render(<Root />, $.GetContextPanel());

console.log(`Hello, world!`);
