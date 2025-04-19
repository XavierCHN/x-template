declare type PanoramaPanelEventDefinition<Args extends any[] = []> = (panel: Panel, ...args: Args) => void;
declare type PanoramaEventDefinition<Args extends any[] = []> = (this: void, ...args: Args) => void;
declare type PanoramaEventParams<T> = T extends PanoramaEventDefinition<infer Args> ? Args : never;

/**
 *
 * 这个部分没有开源，因此我们手动完成
 */
declare interface PanoramaEventHandlers {
    // 以下这些来自 https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Panorama/Events
    AddStyle: PanoramaPanelEventDefinition<[string]>;
    AddStyleAfterDelay: PanoramaPanelEventDefinition<[string, number]>;
    AddStyleToEachChild: PanoramaPanelEventDefinition<[string]>;
    AddTimedStyle: PanoramaPanelEventDefinition<[string, number, number]>;
    AsyncEvent: PanoramaEventDefinition<[number, string]>;
    DOTADisplayDashboardTip: PanoramaEventDefinition<[string, string]>;
    DOTAHideAbilityTooltip: PanoramaEventDefinition | PanoramaPanelEventDefinition;
    DOTAHideBuffTooltip: PanoramaEventDefinition | PanoramaPanelEventDefinition;
    DOTAHideDroppedItemTooltip: PanoramaEventDefinition | PanoramaPanelEventDefinition;
    DOTAHideEconItemTooltip: PanoramaEventDefinition | PanoramaPanelEventDefinition;
    DOTAHideProfileCardBattleCupTooltip: PanoramaEventDefinition | PanoramaPanelEventDefinition;
    DOTAHideProfileCardTooltip: PanoramaEventDefinition | PanoramaPanelEventDefinition;
    DOTAHideRankTierTooltip: PanoramaEventDefinition | PanoramaPanelEventDefinition;
    DOTAHideRuneTooltip: PanoramaEventDefinition | PanoramaPanelEventDefinition;
    DOTAHideTextTooltip: PanoramaEventDefinition | PanoramaPanelEventDefinition;
    DOTAHideTI10EventGameTooltip: PanoramaPanelEventDefinition;
    DOTAHideTitleImageTextTooltip: PanoramaPanelEventDefinition;
    DOTAHideTitleTextTooltip: PanoramaPanelEventDefinition;
    DOTALiveStreamUpcoming: PanoramaPanelEventDefinition<[number]>;
    DOTALiveStreamVideoLive: PanoramaPanelEventDefinition<[boolean]>;
    DOTALiveStreamVideoPlaying: PanoramaPanelEventDefinition<[boolean]>;
    DOTAShowAbilityInventoryItemTooltip: PanoramaPanelEventDefinition<[number, number]>;
    DOTAShowAbilityShopItemTooltip: PanoramaPanelEventDefinition<[string, string, number]>;
    DOTAShowAbilityTooltip: PanoramaPanelEventDefinition<[string]>;
    DOTAShowAbilityTooltipForEntityIndex: PanoramaPanelEventDefinition<[string, number]>;
    DOTAShowAbilityTooltipForGuide: PanoramaPanelEventDefinition<[string, string]>;
    DOTAShowAbilityTooltipForHero: PanoramaPanelEventDefinition<[string, number, boolean]>;
    DOTAShowAbilityTooltipForLevel: PanoramaPanelEventDefinition<[string, number]>;
    DOTAShowBuffTooltip: PanoramaPanelEventDefinition<[number, number, boolean]>;
    DOTAShowEconItemTooltip: PanoramaPanelEventDefinition<[number, number, number]>;
    DOTAShowProfileCardBattleCupTooltip: PanoramaPanelEventDefinition<[number]>;
    DOTAShowProfileCardTooltip: PanoramaPanelEventDefinition<[number, boolean]>;
    DOTAShowRankTierTooltip: PanoramaPanelEventDefinition<[number]>;
    DOTAShowRuneTooltip: PanoramaPanelEventDefinition<[number, number, number]>;
    DOTAShowTextTooltip: PanoramaPanelEventDefinition<[string]>;
    DOTAShowTextTooltipStyled: PanoramaPanelEventDefinition<[string, string]>;
    DOTAShowTI10EventGameTooltip: PanoramaPanelEventDefinition<[number]>;
    DOTAShowTitleImageTextTooltip: PanoramaPanelEventDefinition<[string, string, string]>;
    DOTAShowTitleImageTextTooltipStyled: PanoramaPanelEventDefinition<[string, string, string, string]>;
    DOTAShowTitleTextTooltip: PanoramaPanelEventDefinition<[string, string]>;
    DOTAShowTitleTextTooltipStyled: PanoramaPanelEventDefinition<[string, string, string]>;
    DropInputFocus: PanoramaEventDefinition | PanoramaPanelEventDefinition;
    IfHasClassEvent: PanoramaPanelEventDefinition<[string, string]>;
    IfHoverOtherEvent: PanoramaPanelEventDefinition<[string, string]>;
    IfNotHasClassEvent: PanoramaPanelEventDefinition<[string, string]>;
    IfNotHoverOtherEvent: PanoramaPanelEventDefinition<[string, string]>;
    MovePanelDown: PanoramaPanelEventDefinition<[number]>;
    MovePanelLeft: PanoramaPanelEventDefinition<[number]>;
    MovePanelRight: PanoramaPanelEventDefinition<[number]>;
    MovePanelUp: PanoramaPanelEventDefinition<[number]>;
    PageDown: PanoramaEventDefinition;
    PageLeft: PanoramaEventDefinition;
    PagePanelDown: PanoramaPanelEventDefinition;
    PagePanelLeft: PanoramaPanelEventDefinition;
    PagePanelRight: PanoramaPanelEventDefinition;
    PagePanelUp: PanoramaPanelEventDefinition;
    PageRight: PanoramaEventDefinition;
    PageUp: PanoramaEventDefinition;
    RemoveStyle: PanoramaPanelEventDefinition<[string]>;
    RemoveStyleAfterDelay: PanoramaPanelEventDefinition<[string, number]>;
    RemoveStyleFromEachChild: PanoramaPanelEventDefinition<[string]>;
    ScrollDown: PanoramaEventDefinition;
    ScrollLeft: PanoramaEventDefinition;
    ScrollPanelDown: PanoramaPanelEventDefinition;
    ScrollPanelLeft: PanoramaPanelEventDefinition;
    ScrollPanelRight: PanoramaPanelEventDefinition;
    ScrollPanelUp: PanoramaPanelEventDefinition;
    ScrollRight: PanoramaEventDefinition;
    ScrollToBottom: PanoramaPanelEventDefinition;
    ScrollToTop: PanoramaPanelEventDefinition;
    ScrollUp: PanoramaEventDefinition;
    SetChildPanelsSelected: PanoramaPanelEventDefinition<[boolean]>;
    SetInputFocus: PanoramaPanelEventDefinition;
    SetPanelEnabled: PanoramaPanelEventDefinition<[boolean]>;
    SetPanelSelected: PanoramaPanelEventDefinition<[boolean]>;
    SwitchStyle: PanoramaPanelEventDefinition<[string, string]>;
    TogglePanelSelected: PanoramaPanelEventDefinition;
    ToggleStyle: PanoramaPanelEventDefinition<[string]>;
    TriggerStyle: PanoramaPanelEventDefinition<[string]>;

