/**
 * Events provided by Valve's document: https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Panorama/Events
 */
declare interface PanoramaEvent {
    /** Add a CSS class to a panel. */
    AddStyle(className: string): void;

    /** Add a CSS class to a panel after a specified delay. */
    AddStyleAfterDelay(className: string, preDelay: number): void;

    /** Add a CSS class to all children of this panel. */
    AddStyleToEachChild(className: string): void;

    /** Add a class for a specified duration, with optional pre-delay; clears existing timers when called with same class. */
    AddTimedStyle(className: string, duration: number, preDelay: number): void;

    /** Fire another event after a delay (in seconds, the event is provided in string and parsed by javascript engine). */
    AsyncEvent(delay: number, event: string): void;

    /** Tip to display, panel to attach to (default 'DefaultTipAttachment') */
    DOTADisplayDashboardTip(str: string, panelName?: string): void;

    /** Hide the ability tooltip */
    DOTAHideAbilityTooltip(): void;

    /** Hide the buff tooltip */
    DOTAHideBuffTooltip(): void;

    /** Hide the dropped item tooltip */
    DOTAHideDroppedItemTooltip(): void;

    /** Hide the econ item tooltip. */
    DOTAHideEconItemTooltip(): void;

    /** Hide the profile card / battle cup tooltip. */
    DOTAHideProfileCardBattleCupTooltip(): void;

    /** Hide the profile card tooltip. */
    DOTAHideProfileCardTooltip(panel: PanelBase): void;

    /** Hide the rank tier tooltip. */
    DOTAHideRankTierTooltip(): void;

    /** Hide the rune tooltip. */
    DOTAHideRuneTooltip(): void;

    /** Hide the text tooltip. */
    DOTAHideTextTooltip(): void;

    /** Hide the ti10 event game tooltip. */
    DOTAHideTI10EventGameTooltip(): void;

    /** Hide the title image text tooltip. */
    DOTAHideTitleImageTextTooltip(): void;

    /** Hide the title text tooltip. */
    DOTAHideTitleTextTooltip(): void;

    /** Show tooltip for an item in the entityIndex NPC's inventory. */
    DOTAShowAbilityInventoryItemTooltip(entityIndex: EntityIndex, inventorySlot: number): void;

    /** Show tooltip for an item in the entityIndex NPC's shop. */
    DOTAShowAbilityShopItemTooltip(panel: PanelBase, abilityName: string, guideName: string, entityIndex: EntityIndex): void;

    /** Show an ability tooltip. */
    DOTAShowAbilityTooltip(abilityName: string): void;

    /** Show an ability tooltip. Level information comes from the entity specified by the entityIndex. */
    DOTAShowAbilityTooltipForEntityIndex(abilityName: string, entityIndex: EntityIndex): void;

    /** Show an ability tooltip annotated with a particular guide's info. */
    DOTAShowAbilityTooltipForGuide(abilityName: string, guideName: string): void;

    /** Show an ability tooltip for the specified hero. */
    DOTAShowAbilityTooltipForHero(abilityName: string, heroid: EntityIndex, bOnEnemy: boolean): void;

    /** Show an ability tooltip for a specific level. */
    DOTAShowAbilityTooltipForLevel(abilityName: string, level: number): void;

    /** Show a buff tooltip for the specified entityIndex + buff serial. */
    DOTAShowBuffTooltip(entityIndex: EntityIndex, buffSerial: BuffID, bOnEnemy: boolean): void;

    /** Show the econ item tooltip for a given item, style, and hero. Use 0 for the default style, and -1 for the default hero. */
    DOTAShowEconItemTooltip(itemDef: string, styleIndex: number, heroID: number): void;

    /** Show the battle cup portion of the user's profile card, if it exists */
    DOTAShowProfileCardBattleCupTooltip(steamID: number): void;

    /** Show a user's profile card. Use pro name determines whether to use their professional team name if applicable. */
    DOTAShowProfileCardTooltip(steamID: number, useProName: boolean): void;

    /** Show the rank tier tooltip for a user */
    DOTAShowRankTierTooltip(steamID: number): void;

    /** Show a rune tooltip in the X Y location for the rune type */
    DOTAShowRuneTooltip(X: number, Y: number, RuneType: number): void;

    /** Show a tooltip with the given text. */
    DOTAShowTextTooltip(text: string): void;

    /** Show a tooltip with the given text. Also apply a CSS class named "style" to allow custom styling. */
    DOTAShowTextTooltipStyled(text: string, style: string): void;

    /** Show a tooltip with the given title, image, and text. */
    DOTAShowTitleImageTextTooltip(title: string, imagePath: string, text: string): void;

