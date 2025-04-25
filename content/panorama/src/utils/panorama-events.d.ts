declare interface PanoramaEvent {
    /**
     * Events are provided by Valve's document: https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Panorama/Events
     */

    /** Add a CSS class to a panel. */
    AddStyle(panel: Panel, className: string): void;

    /** Add a CSS class to a panel after a specified delay. */
    AddStyleAfterDelay(panel: Panel, className: string, preDelay: number): void;

    /** Add a CSS class to all children of this panel. */
    AddStyleToEachChild(panel: Panel, className: string): void;

    /** Add a class for a specified duration, with optional pre-delay; clears existing timers when called with same class. */
    AddTimedStyle(panel: Panel, className: string, duration: number, preDelay: number): void;

    /** Fire another event after a delay (in seconds, the event is provided in string and parsed by javascript engine). */
    AsyncEvent(delay: number, event: string): void;

    /** Tip to display, panel to attach to (default 'DefaultTipAttachment') */
    DOTADisplayDashboardTip(str: string, panelName?: string): void;

    /** Hide the ability tooltip */
    DOTAHideAbilityTooltip(panel?: Panel): void;

    /** Hide the buff tooltip */
    DOTAHideBuffTooltip(panel?: Panel): void;

    /** Hide the dropped item tooltip */
    DOTAHideDroppedItemTooltip(panel?: Panel): void;

    /** Hide the econ item tooltip. */
    DOTAHideEconItemTooltip(panel?: Panel): void;

    /** Hide the profile card / battle cup tooltip. */
    DOTAHideProfileCardBattleCupTooltip(panel?: Panel): void;

    /** Hide the profile card tooltip. */
    DOTAHideProfileCardTooltip(panel: Panel): void;

    /** Hide the rank tier tooltip. */
    DOTAHideRankTierTooltip(panel?: Panel): void;

    /** Hide the rune tooltip. */
    DOTAHideRuneTooltip(panel?: Panel): void;

    /** Hide the text tooltip. */
    DOTAHideTextTooltip(panel?: Panel): void;

    /** Hide the ti10 event game tooltip. */
    DOTAHideTI10EventGameTooltip(panel?: Panel): void;

    /** Hide the title image text tooltip. */
    DOTAHideTitleImageTextTooltip(panel?: Panel): void;

    /** Hide the title text tooltip. */
    DOTAHideTitleTextTooltip(panel?: Panel): void;

    /**
     * Notify change in RTime32 we expect the stream to start
     * This is marked deprecated since it is not useful in modding and not tested
     * @deprecated
     * */
    DOTALiveStreamUpcoming(panel: Panel, time: number): void;

    /**
     * Notify change in stream state (we detected the stream going live)
     * This is marked deprecated since it is not useful in modding and not tested
     * @deprecated
     * */
    DOTALiveStreamVideoLive(panel: Panel, isLive: boolean): void;

    /**
     * Notify change in video state (is it pointing at a live stream page or not)
     * This is marked deprecated since it is not useful in modding and not tested
     * @deprecated
     * */
    DOTALiveStreamVideoPlaying(panel: Panel, isShowingVideo: boolean): void;

    /** Show tooltip for an item in the entityIndex NPC's inventory. */
    DOTAShowAbilityInventoryItemTooltip(panel: Panel, entityIndex: EntityIndex, inventorySlot: number): void;

    /** Show tooltip for an item in the entityIndex NPC's shop. */
    DOTAShowAbilityShopItemTooltip(panel: Panel, abilityName: string, guideName: string, entityIndex: EntityIndex): void;

    /** Show an ability tooltip. */
    DOTAShowAbilityTooltip(panel: Panel, abilityName: string): void;

    /** Show an ability tooltip. Level information comes from the entity specified by the entityIndex. */
    DOTAShowAbilityTooltipForEntityIndex(panel: Panel, abilityName: string, entityIndex: EntityIndex): void;

    /** Show an ability tooltip annotated with a particular guide's info. */
    DOTAShowAbilityTooltipForGuide(panel: Panel, abilityName: string, guideName: string): void;

    /** Show an ability tooltip for the specified hero. */
    DOTAShowAbilityTooltipForHero(panel: Panel, abilityName: string, heroid: EntityIndex, bOnEnemy: boolean): void;

    /** Show an ability tooltip for a specific level. */
    DOTAShowAbilityTooltipForLevel(panel: Panel, abilityName: string, level: number): void;

    /** Show a buff tooltip for the specified entityIndex + buff serial. */
    DOTAShowBuffTooltip(panel: Panel, entityIndex: EntityIndex, buffSerial: BuffID, bOnEnemy: boolean): void;

    /** Show the econ item tooltip for a given item, style, and hero. Use 0 for the default style, and -1 for the default hero. */
    DOTAShowEconItemTooltip(panel: Panel, itemDef: string, styleIndex: number, heroID: number): void;

    /** Show the battle cup portion of the user's profile card, if it exists */
    DOTAShowProfileCardBattleCupTooltip(panel: Panel, steamID: number): void;

    /** Show a user's profile card. Use pro name determines whether to use their professional team name if applicable. */
    DOTAShowProfileCardTooltip(panel: Panel, steamID: number, useProName: boolean): void;

    /** Show the rank tier tooltip for a user */
    DOTAShowRankTierTooltip(panel: Panel, steamID: number): void;

    /** Show a rune tooltip in the X Y location for the rune type */
    DOTAShowRuneTooltip(panel: Panel, X: number, Y: number, RuneType: number): void;

    /** Show a tooltip with the given text. */
    DOTAShowTextTooltip(panel: Panel, text: string): void;

    /** Show a tooltip with the given text. Also apply a CSS class named "style" to allow custom styling. */
    DOTAShowTextTooltipStyled(panel: Panel, text: string, style: string): void;

    /**
     * Show a ti10 event game tooltip
     * @deprecated This is marked deprecated since it is not useful in modding and not tested
     **/
    DOTAShowTI10EventGameTooltip(panel: Panel, X: object): void;

    /** Show a tooltip with the given title, image, and text. */
    DOTAShowTitleImageTextTooltip(panel: Panel, title: string, imagePath: string, text: string): void;

    /** Show a tooltip with the given title, image, and text. Also apply a CSS class named "style" to allow custom styling. */
    DOTAShowTitleImageTextTooltipStyled(panel: Panel, title: string, imagePath: string, text: string, style: string): void;

    /** Show a tooltip with the given title and text. */
    DOTAShowTitleTextTooltip(panel: Panel, title: string, text: string): void;

    /** Show a tooltip with the given title and text. Also apply a CSS class named "style" to allow custom styling. */
    DOTAShowTitleTextTooltipStyled(panel: Panel, title: string, text: string, style: string): void;

    /** Drop focus entirely from the window containing this panel. */
    DropInputFocus(panel?: Panel): void;

    /** Fire another event if this panel has a given class. */
    IfHasClassEvent(panel: Panel, className: string, event: string): void;

    /** Fire another event if this panel is hovered over. */
    IfHoverOtherEvent(panel: Panel, otherPanelID: string, event: string): void;

    /** Fire another event if this panel does not have a given class. */
    IfNotHasClassEvent(panel: Panel, className: string, event: string): void;

    /** Fire another event if this panel is not hovered over. */
    IfNotHoverOtherEvent(panel: Panel, otherPanelID: string, event: string): void;

    /** Move down from the panel. By default, this will change the focus position, but other panel types may implement this differently. */
    MovePanelDown(panel: Panel, repeatCount: number): void;

    /** Move left from the panel. By default, this will change the focus position, but other panel types may implement this differently. */
    MovePanelLeft(panel: Panel, repeatCount: number): void;

    /** Move right from the panel. By default, this will change the focus position, but other panel types may implement this differently. */
    MovePanelRight(panel: Panel, repeatCount: number): void;

    /** Move up from the panel. By default, this will change the focus position, but other panel types may implement this differently. */
    MovePanelUp(panel: Panel, repeatCount: number): void;

    /** Scroll the panel down by one page. */
    PageDown(): void;

    /** Scroll the panel left by one page. */
    PageLeft(): void;

    /** Scroll the panel down by one page. */
    PagePanelDown(panel: Panel): void;

    /** Scroll the panel left by one page. */
    PagePanelLeft(panel: Panel): void;

    /** Scroll the panel right by one page. */
    PagePanelRight(panel: Panel): void;

    /** Scroll the panel up by one page. */
    PagePanelUp(panel: Panel): void;

    /** Scroll the panel right by one page. */
    PageRight(): void;

    /** Scroll the panel up by one page. */
    PageUp(): void;

    /** Remove a CSS class from a panel. */
    RemoveStyle(panel: Panel, className: string): void;

    /** Remove a CSS class from a panel after a specified delay. */
    RemoveStyleAfterDelay(panel: Panel, className: string, preDelay: number): void;

    /** Remove a CSS class from all children of this panel. */
    RemoveStyleFromEachChild(panel: Panel, className: string): void;

    /** Scroll the panel down by one line. */
    ScrollDown(): void;

    /** Scroll the panel left by one line. */
    ScrollLeft(): void;

    /** Scroll the panel down by one line. */
    ScrollPanelDown(panel: Panel): void;

    /** Scroll the panel left by one line. */
    ScrollPanelLeft(panel: Panel): void;

    /** Scroll the panel right by one line. */
    ScrollPanelRight(panel: Panel): void;

    /** Scroll the panel up by one line. */
    ScrollPanelUp(panel: Panel): void;

    /** Scroll the panel right by one line. */
    ScrollRight(): void;

    /** Scroll the panel up by one line. */
    ScrollUp(): void;

    /** Scroll this panel to the bottom. */
    ScrollToBottom(): void;

    /** Scroll this panel to the top. */
    ScrollToTop(): void;

    /** Set whether any child panels are :selected. */
    SetChildPanelsSelected(panel: Panel, selected: boolean): void;

    /** Set focus to this panel. */
    SetInputFocus(panel: Panel): void;

    /** Sets whether the given panel is enabled */
    SetPanelEnabled(panel: Panel, enabled: boolean): void;

    /** Set whether this panel is :selected. */
    SetPanelSelected(panel: Panel, selected: boolean): void;

    /** Switch which class the panel has for a given attribute slot. Allows easily changing between multiple states. */
    SwitchStyle(panel: Panel, slot: string, className: string): void;

    /** Toggle whether this panel is :selected. */
    TogglePanelSelected(panel: Panel): void;

    /** Toggle whether a panel has the given CSS class. */
    ToggleStyle(panel: Panel, className: string): void;

    /** Remove then immediately add back a CSS class from a panel. Useful to re-trigger events like animations or sound effects. */
    TriggerStyle(panel: Panel, className: string): void;

    /** Dismiss all context menus */
    DismissAllContextMenus(): void;

    /** Built in browser goto the provided url. (will return to the dashboard) */
    BrowserGoToURL(url: string): void;

    /** Open your default browser and goto url. */
    ExternalBrowserGoToURL(url: string): void;

    /** Show custom layout parameters tooltip, layout is the xml file, the parameters are contacted with & symbol. */
    UIShowCustomLayoutParametersTooltip(panel: Panel, toolipId: string, xmlFile: string, parameters: string): void;

    /** Hide custom layout parameters tooltip. */
    UIHideCustomLayoutParametersTooltip(panel: Panel, toolipId: string): void;

    /** Show custom layout tooltip, layout is the xml file. */
    UIShowCustomLayoutTooltip(panel: Panel, toolipId: string, xmlFile: string): void;

    /** Hide custom layout tooltip */
    UIHideCustomLayoutTooltip(panel: Panel, toolipId: string): void;

    /** Click the disconnect icon */
    DOTAHUDGameDisconnect(): void;

    /** Show the match details screen for the provided match id. */
    DOTAShowMatchDetails(matchId: number): void;

    /** Play a sound effect. */
    PlaySoundEffect(sound: string): void;
}

declare type PanoramaEventName = keyof PanoramaEvent;
declare type PanoramaEventParams<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
