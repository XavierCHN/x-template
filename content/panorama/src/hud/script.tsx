import '@demon673/panorama-polyfill/lib/console';
import '@demon673/panorama-polyfill/lib/timers';

import React from 'react';
import { render } from '@demon673/react-panorama';
import { useXNetTableKey } from '../hooks/useXNetTable';

const Test: React.FC = () => {
    const [data] = useXNetTableKey(`test_table`, `test_key`, { data_1: `unknown` });
    const string_data = data.data_1;
    return React.useMemo(() => <Label text={`${string_data}`} />, [string_data]);
};

render(<Test />, $.GetContextPanel());

console.log(`Hello, world!`);