    /** Show a tooltip with the given title, image, and text. Also apply a CSS class named "style" to allow custom styling. */
    DOTAShowTitleImageTextTooltipStyled(panel: PanelBase, title: string, imagePath: string, text: string, style: string): void;

    /** Show a tooltip with the given title and text. */
    DOTAShowTitleTextTooltip(title: string, text: string): void;

    /** Show a tooltip with the given title and text. Also apply a CSS class named "style" to allow custom styling. */
    DOTAShowTitleTextTooltipStyled(title: string, text: string, style: string): void;

    /** Drop focus entirely from the window containing this panel. */
    DropInputFocus(): void;

    /** Fire another event if this panel has a given class. */
    IfHasClassEvent(className: string, event: string): void;

    /** Fire another event if this panel is hovered over. */
    IfHoverOtherEvent(otherPanelID: string, event: string): void;

    /** Fire another event if this panel does not have a given class. */
    IfNotHasClassEvent(className: string, event: string): void;

    /** Fire another event if this panel is not hovered over. */
    IfNotHoverOtherEvent(otherPanelID: string, event: string): void;

    /** Move down from the panel. By default, this will change the focus position, but other panel types may implement this differently. */
    MovePanelDown(repeatCount: number): void;

    /** Move left from the panel. By default, this will change the focus position, but other panel types may implement this differently. */
    MovePanelLeft(repeatCount: number): void;

    /** Move right from the panel. By default, this will change the focus position, but other panel types may implement this differently. */
    MovePanelRight(repeatCount: number): void;

    /** Move up from the panel. By default, this will change the focus position, but other panel types may implement this differently. */
    MovePanelUp(repeatCount: number): void;

    /** Scroll the panel down by one page. */
    PageDown(): void;

    /** Scroll the panel left by one page. */
    PageLeft(): void;

    /** Scroll the panel right by one page. */
    PageRight(): void;

    /** Scroll the panel up by one page. */
    PageUp(): void;

    /** Scroll the panel down by one page. */
    PagePanelDown(panel: PanelBase): void;

    /** Scroll the panel left by one page. */
    PagePanelLeft(panel: PanelBase): void;

    /** Scroll the panel right by one page. */
    PagePanelRight(panel: PanelBase): void;

    /** Scroll the panel up by one page. */
    PagePanelUp(panel: PanelBase): void;

    /** Remove a CSS class from a panel. */
    RemoveStyle(className: string): void;

    /** Remove a CSS class from a panel after a specified delay. */
    RemoveStyleAfterDelay(className: string, preDelay: number): void;

    /** Remove a CSS class from all children of this panel. */
    RemoveStyleFromEachChild(className: string): void;

    /** Scroll the panel down by one line. */
    ScrollDown(): void;

    /** Scroll the panel left by one line. */
    ScrollLeft(): void;

    /** Scroll the panel right by one line. */
    ScrollRight(): void;

    /** Scroll the panel up by one line. */
    ScrollUp(): void;

    /** Scroll the panel down by one line. */
    ScrollPanelDown(panel: PanelBase): void;

    /** Scroll the panel left by one line. */
    ScrollPanelLeft(panel: PanelBase): void;

    /** Scroll the panel right by one line. */
    ScrollPanelRight(panel: PanelBase): void;

    /** Scroll the panel up by one line. */
    ScrollPanelUp(panel: PanelBase): void;

    /** Scroll this panel to the bottom. */
    ScrollToBottom(): void;

    /** Scroll this panel to the top. */
    ScrollToTop(): void;

    /** Set whether any child panels are :selected. */
    SetChildPanelsSelected(selected: boolean): void;

    /** Set focus to this panel. */
    SetInputFocus(panel: PanelBase): void;

    /** Sets whether the given panel is enabled */
    SetPanelEnabled(enabled: boolean): void;

    /** Set whether this panel is :selected. */
    SetPanelSelected(selected: boolean): void;

    /** Switch which class the panel has for a given attribute slot. Allows easily changing between multiple states. */
    SwitchStyle(slot: string, className: string): void;

    /** Toggle whether this panel is :selected. */
    TogglePanelSelected(panel: PanelBase): void;

    /** Toggle whether a panel has the given CSS class. */
    ToggleStyle(className: string): void;

    /** Remove then immediately add back a CSS class from a panel. Useful to re-trigger events like animations or sound effects. */
    TriggerStyle(className: string): void;
}

/**
 * Dota Panorama Events collect in DotA2 xml files
 */
