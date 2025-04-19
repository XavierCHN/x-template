// 这些事件的参数尚未经过测试，待测试完成后将会被提交到TypescriptDeclarations仓库中

declare type PanelEventDefinition_t<Args extends any[] = []> = (panel: Panel, ...args: Args) => void;
declare type EventDefinition_t<Args extends any[] = []> = (this: void, ...args: Args) => void;
/**
 * 这个部分没有开源，因此我们手动完成
 */

declare interface PanoramaEventHandlers {
    // 以下这些来自 https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Panorama/Events
    AddStyle: PanelEventDefinition_t<[string]>;
    AddStyleAfterDelay: PanelEventDefinition_t<[string, number]>;
    AddStyleToEachChild: PanelEventDefinition_t<[string]>;
    AddTimedStyle: PanelEventDefinition_t<[string, number, number]>;
    AsyncEvent: PanelEventDefinition_t<[number, string]>;
    DOTADisplayDashboardTip: PanelEventDefinition_t<[string, string]>;
    DOTAHideAbilityTooltip: PanelEventDefinition_t;
    DOTAHideBuffTooltip: PanelEventDefinition_t;
    DOTAHideDroppedItemTooltip: PanelEventDefinition_t;
    DOTAHideEconItemTooltip: PanelEventDefinition_t;
    DOTAHideProfileCardBattleCupTooltip: PanelEventDefinition_t;
    DOTAHideProfileCardTooltip: PanelEventDefinition_t;
    DOTAHideRankTierTooltip: PanelEventDefinition_t;
    DOTAHideRuneTooltip: PanelEventDefinition_t;
    DOTAHideTextTooltip: PanelEventDefinition_t;
    DOTAHideTI10EventGameTooltip: PanelEventDefinition_t;
    DOTAHideTitleImageTextTooltip: PanelEventDefinition_t;
    DOTAHideTitleTextTooltip: PanelEventDefinition_t;
    DOTALiveStreamUpcoming: PanelEventDefinition_t<[number]>;
    DOTALiveStreamVideoLive: PanelEventDefinition_t<[boolean]>;
    DOTALiveStreamVideoPlaying: PanelEventDefinition_t<[boolean]>;
    DOTAShowAbilityInventoryItemTooltip: PanelEventDefinition_t<[number, number]>;
    DOTAShowAbilityShopItemTooltip: PanelEventDefinition_t<[string, string, number]>;
    DOTAShowAbilityTooltip: PanelEventDefinition_t<[string]>;
    DOTAShowAbilityTooltipForEntityIndex: PanelEventDefinition_t<[string, number]>;
    DOTAShowAbilityTooltipForGuide: PanelEventDefinition_t<[string, string]>;
    DOTAShowAbilityTooltipForHero: PanelEventDefinition_t<[string, number, boolean]>;
    DOTAShowAbilityTooltipForLevel: PanelEventDefinition_t<[string, number]>;
    DOTAShowBuffTooltip: PanelEventDefinition_t<[number, number, boolean]>;
    DOTAShowEconItemTooltip: PanelEventDefinition_t<[number, number, number]>;
    DOTAShowProfileCardBattleCupTooltip: PanelEventDefinition_t<[number]>;
    DOTAShowProfileCardTooltip: PanelEventDefinition_t<[number, boolean]>;
    DOTAShowRankTierTooltip: PanelEventDefinition_t<[number]>;
    DOTAShowRuneTooltip: PanelEventDefinition_t<[number, number, number]>;
    DOTAShowTextTooltip: PanelEventDefinition_t<[string]>;
    DOTAShowTextTooltipStyled: PanelEventDefinition_t<[string, string]>;
    DOTAShowTI10EventGameTooltip: PanelEventDefinition_t<[number]>;
    DOTAShowTitleImageTextTooltip: PanelEventDefinition_t<[string, string, string]>;
    DOTAShowTitleImageTextTooltipStyled: PanelEventDefinition_t<[string, string, string, string]>;
    DOTAShowTitleTextTooltip: PanelEventDefinition_t<[string, string]>;
    DOTAShowTitleTextTooltipStyled: PanelEventDefinition_t<[string, string, string]>;
    DropInputFocus: PanelEventDefinition_t;
    IfHasClassEvent: PanelEventDefinition_t<[string, string]>;
    IfHoverOtherEvent: PanelEventDefinition_t<[string, string]>;
    IfNotHasClassEvent: PanelEventDefinition_t<[string, string]>;
    IfNotHoverOtherEvent: PanelEventDefinition_t<[string, string]>;
    MovePanelDown: PanelEventDefinition_t<[number]>;
    MovePanelLeft: PanelEventDefinition_t<[number]>;
    MovePanelRight: PanelEventDefinition_t<[number]>;
    MovePanelUp: PanelEventDefinition_t<[number]>;
    PageDown: EventDefinition_t;
    PageLeft: EventDefinition_t;
    PagePanelDown: PanelEventDefinition_t;
    PagePanelLeft: PanelEventDefinition_t;
    PagePanelRight: PanelEventDefinition_t;
    PagePanelUp: PanelEventDefinition_t;
    PageRight: EventDefinition_t;
    PageUp: EventDefinition_t;
    RemoveStyle: PanelEventDefinition_t<[string]>;
    RemoveStyleAfterDelay: PanelEventDefinition_t<[string, number]>;
    RemoveStyleFromEachChild: PanelEventDefinition_t<[string]>;
    ScrollDown: EventDefinition_t;
    ScrollLeft: EventDefinition_t;
    ScrollPanelDown: PanelEventDefinition_t;
    ScrollPanelLeft: PanelEventDefinition_t;
    ScrollPanelRight: PanelEventDefinition_t;
    ScrollPanelUp: PanelEventDefinition_t;
    ScrollRight: EventDefinition_t;
    ScrollToBottom: PanelEventDefinition_t;
    ScrollToTop: PanelEventDefinition_t;
    ScrollUp: EventDefinition_t;
    SetChildPanelsSelected: PanelEventDefinition_t<[boolean]>;
    SetInputFocus: PanelEventDefinition_t;
    SetPanelEnabled: PanelEventDefinition_t<[boolean]>;
    SetPanelSelected: PanelEventDefinition_t<[boolean]>;
    SwitchStyle: PanelEventDefinition_t<[string, string]>;
    TogglePanelSelected: PanelEventDefinition_t;
    ToggleStyle: PanelEventDefinition_t<[string]>;
    TriggerStyle: PanelEventDefinition_t<[string]>;

