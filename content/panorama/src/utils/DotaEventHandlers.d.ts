// 这些事件的参数尚未经过测试，待测试完成后将会被提交到TypescriptDeclarations仓库中

declare type PanelEventDefinition<Args extends any[] = []> = (panel: Panel, ...args: Args) => void;
declare type EventDefinition<Args extends any[] = []> = (...args: Args) => void;
declare type EventParams<T extends EventDefinition | PanelEventDefinition> = T extends PanelEventDefinition<infer Args>
    ? Args
    : T extends EventDefinition<infer Args>
    ? Args
    : never;
/**
 *
 * 这个部分没有开源，因此我们手动完成
 */
declare interface PanoramaEventHandlers {
    // 以下这些来自 https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Panorama/Events
    AddStyle: PanelEventDefinition<[string]>;
    AddStyleAfterDelay: PanelEventDefinition<[string, number]>;
    AddStyleToEachChild: PanelEventDefinition<[string]>;
    AddTimedStyle: PanelEventDefinition<[string, number, number]>;
    AsyncEvent: EventDefinition<[number, string]>;
    DOTADisplayDashboardTip: EventDefinition<[string, string]>;
    DOTAHideAbilityTooltip: EventDefinition | PanelEventDefinition;
    DOTAHideBuffTooltip: EventDefinition | PanelEventDefinition;
    DOTAHideDroppedItemTooltip: EventDefinition | PanelEventDefinition;
    DOTAHideEconItemTooltip: EventDefinition | PanelEventDefinition;
    DOTAHideProfileCardBattleCupTooltip: EventDefinition | PanelEventDefinition;
    DOTAHideProfileCardTooltip: EventDefinition | PanelEventDefinition;
    DOTAHideRankTierTooltip: EventDefinition | PanelEventDefinition;
    DOTAHideRuneTooltip: EventDefinition | PanelEventDefinition;
    DOTAHideTextTooltip: EventDefinition | PanelEventDefinition;
    DOTAHideTI10EventGameTooltip: PanelEventDefinition;
    DOTAHideTitleImageTextTooltip: PanelEventDefinition;
    DOTAHideTitleTextTooltip: PanelEventDefinition;
    DOTALiveStreamUpcoming: PanelEventDefinition<[number]>;
    DOTALiveStreamVideoLive: PanelEventDefinition<[boolean]>;
    DOTALiveStreamVideoPlaying: PanelEventDefinition<[boolean]>;
    DOTAShowAbilityInventoryItemTooltip: PanelEventDefinition<[number, number]>;
    DOTAShowAbilityShopItemTooltip: PanelEventDefinition<[string, string, number]>;
    DOTAShowAbilityTooltip: PanelEventDefinition<[string]>;
    DOTAShowAbilityTooltipForEntityIndex: PanelEventDefinition<[string, number]>;
    DOTAShowAbilityTooltipForGuide: PanelEventDefinition<[string, string]>;
    DOTAShowAbilityTooltipForHero: PanelEventDefinition<[string, number, boolean]>;
    DOTAShowAbilityTooltipForLevel: PanelEventDefinition<[string, number]>;
    DOTAShowBuffTooltip: PanelEventDefinition<[number, number, boolean]>;
    DOTAShowEconItemTooltip: PanelEventDefinition<[number, number, number]>;
    DOTAShowProfileCardBattleCupTooltip: PanelEventDefinition<[number]>;
    DOTAShowProfileCardTooltip: PanelEventDefinition<[number, boolean]>;
    DOTAShowRankTierTooltip: PanelEventDefinition<[number]>;
    DOTAShowRuneTooltip: PanelEventDefinition<[number, number, number]>;
    DOTAShowTextTooltip: PanelEventDefinition<[string]>;
    DOTAShowTextTooltipStyled: PanelEventDefinition<[string, string]>;
    DOTAShowTI10EventGameTooltip: PanelEventDefinition<[number]>;
    DOTAShowTitleImageTextTooltip: PanelEventDefinition<[string, string, string]>;
    DOTAShowTitleImageTextTooltipStyled: PanelEventDefinition<[string, string, string, string]>;
    DOTAShowTitleTextTooltip: PanelEventDefinition<[string, string]>;
    DOTAShowTitleTextTooltipStyled: PanelEventDefinition<[string, string, string]>;
    DropInputFocus: EventDefinition | PanelEventDefinition;
    IfHasClassEvent: PanelEventDefinition<[string, string]>;
    IfHoverOtherEvent: PanelEventDefinition<[string, string]>;
    IfNotHasClassEvent: PanelEventDefinition<[string, string]>;
    IfNotHoverOtherEvent: PanelEventDefinition<[string, string]>;
    MovePanelDown: PanelEventDefinition<[number]>;
    MovePanelLeft: PanelEventDefinition<[number]>;
    MovePanelRight: PanelEventDefinition<[number]>;
    MovePanelUp: PanelEventDefinition<[number]>;
    PageDown: EventDefinition;
    PageLeft: EventDefinition;
    PagePanelDown: PanelEventDefinition;
    PagePanelLeft: PanelEventDefinition;
    PagePanelRight: PanelEventDefinition;
    PagePanelUp: PanelEventDefinition;
    PageRight: EventDefinition;
    PageUp: EventDefinition;
    RemoveStyle: PanelEventDefinition<[string]>;
    RemoveStyleAfterDelay: PanelEventDefinition<[string, number]>;
    RemoveStyleFromEachChild: PanelEventDefinition<[string]>;
    ScrollDown: EventDefinition;
    ScrollLeft: EventDefinition;
    ScrollPanelDown: PanelEventDefinition;
    ScrollPanelLeft: PanelEventDefinition;
    ScrollPanelRight: PanelEventDefinition;
    ScrollPanelUp: PanelEventDefinition;
    ScrollRight: EventDefinition;
    ScrollToBottom: PanelEventDefinition;
    ScrollToTop: PanelEventDefinition;
    ScrollUp: EventDefinition;
    SetChildPanelsSelected: PanelEventDefinition<[boolean]>;
    SetInputFocus: PanelEventDefinition;
    SetPanelEnabled: PanelEventDefinition<[boolean]>;
    SetPanelSelected: PanelEventDefinition<[boolean]>;
    SwitchStyle: PanelEventDefinition<[string, string]>;
    TogglePanelSelected: PanelEventDefinition;
    ToggleStyle: PanelEventDefinition<[string]>;
    TriggerStyle: PanelEventDefinition<[string]>;

