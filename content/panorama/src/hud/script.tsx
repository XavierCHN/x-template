import 'panorama-polyfill/lib/console';
import 'panorama-polyfill/lib/timers';

import React from 'react';
import { render } from '@demon673/react-panorama';

const Test: React.FC = () => {
    return React.useMemo(() => <Label text="this is a placeholder for react-panorama" />, []);
};

render(<Test />, $.GetContextPanel());