    // 这些是不知道通过什么地方收集起来的
    DismissAllContextMenus: EventDefinition_t;
    BrowserGoToURL: EventDefinition_t<[string]>;
    ExternalBrowserGoToURL: EventDefinition_t<[string]>;
    UIShowCustomLayoutParametersTooltip: PanelEventDefinition_t<[Panel, string, string, string]>;
    UIHideCustomLayoutTooltip: PanelEventDefinition_t<[string]>;
    DOTAHUDGameDisconnect: EventDefinition_t;
    DOTAShowMatchDetails: EventDefinition_t<[number]>;
    PlaySoundEffect: EventDefinition_t<[string]>;
    UIShowCustomLayoutTooltip: PanelEventDefinition_t<[Panel, string, string, string]>;
}
export declare interface DotaEventHandlers extends PanoramaEventHandlers {
    DOTAScenePanelSceneLoaded: PanelEventDefinition_t;
    DOTAScenePanelSceneUnloaded: PanelEventDefinition_t;
    DOTAScenePanelCameraLerpFinished: PanelEventDefinition_t;
    DOTAScenePanelSetRotationSpeed: PanelEventDefinition_t<[number]>;
    DOTASceneFireEntityInput: PanelEventDefinition_t<[string, string, string | number]>;
    DOTAScenePanelSimulateWorld: PanelEventDefinition_t<[number]>;
    DOTAScenePanelEntityClicked: PanelEventDefinition_t<[string]>;
    DOTAScenePanelEntityMouseOver: PanelEventDefinition_t<[string]>;
    DOTAScenePanelEntityMouseOut: PanelEventDefinition_t<[string]>;
    DOTASceneSetCameraEntity: EventDefinition_t<[string, number]>;
    DOTAScenePanelResetRotation: EventDefinition_t;
    DOTAGlobalSceneSetCameraEntity: EventDefinition_t<[string, string, number]>;
    DOTAGlobalSceneSetRootEntity: EventDefinition_t<[string, string]>;
    DOTAScenePanelDumpState: EventDefinition_t;
    DOTAShowReferencePage: EventDefinition_t<[string]>; // the xml file to load
    DOTAShowReferencePageStyled: EventDefinition_t<[string, string]>; // the xml file to load, plus a css class to set

    UIResetAllPortraitInfo: EventDefinition_t;

    DOTAMuertaCalaveraClosed: EventDefinition_t<[number]>;
    DOTANavigateMuertaCalaveraBackward: EventDefinition_t;
    DOTANavigateMuertaCalaveraForward: EventDefinition_t;

    DOTAMuertaOfrendaStateChanged: PanelEventDefinition_t<[number]>;
    DOTASetMuertaOfrendaState: PanelEventDefinition_t<[number]>;
    DOTAShowMuertaCalaveraPage: PanelEventDefinition_t<[number]>;
    DOTAMuertaDebutClosed: PanelEventDefinition_t;
    DOTASetMuertaModelRevealedState: PanelEventDefinition_t<[string, boolean]>;