    // 这些是不知道通过什么地方收集起来的
    DismissAllContextMenus: EventDefinition;
    BrowserGoToURL: EventDefinition<[string]>;
    ExternalBrowserGoToURL: EventDefinition<[string]>;
    UIShowCustomLayoutParametersTooltip: PanelEventDefinition<[Panel, string, string, string]>;
    UIHideCustomLayoutTooltip: PanelEventDefinition<[string]>;
    DOTAHUDGameDisconnect: EventDefinition;
    DOTAShowMatchDetails: EventDefinition<[number]>;
    PlaySoundEffect: EventDefinition<[string]>;
    UIShowCustomLayoutTooltip: PanelEventDefinition<[Panel, string, string, string]>;
}
export declare interface DotaEventHandlers extends PanoramaEventHandlers {
    DOTAScenePanelSceneLoaded: PanelEventDefinition;
    DOTAScenePanelSceneUnloaded: PanelEventDefinition;
    DOTAScenePanelCameraLerpFinished: PanelEventDefinition;
    DOTAScenePanelSetRotationSpeed: PanelEventDefinition<[number]>;
    DOTASceneFireEntityInput: PanelEventDefinition<[string, string, string | number]>;
    DOTAScenePanelSimulateWorld: PanelEventDefinition<[number]>;
    DOTAScenePanelEntityClicked: PanelEventDefinition<[string]>;
    DOTAScenePanelEntityMouseOver: PanelEventDefinition<[string]>;
    DOTAScenePanelEntityMouseOut: PanelEventDefinition<[string]>;
    DOTASceneSetCameraEntity: EventDefinition<[string, number]>;
    DOTAScenePanelResetRotation: EventDefinition;
    DOTAGlobalSceneSetCameraEntity: EventDefinition<[string, string, number]>;
    DOTAGlobalSceneSetRootEntity: EventDefinition<[string, string]>;
    DOTAScenePanelDumpState: EventDefinition;
    DOTAShowReferencePage: EventDefinition<[string]>; // the xml file to load
    DOTAShowReferencePageStyled: EventDefinition<[string, string]>; // the xml file to load, plus a css class to set

    UIResetAllPortraitInfo: EventDefinition;

    DOTAMuertaCalaveraClosed: EventDefinition<[number]>;
    DOTANavigateMuertaCalaveraBackward: EventDefinition;
    DOTANavigateMuertaCalaveraForward: EventDefinition;

