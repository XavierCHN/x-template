import 'panorama-polyfill-x/lib/console';
import 'panorama-polyfill-x/lib/timers';
import { FlameGraph } from './flame_graph/flame_graph';

import { useMemo, type FC } from 'react';
import { render } from 'react-panorama-x';
import { useXNetTableKey } from '../hooks/useXNetTable';

const Test: FC = () => {
    return <Label text="Hello, world!" />;
};

const Root: FC = () => {
    return (
        <>
            {
                // 如果在工具模式下显示火焰图
                Game.IsInToolsMode() && <FlameGraph />
            }
            <Test />
        </>
    );
};

render(<Root />, $.GetContextPanel());

console.log(`Hello, world!`);
