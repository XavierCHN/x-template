import React from 'react';
import { DispatchEventAction, RunSequentialActions, WaitAction } from '../utils/sequential-actions';
import { useInterval } from '../hooks/useTimer';

export function SequentialActionsTest() {
    const panel = React.useRef<Panel>(null);

    useInterval(() => {
        if (panel.current) {
            const scrolldownEvent = new DispatchEventAction(`PagePanelDown`, panel.current);
            const waitAction = new WaitAction(0.5);
            const scrollupEvent = new DispatchEventAction(`PagePanelUp`, panel.current);
            RunSequentialActions([scrolldownEvent, waitAction, scrollupEvent]);
        }
    }, 1000);

    const veryLongLabelList = Array.from({ length: 100 }, (_, i) => <Label key={i} text={`Label ${i}`} />);

    return (
        <Panel
            ref={panel}
            style={{
                height: `200px`,
                flowChildren: 'down',
                overflow: 'scroll',
            }}
        >
            {veryLongLabelList}
        </Panel>
    );
}