    // 这些是不知道通过什么地方收集起来的
    DismissAllContextMenus: PanoramaEventDefinition;
    BrowserGoToURL: PanoramaEventDefinition<[string]>;
    ExternalBrowserGoToURL: PanoramaEventDefinition<[string]>;
    UIShowCustomLayoutParametersTooltip: PanoramaPanelEventDefinition<[string, string, string]>;
    UIHideCustomLayoutTooltip: PanoramaPanelEventDefinition<[string]>;
    DOTAHUDGameDisconnect: PanoramaEventDefinition;
    DOTAShowMatchDetails: PanoramaEventDefinition<[number]>;
    PlaySoundEffect: PanoramaEventDefinition<[string]>;
    UIShowCustomLayoutTooltip: PanoramaPanelEventDefinition<[string, string, string]>;
}
declare interface DotaEventHandlers extends PanoramaEventHandlers {
    DOTAScenePanelSceneLoaded: PanoramaPanelEventDefinition;
    DOTAScenePanelSceneUnloaded: PanoramaPanelEventDefinition;
    DOTAScenePanelCameraLerpFinished: PanoramaPanelEventDefinition;
    DOTAScenePanelSetRotationSpeed: PanoramaPanelEventDefinition<[number]>;
    DOTASceneFireEntityInput: PanoramaPanelEventDefinition<[string, string, string | number]>;
    DOTAScenePanelSimulateWorld: PanoramaPanelEventDefinition<[number]>;
    DOTAScenePanelEntityClicked: PanoramaPanelEventDefinition<[string]>;
    DOTAScenePanelEntityMouseOver: PanoramaPanelEventDefinition<[string]>;
    DOTAScenePanelEntityMouseOut: PanoramaPanelEventDefinition<[string]>;
    DOTASceneSetCameraEntity: PanoramaEventDefinition<[string, number]>;
    DOTAScenePanelResetRotation: PanoramaEventDefinition;
    DOTAGlobalSceneSetCameraEntity: PanoramaEventDefinition<[string, string, number]>;
    DOTAGlobalSceneSetRootEntity: PanoramaEventDefinition<[string, string]>;
    DOTAScenePanelDumpState: PanoramaEventDefinition;
    DOTAShowReferencePage: PanoramaEventDefinition<[string]>; // the xml file to load
    DOTAShowReferencePageStyled: PanoramaEventDefinition<[string, string]>; // the xml file to load, plus a css class to set

