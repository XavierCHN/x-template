let hud: Panel | null = null;

function HideHudElements(name: string) {
    if (hud == null) {
        hud = $.GetContextPanel();
        while (hud?.GetParent() != null) {
            hud = hud?.GetParent()!;
        }
    }
    const panel = hud.FindChildTraverse(name);
    if (panel) {
        panel.style.visibility = `collapse`;
    }
}

function HideDefaultHud() {
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_MINIMAP, false);
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_SHOP, false);
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR, false);
    // GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_PANEL, false);

    HideHudElements('quickstats');
    HideHudElements('ToggleScoreboardButton');
    HideHudElements('GlyphScanContainer');
    HideHudElements('inventory_tpscroll_container');
    HideHudElements('inventory_neutral_slot_container');
    HideHudElements('quickstats');
    HideHudElements('KillCam');
    HideHudElements('stash');
    HideHudElements('stackable_side_panels');
    HideHudElements('PausedInfo');
}

HideDefaultHud();