    DOTAMuertaOfrendaStateChanged: PanelEventDefinition<[number]>;
    DOTASetMuertaOfrendaState: PanelEventDefinition<[number]>;
    DOTAShowMuertaCalaveraPage: PanelEventDefinition<[number]>;
    DOTAMuertaDebutClosed: PanelEventDefinition;
    DOTASetMuertaModelRevealedState: PanelEventDefinition<[string, boolean]>;

    PostGameProgressConfirmAbusiveCoachRating: PanelEventDefinition;
    PostGameProgressSkippingAhead: EventDefinition;
    PostGameProgressConfirmAbusiveCoachRatingFinished: EventDefinition<[boolean, string]>;

    DOTAPlayButtonClicked: EventDefinition;
    DOTAToggleRankedMatch: EventDefinition;
    DOTAPlayPanelCloseButtonClicked: EventDefinition<[boolean]>;
    DOTACancelFindMatch: EventDefinition;
    DOTAPlayAcceptMatch: EventDefinition;
    DOTAPlayDeclineMatch: EventDefinition;
    DOTAToggleExpandGameModes: EventDefinition;
    DOTAWeekendTourneyStartSetup: EventDefinition;
    DOTAOpenLobbySelector: EventDefinition;
    DOTACreateLobby: EventDefinition;
    DOTALobbyStartWithoutTeamsOrLeagueSetConfirmed: EventDefinition;
    DOTAJoinLobby: EventDefinition<[number]>;
    DOTAGameModeToggled: PanelEventDefinition<[boolean]>;
    DOTAGameModeShowAllToggled: EventDefinition;
    DOTAPlaySectionRadioChecked: EventDefinition<[number]>;
    DOTABotScriptIndexChecked: EventDefinition<[number]>;
    DOTABotDifficultyChecked: EventDefinition<[number]>;
    DOTABotSoloDifficultyChecked: EventDefinition<[number]>;
    DOTAPracticeBotsTeamRadioChecked: EventDefinition<[number]>;
    DOTAPlayBotsCoopOrSoloRadioChecked: EventDefinition<[boolean]>;
    DOTAOpenMatchmakingLanguage: EventDefinition;
    DOTAOpenMatchmakingRegion: EventDefinition;
    DOTAMatchmakingRegionApply: EventDefinition;
    DOTAMatchmakingRegionCancel: EventDefinition;
    DOTAAbandonClicked: EventDefinition;
    DOTAAbandonConfirm: EventDefinition;
    DOTADisconnectClicked: EventDefinition;
    DOTAReconnectClicked: EventDefinition;
    DOTAConfirmLocalLobbyDisconnect: EventDefinition;
    DOTAUpdateMatchGroupPingUI: EventDefinition<[number]>;
    DOTAPlayUpdateWaitingTimer: EventDefinition;
    DOTAPlayUpdateMatchDeniedLabels: EventDefinition;
    DOTAUpdateMatchmakingStats: EventDefinition<[boolean]>;
    DOTAOnEngineLoopModeChanged: EventDefinition<[string]>;
    DOTASetFindingMatch: EventDefinition<[boolean]>;
    DOTALobbyClosed: EventDefinition;
    DOTAUseTeamIdentityCheckClicked: PanelEventDefinition;
    DOTAPlayChangeTeamIdentity: EventDefinition<[number]>;
    DOTAJoinPlaytestButtonClicked: EventDefinition;
    DOTAOpenPlayTab: EventDefinition<[number]>;
    DOTAHidePlayTab: EventDefinition;
    DOTAStartFindingEventMatch: EventDefinition<[number]>; // nEventType
    DOTAStartFindingMatch: EventDefinition<[number, number]>;
    DOTASetupPlayDOTAForMatch: EventDefinition<[number, number]>;
    DOTALaunchBotPractice: EventDefinition<[number, number]>; //bot difficulty, team number
    DOTAAnchorSteamPhone: EventDefinition;
    DOTARankedModeRadioChecked: EventDefinition<[number]>;

    DOTACavernCrawlPostGameProgressComplete: EventDefinition;
    DOTACavernCrawlSelectRoom: EventDefinition<[number]>;
    DOTACavernCrawlSelectPath: EventDefinition<[number]>;
    DOTACavernCrawlDisplayingUpdates: EventDefinition<[boolean]>;
    DOTACavernCrawlPreDisplayingUpdate: EventDefinition<[[number, number]]>;
    DOTACavernCrawlDisplayingUpdate: EventDefinition<[number, string]>;
    DOTACavernCrawlUpdateClaimCountUI: EventDefinition<[number, number]>;
    DOTACavernCrawlFlareShooting: PanelEventDefinition<[boolean]>;
    DOTACavernCrawlAdvanceUpdates: PanelEventDefinition;
    DOTACavernCrawlDebugSwapChallenge: EventDefinition<[number, number]>;
    DOTACavernCrawlDebugRevealReward: EventDefinition<[number, number]>;
    DOTACavernCrawlShowPathParticles: PanelEventDefinition;