    UIResetAllPortraitInfo: PanoramaEventDefinition;

    DOTAMuertaCalaveraClosed: PanoramaEventDefinition<[number]>;
    DOTANavigateMuertaCalaveraBackward: PanoramaEventDefinition;
    DOTANavigateMuertaCalaveraForward: PanoramaEventDefinition;

    DOTAMuertaOfrendaStateChanged: PanoramaPanelEventDefinition<[number]>;
    DOTASetMuertaOfrendaState: PanoramaPanelEventDefinition<[number]>;
    DOTAShowMuertaCalaveraPage: PanoramaPanelEventDefinition<[number]>;
    DOTAMuertaDebutClosed: PanoramaPanelEventDefinition;
    DOTASetMuertaModelRevealedState: PanoramaPanelEventDefinition<[string, boolean]>;

    PostGameProgressConfirmAbusiveCoachRating: PanoramaPanelEventDefinition;
    PostGameProgressSkippingAhead: PanoramaEventDefinition;
    PostGameProgressConfirmAbusiveCoachRatingFinished: PanoramaEventDefinition<[boolean, string]>;

    DOTAPlayButtonClicked: PanoramaEventDefinition;
    DOTAToggleRankedMatch: PanoramaEventDefinition;
    DOTAPlayPanelCloseButtonClicked: PanoramaEventDefinition<[boolean]>;
    DOTACancelFindMatch: PanoramaEventDefinition;
    DOTAPlayAcceptMatch: PanoramaEventDefinition;
    DOTAPlayDeclineMatch: PanoramaEventDefinition;
    DOTAToggleExpandGameModes: PanoramaEventDefinition;
    DOTAWeekendTourneyStartSetup: PanoramaEventDefinition;
    DOTAOpenLobbySelector: PanoramaEventDefinition;
    DOTACreateLobby: PanoramaEventDefinition;
    DOTALobbyStartWithoutTeamsOrLeagueSetConfirmed: PanoramaEventDefinition;
    DOTAJoinLobby: PanoramaEventDefinition<[number]>;
    DOTAGameModeToggled: PanoramaPanelEventDefinition<[boolean]>;
    DOTAGameModeShowAllToggled: PanoramaEventDefinition;
    DOTAPlaySectionRadioChecked: PanoramaEventDefinition<[number]>;
    DOTABotScriptIndexChecked: PanoramaEventDefinition<[number]>;
    DOTABotDifficultyChecked: PanoramaEventDefinition<[number]>;
    DOTABotSoloDifficultyChecked: PanoramaEventDefinition<[number]>;
    DOTAPracticeBotsTeamRadioChecked: PanoramaEventDefinition<[number]>;
    DOTAPlayBotsCoopOrSoloRadioChecked: PanoramaEventDefinition<[boolean]>;
    DOTAOpenMatchmakingLanguage: PanoramaEventDefinition;
    DOTAOpenMatchmakingRegion: PanoramaEventDefinition;
    DOTAMatchmakingRegionApply: PanoramaEventDefinition;
    DOTAMatchmakingRegionCancel: PanoramaEventDefinition;
    DOTAAbandonClicked: PanoramaEventDefinition;
    DOTAAbandonConfirm: PanoramaEventDefinition;
    DOTADisconnectClicked: PanoramaEventDefinition;
    DOTAReconnectClicked: PanoramaEventDefinition;
    DOTAConfirmLocalLobbyDisconnect: PanoramaEventDefinition;
    DOTAUpdateMatchGroupPingUI: PanoramaEventDefinition<[number]>;
    DOTAPlayUpdateWaitingTimer: PanoramaEventDefinition;
    DOTAPlayUpdateMatchDeniedLabels: PanoramaEventDefinition;
    DOTAUpdateMatchmakingStats: PanoramaEventDefinition<[boolean]>;
    DOTAOnEngineLoopModeChanged: PanoramaEventDefinition<[string]>;
    DOTASetFindingMatch: PanoramaEventDefinition<[boolean]>;
    DOTALobbyClosed: PanoramaEventDefinition;
    DOTAUseTeamIdentityCheckClicked: PanoramaPanelEventDefinition;
    DOTAPlayChangeTeamIdentity: PanoramaEventDefinition<[number]>;
    DOTAJoinPlaytestButtonClicked: PanoramaEventDefinition;
    DOTAOpenPlayTab: PanoramaEventDefinition<[number]>;
    DOTAHidePlayTab: PanoramaEventDefinition;
    DOTAStartFindingEventMatch: PanoramaEventDefinition<[number]>; // nEventType
    DOTAStartFindingMatch: PanoramaEventDefinition<[number, number]>;
    DOTASetupPlayDOTAForMatch: PanoramaEventDefinition<[number, number]>;
    DOTALaunchBotPractice: PanoramaEventDefinition<[number, number]>; //bot difficulty, team number
    DOTAAnchorSteamPhone: PanoramaEventDefinition;
    DOTARankedModeRadioChecked: PanoramaEventDefinition<[number]>;

