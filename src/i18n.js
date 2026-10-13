// 多語言翻譯配置
const i18n = {
  zh: {
    // Header
    appName: 'NeonFlux',
    appSubtitle: '霓虹流',
    appDesc: '自定義歷史紀錄分類',
    searchPlaceholder: '搜尋標題或網址',
    
    // Buttons
    btnSync: '同步瀏覽記錄',
    btnCurtain: '隱私門簾（投影用）',
    btnSettings: '設定',
    btnCancel: '取消',
    btnSave: '儲存',
    btnClose: '關閉',
    btnBack: '返回',
    btnAddCategory: '新增分類',
    btnResetCategories: '重置為預設',
    btnAddMatcher: '新增規則',
    btnDeleteMatcher: '刪除規則',
    btnDeleteCategory: '刪除',
    btnMoveUp: '提高比對優先順序',
    btnMoveDown: '降低比對優先順序',
    btnExportSettings: '匯出設定',
    btnImportSettings: '匯入設定',
    btnLayoutEdit: '編輯排版',
    btnLayoutDone: '完成',
    layoutDropHint: '拖到這裡',
    catRuleCount: '{count} 條規則',
    catFilterAll: '全部',
    catFilterEnabled: '已啟用',
    catFilterDisabled: '已停用',
    catOrderHint: '順序 = 比對優先順序：同一網址符合多個分類時，排前面的優先',
    msgCategoryAtLeastOne: '至少需要一個分類',
    layoutWidth: '軌道寬度',
    layoutWidthWide: '寬',
    layoutWidthNormal: '標準',
    layoutWidthNarrow: '窄',
    layoutWidthNarrower: '很窄',
    layoutHint: '拖曳卡片調整位置 · Esc 取消',
    btnLayoutReset: '重置排版',
    cardEmpty: '沒有近期紀錄',
    btnScrollPrev: '上一軌',
    btnScrollNext: '下一軌',
    btnAddTrack: '新增軌道',
    btnRemoveTrack: '刪除空軌道',
    
    // Settings
    settingsTitle: '設定',
    settingsGeneral: '一般',
    settingsLanguage: '語言',
    settingsCategoryLimit: '分類顯示數量（上限）',
    settingsRecentDays: '僅顯示近 N 天',
    settingsSortMode: '排序模式',
    settingsSortLatest: '最新在前',
    settingsSortSmart: '智慧排序',
    settingsNormalizeGroup: '合併相同路徑（忽略參數）',
    settingsCategoryManagement: '分類管理（進階）',
    settingsBackup: '備份 / 還原',
    
    // Column count options
    
    // Category UI
    categoryLabel: '分類名稱',
    categoryKey: 'key（唯一）',
    categoryIcon: '自訂圖示 URL',
    matcherType: '規則類型',
    matcherValue: '例如：gitlab.com 或 ^https://docs\\.google\\.com',
    
    // Card
    cardItemCount: '共 {count} 項',
    
    // Focus dialog
    focusTitle: '聚焦檢視',
    
    // Footer
    footerText: '瀏覽記錄自動分類 · 本機儲存 · 隱私優先',
    footerRate: '給 5 星好評',
    
    // Messages
    msgCurtainHint: '點一下以顯示',
    msgCategoriesSaved: '分類已儲存',
    msgCategoriesError: '分類設定有誤：',
    msgCategoryRequired: '存在未填標題的分類',
    msgCategoryKeyInvalid: '存在無效 key 的分類',
    msgCategoryKeyDuplicate: '分類 key 重複：',
    msgCategoryJsonError: '分類 JSON 無法解析：',
    msgCategoryJsonArrayRequired: '必須是陣列',
    msgCategoryFieldRequired: '每個分類需包含 key 與 label',
    msgCurtainLocked: '門簾已暫時打開，但下次載入時將重新啟用',
    msgImportConfirm: '匯入將覆寫目前所有設定（分類規則、釘選與偏好），確定要繼續嗎？',
    msgImportSuccess: '設定已匯入並還原',
    msgImportError: '匯入失敗：',
    msgImportInvalid: '檔案格式不符，不是有效的 NeonFlux 備份檔',
    msgExportError: '匯出失敗：',

    // Language
    language: '語言',
    
    // Shortcuts
    shortcutsTitle: '快速連結',
    btnAddShortcut: '新增快速連結',
    shortcutUrlPlaceholder: '輸入網址',
    shortcutAdded: '快速連結已新增',
    shortcutRemoved: '快速連結已移除',
    shortcutInvalid: '無效的網址',
  },
  en: {
    // Header
    appName: 'NeonFlux',
    appSubtitle: 'Neon Flow',
    appDesc: 'Categorize your browsing history by workflow',
    searchPlaceholder: 'Search title or URL',
    
    // Buttons
    btnSync: 'Sync History',
    btnCurtain: 'Privacy Curtain (for presentations)',
    btnSettings: 'Settings',
    btnCancel: 'Cancel',
    btnSave: 'Save',
    btnClose: 'Close',
    btnBack: 'Back',
    btnAddCategory: 'Add Category',
    btnResetCategories: 'Reset to Default',
    btnAddMatcher: 'Add Rule',
    btnDeleteMatcher: 'Delete Rule',
    btnDeleteCategory: 'Delete',
    btnMoveUp: 'Raise match priority',
    btnMoveDown: 'Lower match priority',
    btnExportSettings: 'Export Settings',
    btnImportSettings: 'Import Settings',
    btnLayoutEdit: 'Edit layout',
    btnLayoutDone: 'Done',
    layoutDropHint: 'Drop here',
    catRuleCount: '{count} rules',
    catFilterAll: 'All',
    catFilterEnabled: 'Enabled',
    catFilterDisabled: 'Disabled',
    catOrderHint: 'Order = match priority: when a URL matches several categories, the higher one wins',
    msgCategoryAtLeastOne: 'At least one category is required',
    layoutWidth: 'Track width',
    layoutWidthWide: 'Wide',
    layoutWidthNormal: 'Normal',
    layoutWidthNarrow: 'Narrow',
    layoutWidthNarrower: 'Narrower',
    layoutHint: 'Drag cards to rearrange · Esc to cancel',
    btnLayoutReset: 'Reset layout',
    cardEmpty: 'No recent history',
    btnScrollPrev: 'Previous track',
    btnScrollNext: 'Next track',
    btnAddTrack: 'Add track',
    btnRemoveTrack: 'Remove empty track',
    
    // Settings
    settingsTitle: 'Settings',
    settingsGeneral: 'General',
    settingsLanguage: 'Language',
    settingsCategoryLimit: 'Category Display Limit',
    settingsRecentDays: 'Show only recent N days',
    settingsSortMode: 'Sort Mode',
    settingsSortLatest: 'Latest First',
    settingsSortSmart: 'Smart Sort',
    settingsNormalizeGroup: 'Group by Path (ignore params)',
    settingsCategoryManagement: 'Category Management (Advanced)',
    settingsBackup: 'Backup / Restore',
    
    // Column count options
    
    // Category UI
    categoryLabel: 'Category Name',
    categoryKey: 'Key (unique)',
    categoryIcon: 'Custom Icon URL',
    matcherType: 'Rule Type',
    matcherValue: 'e.g.: gitlab.com or ^https://docs\\.google\\.com',
    
    // Card
    cardItemCount: '{count} items',
    
    // Focus dialog
    focusTitle: 'Focus View',
    
    // Footer
    footerText: 'Auto-categorize browsing history · Local storage · Privacy first',
    footerRate: 'Rate us 5 stars',
    
    // Messages
    msgCurtainHint: 'Click to reveal',
    msgCategoriesSaved: 'Categories saved',
    msgCategoriesError: 'Category settings error: ',
    msgCategoryRequired: 'Category with missing title found',
    msgCategoryKeyInvalid: 'Category with invalid key found',
    msgCategoryKeyDuplicate: 'Duplicate category key: ',
    msgCategoryJsonError: 'Failed to parse category JSON: ',
    msgCategoryJsonArrayRequired: 'Must be an array',
    msgCategoryFieldRequired: 'Each category must have key and label',
    msgCurtainLocked: 'Curtain temporarily opened, but will be re-enabled on next load',
    msgImportConfirm: 'Importing will overwrite all current settings (category rules, pins, and preferences). Continue?',
    msgImportSuccess: 'Settings imported and restored',
    msgImportError: 'Import failed: ',
    msgImportInvalid: 'Invalid file: not a valid NeonFlux backup',
    msgExportError: 'Export failed: ',

    // Language
    language: 'Language',
    
    // Shortcuts
    shortcutsTitle: 'Quick Links',
    btnAddShortcut: 'Add Quick Link',
    shortcutUrlPlaceholder: 'Enter URL',
    shortcutAdded: 'Quick link added',
    shortcutRemoved: 'Quick link removed',
    shortcutInvalid: 'Invalid URL',
  }
};

// 獲取當前語言
function getCurrentLanguage() {
  return localStorage.getItem('neonflux-lang') || 'zh';
}

// 設置語言
function setLanguage(lang) {
  if (i18n[lang]) {
    localStorage.setItem('neonflux-lang', lang);
    return true;
  }
  return false;
}

// 獲取翻譯文本
function t(key) {
  const lang = getCurrentLanguage();
  return i18n[lang]?.[key] || i18n['zh']?.[key] || key;
}
