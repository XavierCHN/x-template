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
    // 隐藏小地图
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_MINIMAP, false);
    // 隐藏商店
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_SHOP, false);
    // 隐藏顶部栏
    GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR, false);
    // GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_PANEL, false);

    // 左上角的击杀、死亡、助攻补刀等
    HideHudElements('quickstats');
    // 隐藏左上角得分面板按钮
    HideHudElements('ToggleScoreboardButton');
    // 小地图的塔防和扫描面板
    HideHudElements('GlyphScanContainer');
    // 隐藏TP格子
    HideHudElements('inventory_tpscroll_container');
    // 隐藏中立物品格子
    HideHudElements('inventory_neutral_slot_container');
    // 隐藏击杀者信息面板
    HideHudElements('KillCam');
    // 隐藏储藏处
    HideHudElements('stash');
    // 隐藏暂停信息
    HideHudElements('PausedInfo');
}

HideDefaultHud();