declare interface PanoramaEvent {
    DOTAScenePanelSceneLoaded(panel: PanelBase): void;
    DOTAScenePanelSceneUnloaded(panel: PanelBase): void;
    DOTAScenePanelCameraLerpFinished(panel: PanelBase): void;
    DOTAScenePanelSetRotationSpeed(speed: number): void;
    DOTASceneFireEntityInput(panel: PanelBase, entityName: string, eventName: string, eventParam: string | number): void;
    DOTAScenePanelSimulateWorld(num: number): void;
    DOTAScenePanelEntityClicked(entityName: string): void;
    DOTAScenePanelEntityMouseOver(entityName: string): void;
    DOTAScenePanelEntityMouseOut(entityName: string): void;
    DOTASceneSetCameraEntity(entityName: string, delay: number): void;
    DOTAScenePanelResetRotation(): void;
    DOTAGlobalSceneFireEntityInput(entityName: string, eventName: string, eventParam: string | number): void;
    DOTAGlobalSceneSetCameraEntity(sceneId: string, entityName: string, delay: number): void;
    DOTAGlobalSceneSetRootEntity(sceneId: string, entityName: string): void;
    DOTAScenePanelDumpState(): void;
    DOTAShowReferencePage(xmlPath: string): void;
    DOTAShowReferencePageStyled(xmlPath: string, styleClass: string): void;
    DOTAHUDShopOpened(shopType: DOTA_SHOP_TYPE, opened: boolean): void;
    DOTAHUDToggleShop(): void;
    DOTAShopCancelSearch(): void;
    DOTAHUDToggleScoreboard(): void;
    DOTAHUDShowScoreboard(): void;
    DOTAHUDHideScoreboard(): void;
    DOTAShowHomePage(): void;
}

/**
 * UNDOCUMENTED BUT USEFUL EVENTS
 */
declare interface PanoramaEvent {
    /** Dismiss all context menus */
    DismissAllContextMenus(): void;

    /** Built in browser goto the provided url. (will return to the dashboard) */
    BrowserGoToURL(url: string): void;

    /** Open your default browser and goto url. */
    ExternalBrowserGoToURL(url: string): void;

    /** Show custom layout parameters tooltip, layout is the xml file, the parameters are contacted with & symbol. */
    UIShowCustomLayoutParametersTooltip(toolipId: string, xmlFile: string, parameters: string): void;

    /** Hide custom layout parameters tooltip. */
    UIHideCustomLayoutParametersTooltip(toolipId: string): void;

    /** Show custom layout tooltip, layout is the xml file. */
    UIShowCustomLayoutTooltip(toolipId: string, xmlFile: string): void;

    /** Hide custom layout tooltip */
    UIHideCustomLayoutTooltip(toolipId: string): void;

    UIHideCustomLayoutTooltip(toolipId: string): void;

    UIShowCustomLayoutPopup(id: string, xmlPath: string): void;

    UIShowTextTooltip(text: string): void;

    UIShowTextTooltip(text: string): void;

    UIHideTextTooltip(): void;

    /** Click the disconnect icon */
    DOTAHUDGameDisconnect(): void;

    /** Show the match details screen for the provided match id. */
    DOTAShowMatchDetails(matchId: number): void;

    /** Play a sound effect. */
    PlaySoundEffect(sound: string): void;

    /** Popup button is clicked */
    UIPopupButtonClicked(panel: PanelBase): void;

    /** Fire a game event clientside? */
    FireCustomGameEvent_Str(eventName: string, data: string | number): void;

    /** display the damage armor tooltip */
    DOTAHUDShowDamageArmorTooltip(): void;

    /** hide the damage armor tooltip */
    DOTAHUDHideDamageArmorTooltip(): void;

    /** Show gold tooltip */
    DOTAHUDShowGoldTooltip(): void;

    /** Hide gold tooltip */
    DOTAHUDHideGoldTooltip(): void;

    /** Buff icon is clicked */
    DOTAHUDBuffClicked(): void;

    /** Go back to dashboard */
    DOTAHUDShowDashboard(): void;

    /** Show the settings popup panel */
    DOTAShowSettingsPopup(): void;

    /** Show the dropped item tooltip */
    DOTAShowDroppedItemTooltip(x: number, y: number, abilityName: string, playerId: PlayerID, unknown: boolean): void;

    /**
     * Drag events
     */
    DragStart(panel: PanelBase, settings: DragSettings): void;
    DragEnter(panel: PanelBase, displayPanel: PanelBase): void;
    DragLeave(panel: PanelBase, displayPanel: PanelBase): void;
    DragDrop(panel: PanelBase, displayPanel: PanelBase): void;
    DragEnd(panel: PanelBase, displayPanel: PanelBase): void;
}
