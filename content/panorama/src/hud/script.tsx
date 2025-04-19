import 'panorama-polyfill-x/lib/console';
import 'panorama-polyfill-x/lib/timers';

import { type FC } from 'react';
import { render } from 'react-panorama-x';
import { PanoramaQRCode } from '../utils/react-panorama-qrcode';
import { DispatchEventAction, FunctionAction, RunSequentialActions, RunSingleAction, WaitAction } from '../utils/sequential-actions';
import React from 'react';

const Root: FC = () => {
    const url = `https://github.com/XavierCHN/x-template`;
    const go = React.useCallback(() => {
        const wait = new WaitAction(0.2);
        const showTextTooltip = new DispatchEventAction(`DOTAShowTextTooltip`, $(`#QRCode`), `正在打开链接`);
        const hideTextTooltip = new DispatchEventAction(`DOTAHideTextTooltip`, $(`#QRCode`));
        const action = new FunctionAction(() => PlayUISoundScript('DotaSOS.TestBeep'));
        RunSequentialActions([showTextTooltip, wait, hideTextTooltip, wait, action]);
    }, [url]);

    return (
        <>
            {
                // 显示一个二维码作为范例
                <PanoramaQRCode id="QRCode" onactivate={go} value={url} size={128} excavate={8} className={`QRCode`}>
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