    DOTACavernCrawlPostGameProgressComplete: PanoramaEventDefinition;
    DOTACavernCrawlSelectRoom: PanoramaEventDefinition<[number]>;
    DOTACavernCrawlSelectPath: PanoramaEventDefinition<[number]>;
    DOTACavernCrawlDisplayingUpdates: PanoramaEventDefinition<[boolean]>;
    DOTACavernCrawlPreDisplayingUpdate: PanoramaEventDefinition<[[number, number]]>;
    DOTACavernCrawlDisplayingUpdate: PanoramaEventDefinition<[number, string]>;
    DOTACavernCrawlUpdateClaimCountUI: PanoramaEventDefinition<[number, number]>;
    DOTACavernCrawlFlareShooting: PanoramaPanelEventDefinition<[boolean]>;
    DOTACavernCrawlAdvanceUpdates: PanoramaPanelEventDefinition;
    DOTACavernCrawlDebugSwapChallenge: PanoramaEventDefinition<[number, number]>;
    DOTACavernCrawlDebugRevealReward: PanoramaEventDefinition<[number, number]>;
    DOTACavernCrawlShowPathParticles: PanoramaPanelEventDefinition;

    DOTALeagueShowBattlePassRollup: PanoramaEventDefinition<[number, number]>; //LeagueID
    DOTASetCurrentDashboardPageFullscreen: PanoramaEventDefinition<[boolean]>;
    DOTAToggleCurrentDashboardPageFullscreen: PanoramaEventDefinition;
    DOTASetWatchMenuVisible: PanoramaEventDefinition<[boolean]>;

