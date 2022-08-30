import 'panorama-polyfill/lib/console';
import 'panorama-polyfill/lib/timers';

import React from 'react';
import { render } from '@demon673/react-panorama';

function Test() {
    return <Label text="this is a placeholder for react-panorama" />;
}

render(<Test />, $.GetContextPanel());