    DOTALeagueShowBattlePassRollup: EventDefinition<[number, number]>; //LeagueID
    DOTASetCurrentDashboardPageFullscreen: EventDefinition<[boolean]>;
    DOTAToggleCurrentDashboardPageFullscreen: EventDefinition;
    DOTASetWatchMenuVisible: EventDefinition<[boolean]>;

    DOTAPostGameLeave: EventDefinition;
    DOTAMatchDetailsRefreshExistencePostGame: EventDefinition<[number]>;
    OverviewHeroDislikePlayer: EventDefinition;
    OverviewHeroCommendPlayer: EventDefinition;
    OverviewHeroReportPlayer: EventDefinition;
    OverviewHeroExpand: PanelEventDefinition;
    OverviewHeroExpandSlot: EventDefinition<[number]>;
    OverviewHeroContract: PanelEventDefinition;
    OverviewHeroContractSlot: EventDefinition<[number]>;
    OverviewHeroHoverSlot: EventDefinition<[number, boolean]>;
    OverviewHeroShowContextMenu: EventDefinition;
    DOTARequestReplayAvailableNotification: EventDefinition;
    DOTAShowReplayPendingPopup: EventDefinition;
    DOTAPostGameShowNetWorthTooltip: PanelEventDefinition<[number]>;
    DOTAPostGameHideNetWorthTooltip: PanelEventDefinition;
    DOTAPostGameShowHeroDamageTooltip: PanelEventDefinition<[number]>;
    DOTAPostGameHideHeroDamageTooltip: PanelEventDefinition;
    DOTAPostGameShowPlayerItemsTooltip: PanelEventDefinition<[number, number, number]>;
    DOTAPostGameHidePlayerItemsTooltip: PanelEventDefinition;
    DOTAPostGameToggleTeamSelected: PanelEventDefinition<[number]>;
    DOTAPostGameShowPersonalGraphTooltip: PanelEventDefinition<[number, number, number, number]>;
    DOTAPostGameHidePersonalGraphTooltip: PanelEventDefinition;
    DOTAPostGameTogglePinnedPlayerSelected: EventDefinition<[number]>;
    DOTAPostGameSwitchGraph: EventDefinition<[string]>;
    DOTAPostGameSwitchPersonalGraph: EventDefinition<[string]>;
    DOTAPostGameRenderGraph: EventDefinition;
    DOTAPostGameRenderPersonalGraph: EventDefinition;
    DOTAPostGameGraphHighlightSlot: EventDefinition<[number]>;
    DOTAPostGamePlayerReevaluateControls: EventDefinition;
    DOTADownloadReplay: EventDefinition;
    DOTAProcessQueuedPostGameHeroPanels: EventDefinition;
    DOTAWatchReplay: EventDefinition<[boolean]>;
    DOTAUpdatePlusPerPlayerTables: EventDefinition<[number]>;
    DOTAPostGameVoteGuideUp: EventDefinition;
    DOTAPostGameVoteGuideDown: EventDefinition;
    DOTAPostGameToggleFavoriteGuide: EventDefinition;
    DOTAPostGameProgressAnimationComplete: EventDefinition;
    DOTAPostGameProgressShowSummary: EventDefinition;
    DOTAPostGameSetSkillTier: EventDefinition<[number]>;
    OverviewHeroCheckDebugHero: EventDefinition;
    DOTAToggleMorokaiPostGame: EventDefinition;
    DOTAPostGameGraphsFirstLayout: EventDefinition;
    DOTAPostGamePersonalGraphsFirstLayout: EventDefinition;
    DOTAPostGameShowMVPProgress: EventDefinition;

    DOTASetDashboardBackgroundVisible: PanelEventDefinition<[boolean]>;
    DOTASetDashboardBackgroundLayout: PanelEventDefinition<[string]>;

    DOTABattleReportIncrementActiveScreen: EventDefinition<[number]>;
    DOTABattleReportSetActiveScreen: EventDefinition<[number]>;
    DOTABattleReportSetNavEnabled: EventDefinition<[boolean]>;
    DOTABattleReportFinished: EventDefinition;

    DOTAMatchSubmitPlayerMatchSurvey: EventDefinition<[number, number, number]>;
    DOTALastMatchUpdated: EventDefinition;
}
