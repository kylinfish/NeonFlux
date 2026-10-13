// 版本更新提示：newtab 的「新功能」卡片與 background 的更新後開啟更新說明共用

const RELEASE_NOTES_URL = 'https://neonflux-web.web.app/release.html';

// '1.3.0' → '1.3'；只比 major.minor，修補版（1.3.1）不打擾使用者
function majorMinor(version) {
    const [major = '0', minor = '0'] = String(version || '').split('.');
    return `${parseInt(major, 10) || 0}.${parseInt(minor, 10) || 0}`;
}

function isFeatureUpdate(previousVersion, currentVersion) {
    if (!previousVersion) return false;
    return majorMinor(previousVersion) !== majorMinor(currentVersion);
}

// newtab 是否顯示「新功能」卡片
// lastSeen 為 null：全新安裝（無既有設定）不顯示；1.3 以前的舊使用者（有既有設定）顯示
function shouldShowWhatsNew(lastSeenVersion, currentVersion, hasExistingSettings) {
    if (!lastSeenVersion) return !!hasExistingSettings;
    return isFeatureUpdate(lastSeenVersion, currentVersion);
}

function releaseNotesUrl(lang) {
    return `${RELEASE_NOTES_URL}?lang=${lang === 'en' ? 'en' : 'zh'}`;
}

if (typeof module !== 'undefined') {
    module.exports = { majorMinor, isFeatureUpdate, shouldShowWhatsNew, releaseNotesUrl };
}