    DOTAPostGameLeave: PanoramaEventDefinition;
    DOTAMatchDetailsRefreshExistencePostGame: PanoramaEventDefinition<[number]>;
    OverviewHeroDislikePlayer: PanoramaEventDefinition;
    OverviewHeroCommendPlayer: PanoramaEventDefinition;
    OverviewHeroReportPlayer: PanoramaEventDefinition;
    OverviewHeroExpand: PanoramaPanelEventDefinition;
    OverviewHeroExpandSlot: PanoramaEventDefinition<[number]>;
    OverviewHeroContract: PanoramaPanelEventDefinition;
    OverviewHeroContractSlot: PanoramaEventDefinition<[number]>;
    OverviewHeroHoverSlot: PanoramaEventDefinition<[number, boolean]>;
    OverviewHeroShowContextMenu: PanoramaEventDefinition;
    DOTARequestReplayAvailableNotification: PanoramaEventDefinition;
    DOTAShowReplayPendingPopup: PanoramaEventDefinition;
    DOTAPostGameShowNetWorthTooltip: PanoramaPanelEventDefinition<[number]>;
    DOTAPostGameHideNetWorthTooltip: PanoramaPanelEventDefinition;
    DOTAPostGameShowHeroDamageTooltip: PanoramaPanelEventDefinition<[number]>;
    DOTAPostGameHideHeroDamageTooltip: PanoramaPanelEventDefinition;
    DOTAPostGameShowPlayerItemsTooltip: PanoramaPanelEventDefinition<[number, number, number]>;
    DOTAPostGameHidePlayerItemsTooltip: PanoramaPanelEventDefinition;
    DOTAPostGameToggleTeamSelected: PanoramaPanelEventDefinition<[number]>;
    DOTAPostGameShowPersonalGraphTooltip: PanoramaPanelEventDefinition<[number, number, number, number]>;
    DOTAPostGameHidePersonalGraphTooltip: PanoramaPanelEventDefinition;
    DOTAPostGameTogglePinnedPlayerSelected: PanoramaEventDefinition<[number]>;
    DOTAPostGameSwitchGraph: PanoramaEventDefinition<[string]>;
    DOTAPostGameSwitchPersonalGraph: PanoramaEventDefinition<[string]>;
    DOTAPostGameRenderGraph: PanoramaEventDefinition;
    DOTAPostGameRenderPersonalGraph: PanoramaEventDefinition;
    DOTAPostGameGraphHighlightSlot: PanoramaEventDefinition<[number]>;
    DOTAPostGamePlayerReevaluateControls: PanoramaEventDefinition;
    DOTADownloadReplay: PanoramaEventDefinition;
    DOTAProcessQueuedPostGameHeroPanels: PanoramaEventDefinition;
    DOTAWatchReplay: PanoramaEventDefinition<[boolean]>;
    DOTAUpdatePlusPerPlayerTables: PanoramaEventDefinition<[number]>;
    DOTAPostGameVoteGuideUp: PanoramaEventDefinition;
    DOTAPostGameVoteGuideDown: PanoramaEventDefinition;
    DOTAPostGameToggleFavoriteGuide: PanoramaEventDefinition;
    DOTAPostGameProgressAnimationComplete: PanoramaEventDefinition;
    DOTAPostGameProgressShowSummary: PanoramaEventDefinition;
    DOTAPostGameSetSkillTier: PanoramaEventDefinition<[number]>;
    OverviewHeroCheckDebugHero: PanoramaEventDefinition;
    DOTAToggleMorokaiPostGame: PanoramaEventDefinition;
    DOTAPostGameGraphsFirstLayout: PanoramaEventDefinition;
    DOTAPostGamePersonalGraphsFirstLayout: PanoramaEventDefinition;
    DOTAPostGameShowMVPProgress: PanoramaEventDefinition;

    DOTASetDashboardBackgroundVisible: PanoramaPanelEventDefinition<[boolean]>;
    DOTASetDashboardBackgroundLayout: PanoramaPanelEventDefinition<[string]>;

    DOTABattleReportIncrementActiveScreen: PanoramaEventDefinition<[number]>;
    DOTABattleReportSetActiveScreen: PanoramaEventDefinition<[number]>;
    DOTABattleReportSetNavEnabled: PanoramaEventDefinition<[boolean]>;
    DOTABattleReportFinished: PanoramaEventDefinition;

    DOTAMatchSubmitPlayerMatchSurvey: PanoramaEventDefinition<[number, number, number]>;
    DOTALastMatchUpdated: PanoramaEventDefinition;
}
