import React, { useState } from "react";

export function ReactLogo() {
    return (
        <Panel style={{ flowChildren: "down", verticalAlign: "center", horizontalAlign: "center" }}>
            <Label style={{ horizontalAlign: "center", color: "red", fontSize: "120px", fontWeight: "bold", opacity: "0.3" }} text="REACT-PANORAMA" />
            <Label style={{ horizontalAlign: "center", color: "red", fontSize: "30px", fontWeight: "bold", opacity: "0.3" }} text="https://github.com/ark120202/react-panorama" />
            <Label
                style={{ horizontalAlign: "center", color: "red", fontSize: "30px", fontWeight: "bold", opacity: "0.3" }}
                text="edit content/panorama/src/hud/components/react_panorama.tsx to remove this"
            />
            <Button
                className="ButtonBevel"
                onactivate={() => {
                    GameEvents.SendCustomGameEventToServer("c2s_test_event", {});
                }}
            >
                <Label text="Test UIEvent" />
            </Button>
        </Panel>
    );
}
