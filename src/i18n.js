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
    btnSaveCategories: '儲存分類',
    btnAddMatcher: '新增規則',
    btnDeleteMatcher: '刪除規則',
    btnDeleteCategory: '刪除',
    btnMoveUp: '上移',
    btnMoveDown: '下移',
    
    // Settings
    settingsTitle: '設定',
    settingsGeneral: '一般',
    settingsLanguage: '語言',
    settingsCategoryLimit: '分類顯示數量（上限）',
    settingsRecentDays: '僅顯示近 N 天',
    settingsSortMode: '排序模式',
    settingsSortLatest: '最新在前',
    settingsSortSmart: '智慧排序',
    settingsColCount: '每列分類數（欄位數）',
    settingsSetAsDefault: '設為預設新分頁',
    settingsCategoryManagement: '分類管理（進階）',
    
    // Column count options
    colCount1: '1 欄',
    colCount2: '2 欄',
    colCount3: '3 欄',
    colCount4: '4 欄',
    
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
    btnSaveCategories: 'Save Categories',
    btnAddMatcher: 'Add Rule',
    btnDeleteMatcher: 'Delete Rule',
    btnDeleteCategory: 'Delete',
    btnMoveUp: 'Move Up',
    btnMoveDown: 'Move Down',
    
    // Settings
    settingsTitle: 'Settings',
    settingsGeneral: 'General',
    settingsLanguage: 'Language',
    settingsCategoryLimit: 'Category Display Limit',
    settingsRecentDays: 'Show only recent N days',
    settingsSortMode: 'Sort Mode',
    settingsSortLatest: 'Latest First',
    settingsSortSmart: 'Smart Sort',
    settingsColCount: 'Columns per Row',
    settingsSetAsDefault: 'Set as Default New Tab',
    settingsCategoryManagement: 'Category Management (Advanced)',
    
    // Column count options
    colCount1: '1 Column',
    colCount2: '2 Columns',
    colCount3: '3 Columns',
    colCount4: '4 Columns',
    
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
