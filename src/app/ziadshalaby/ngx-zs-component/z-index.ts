export type KeyType = 
| 'alert'
| 'spinner'
| 'modal'
| 'themeToggle'
| 'navbar'
| 'scrollToTop'
| 'navItemDropdown'
| 'selectDropdown'

export type ZIndicesType = Record<KeyType, `z-${number}`>

export const zIndices: ZIndicesType = {
    alert: 'z-1600',
    spinner: 'z-1400',
    modal: 'z-1200',
    themeToggle: 'z-1000',
    navbar: 'z-800',
    scrollToTop: 'z-600',
    navItemDropdown: 'z-200',
    selectDropdown: 'z-200'
};