    PostGameProgressConfirmAbusiveCoachRating: PanelEventDefinition_t;
    PostGameProgressSkippingAhead: EventDefinition_t;
    PostGameProgressConfirmAbusiveCoachRatingFinished: EventDefinition_t<[boolean, string]>;

    DOTAPlayButtonClicked: EventDefinition_t;
    DOTAToggleRankedMatch: EventDefinition_t;
    DOTAPlayPanelCloseButtonClicked: EventDefinition_t<[boolean]>;
    DOTACancelFindMatch: EventDefinition_t;
    DOTAPlayAcceptMatch: EventDefinition_t;
    DOTAPlayDeclineMatch: EventDefinition_t;
    DOTAToggleExpandGameModes: EventDefinition_t;
    DOTAWeekendTourneyStartSetup: EventDefinition_t;
    DOTAOpenLobbySelector: EventDefinition_t;
    DOTACreateLobby: EventDefinition_t;
    DOTALobbyStartWithoutTeamsOrLeagueSetConfirmed: EventDefinition_t;
    DOTAJoinLobby: EventDefinition_t<[number]>;
    DOTAGameModeToggled: PanelEventDefinition_t<[boolean]>;
    DOTAGameModeShowAllToggled: EventDefinition_t;
    DOTAPlaySectionRadioChecked: EventDefinition_t<[number]>;
    DOTABotScriptIndexChecked: EventDefinition_t<[number]>;
    DOTABotDifficultyChecked: EventDefinition_t<[number]>;
    DOTABotSoloDifficultyChecked: EventDefinition_t<[number]>;
    DOTAPracticeBotsTeamRadioChecked: EventDefinition_t<[number]>;
    DOTAPlayBotsCoopOrSoloRadioChecked: EventDefinition_t<[boolean]>;
    DOTAOpenMatchmakingLanguage: EventDefinition_t;
    DOTAOpenMatchmakingRegion: EventDefinition_t;
    DOTAMatchmakingRegionApply: EventDefinition_t;
    DOTAMatchmakingRegionCancel: EventDefinition_t;
    DOTAAbandonClicked: EventDefinition_t;
    DOTAAbandonConfirm: EventDefinition_t;
    DOTADisconnectClicked: EventDefinition_t;
    DOTAReconnectClicked: EventDefinition_t;
    DOTAConfirmLocalLobbyDisconnect: EventDefinition_t;
    DOTAUpdateMatchGroupPingUI: EventDefinition_t<[number]>;
    DOTAPlayUpdateWaitingTimer: EventDefinition_t;
    DOTAPlayUpdateMatchDeniedLabels: EventDefinition_t;
    DOTAUpdateMatchmakingStats: EventDefinition_t<[boolean]>;
    DOTAOnEngineLoopModeChanged: EventDefinition_t<[string]>;
    DOTASetFindingMatch: EventDefinition_t<[boolean]>;
    DOTALobbyClosed: EventDefinition_t;
    DOTAUseTeamIdentityCheckClicked: PanelEventDefinition_t;
    DOTAPlayChangeTeamIdentity: EventDefinition_t<[number]>;
    DOTAJoinPlaytestButtonClicked: EventDefinition_t;
    DOTAOpenPlayTab: EventDefinition_t<[number]>;
    DOTAHidePlayTab: EventDefinition_t;
    DOTAStartFindingEventMatch: EventDefinition_t<[number]>; // nEventType
    DOTAStartFindingMatch: EventDefinition_t<[number, number]>;
    DOTASetupPlayDOTAForMatch: EventDefinition_t<[number, number]>;
    DOTALaunchBotPractice: EventDefinition_t<[number, number]>; //bot difficulty, team number
    DOTAAnchorSteamPhone: EventDefinition_t;
    DOTARankedModeRadioChecked: EventDefinition_t<[number]>;

    DOTACavernCrawlPostGameProgressComplete: EventDefinition_t;
    DOTACavernCrawlSelectRoom: EventDefinition_t<[number]>;
    DOTACavernCrawlSelectPath: EventDefinition_t<[number]>;
    DOTACavernCrawlDisplayingUpdates: EventDefinition_t<[boolean]>;
    DOTACavernCrawlPreDisplayingUpdate: EventDefinition_t<[[number, number]]>;
    DOTACavernCrawlDisplayingUpdate: EventDefinition_t<[number, string]>;
    DOTACavernCrawlUpdateClaimCountUI: EventDefinition_t<[number, number]>;
    DOTACavernCrawlFlareShooting: PanelEventDefinition_t<[boolean]>;
    DOTACavernCrawlAdvanceUpdates: PanelEventDefinition_t;
    DOTACavernCrawlDebugSwapChallenge: EventDefinition_t<[number, number]>;
    DOTACavernCrawlDebugRevealReward: EventDefinition_t<[number, number]>;
    DOTACavernCrawlShowPathParticles: PanelEventDefinition_t;

