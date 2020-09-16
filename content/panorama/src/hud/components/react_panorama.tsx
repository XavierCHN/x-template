import React, { useState } from 'react';

export function ReactLogo() {
    return (
        <Panel style={{ flowChildren: 'down', verticalAlign: 'center', horizontalAlign: 'center' }}>
            <Label style={{ horizontalAlign: 'center', color: 'red', fontSize: '120px', fontWeight: 'bold', opacity: '0.3' }} text="REACT-PANORAMA" />
            <Label style={{ horizontalAlign: 'center', color: 'red', fontSize: '30px', fontWeight: 'bold', opacity: '0.3' }} text="https://github.com/ark120202/react-panorama" />
        </Panel>
    );
}