    DOTALeagueShowBattlePassRollup: EventDefinition_t<[number, number]>; //LeagueID
    DOTASetCurrentDashboardPageFullscreen: EventDefinition_t<[boolean]>;
    DOTAToggleCurrentDashboardPageFullscreen: EventDefinition_t;
    DOTASetWatchMenuVisible: EventDefinition_t<[boolean]>;

    DOTAPostGameLeave: EventDefinition_t;
    DOTAMatchDetailsRefreshExistencePostGame: EventDefinition_t<[number]>;
    OverviewHeroDislikePlayer: EventDefinition_t;
    OverviewHeroCommendPlayer: EventDefinition_t;
    OverviewHeroReportPlayer: EventDefinition_t;
    OverviewHeroExpand: PanelEventDefinition_t;
    OverviewHeroExpandSlot: EventDefinition_t<[number]>;
    OverviewHeroContract: PanelEventDefinition_t;
    OverviewHeroContractSlot: EventDefinition_t<[number]>;
    OverviewHeroHoverSlot: EventDefinition_t<[number, boolean]>;
    OverviewHeroShowContextMenu: EventDefinition_t;
    DOTARequestReplayAvailableNotification: EventDefinition_t;
    DOTAShowReplayPendingPopup: EventDefinition_t;
    DOTAPostGameShowNetWorthTooltip: PanelEventDefinition_t<[number]>;
    DOTAPostGameHideNetWorthTooltip: PanelEventDefinition_t;
    DOTAPostGameShowHeroDamageTooltip: PanelEventDefinition_t<[number]>;
    DOTAPostGameHideHeroDamageTooltip: PanelEventDefinition_t;
    DOTAPostGameShowPlayerItemsTooltip: PanelEventDefinition_t<[number, number, number]>;
    DOTAPostGameHidePlayerItemsTooltip: PanelEventDefinition_t;
    DOTAPostGameToggleTeamSelected: PanelEventDefinition_t<[number]>;
    DOTAPostGameShowPersonalGraphTooltip: PanelEventDefinition_t<[number, number, number, number]>;
    DOTAPostGameHidePersonalGraphTooltip: PanelEventDefinition_t;
    DOTAPostGameTogglePinnedPlayerSelected: EventDefinition_t<[number]>;
    DOTAPostGameSwitchGraph: EventDefinition_t<[string]>;
    DOTAPostGameSwitchPersonalGraph: EventDefinition_t<[string]>;
    DOTAPostGameRenderGraph: EventDefinition_t;
    DOTAPostGameRenderPersonalGraph: EventDefinition_t;
    DOTAPostGameGraphHighlightSlot: EventDefinition_t<[number]>;
    DOTAPostGamePlayerReevaluateControls: EventDefinition_t;
    DOTADownloadReplay: EventDefinition_t;
    DOTAProcessQueuedPostGameHeroPanels: EventDefinition_t;
    DOTAWatchReplay: EventDefinition_t<[boolean]>;
    DOTAUpdatePlusPerPlayerTables: EventDefinition_t<[number]>;
    DOTAPostGameVoteGuideUp: EventDefinition_t;
    DOTAPostGameVoteGuideDown: EventDefinition_t;
    DOTAPostGameToggleFavoriteGuide: EventDefinition_t;
    DOTAPostGameProgressAnimationComplete: EventDefinition_t;
    DOTAPostGameProgressShowSummary: EventDefinition_t;
    DOTAPostGameSetSkillTier: EventDefinition_t<[number]>;
    OverviewHeroCheckDebugHero: EventDefinition_t;
    DOTAToggleMorokaiPostGame: EventDefinition_t;
    DOTAPostGameGraphsFirstLayout: EventDefinition_t;
    DOTAPostGamePersonalGraphsFirstLayout: EventDefinition_t;
    DOTAPostGameShowMVPProgress: EventDefinition_t;

    DOTASetDashboardBackgroundVisible: PanelEventDefinition_t<[boolean]>;
    DOTASetDashboardBackgroundLayout: PanelEventDefinition_t<[string]>;

    DOTABattleReportIncrementActiveScreen: EventDefinition_t<[number]>;
    DOTABattleReportSetActiveScreen: EventDefinition_t<[number]>;
    DOTABattleReportSetNavEnabled: EventDefinition_t<[boolean]>;
    DOTABattleReportFinished: EventDefinition_t;

    DOTAMatchSubmitPlayerMatchSurvey: EventDefinition_t<[number, number, number]>;
    DOTALastMatchUpdated: EventDefinition_t;
}
