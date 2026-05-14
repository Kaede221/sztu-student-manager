import type { ThemeConfig } from 'antd';

export const colors = {
  primary: '#2D6A4F',
  primaryDark: '#1F3A2E',
  primaryHover: '#235640',
  accent: '#C9962E',
  accentSoft: '#E8C77A',
  sage: '#6B8E7F',
  success: '#2D7A4F',
  warning: '#C9962E',
  error: '#B5384D',
  info: '#4A6B5C',

  bgLayout: '#FAFAF7',
  bgContainer: '#FFFFFF',
  bgElevated: '#FFFFFF',
  bgTableHeader: '#F5F2EA',
  bgTagSoft: '#E8F2EC',

  border: '#E8E5DC',
  borderSoft: '#F0EDE4',

  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textTertiary: '#9A9A9A',
} as const;

const fontFamily =
  "'Inter', 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Microsoft YaHei', 'Segoe UI', sans-serif";

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: colors.primary,
    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.error,
    colorInfo: colors.info,
    colorLink: colors.primary,
    colorLinkHover: colors.primaryHover,
    colorLinkActive: colors.primaryDark,

    colorBgLayout: colors.bgLayout,
    colorBgContainer: colors.bgContainer,
    colorBgElevated: colors.bgElevated,

    colorBorder: colors.border,
    colorBorderSecondary: colors.borderSoft,

    colorText: colors.textPrimary,
    colorTextSecondary: colors.textSecondary,
    colorTextTertiary: colors.textTertiary,

    borderRadius: 10,
    borderRadiusLG: 14,
    borderRadiusSM: 6,

    fontFamily,
    fontSize: 14,

    boxShadow: '0 2px 8px rgba(31,58,46,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    boxShadowSecondary: '0 1px 2px rgba(31,58,46,0.04)',
    boxShadowTertiary: '0 1px 2px rgba(31,58,46,0.03)',

    controlHeight: 36,
  },
  components: {
    Layout: {
      bodyBg: colors.bgLayout,
      headerBg: colors.bgContainer,
      headerHeight: 60,
      headerPadding: '0 24px',
      siderBg: 'transparent',
    },
    Menu: {
      darkItemBg: 'transparent',
      darkSubMenuItemBg: 'transparent',
      darkItemColor: 'rgba(255,255,255,0.72)',
      darkItemHoverBg: 'rgba(201,150,46,0.10)',
      darkItemHoverColor: '#FFFFFF',
      darkItemSelectedBg: 'rgba(201,150,46,0.18)',
      darkItemSelectedColor: '#FFFFFF',
      iconSize: 16,
    },
    Card: {
      borderRadiusLG: 14,
      paddingLG: 20,
      headerBg: 'transparent',
      headerFontSize: 16,
      headerHeight: 52,
      boxShadowTertiary: '0 1px 2px rgba(31,58,46,0.04)',
    },
    Table: {
      headerBg: colors.bgTableHeader,
      headerColor: colors.textPrimary,
      headerSplitColor: 'transparent',
      borderColor: colors.borderSoft,
      rowHoverBg: '#FBF9F2',
      cellPaddingBlock: 14,
    },
    Button: {
      controlHeight: 36,
      borderRadius: 8,
      fontWeight: 500,
      primaryShadow: 'none',
      defaultShadow: 'none',
    },
    Input: {
      controlHeight: 36,
      borderRadius: 8,
      activeShadow: '0 0 0 3px rgba(45,106,79,0.12)',
    },
    Select: {
      controlHeight: 36,
      borderRadius: 8,
    },
    Tag: {
      borderRadiusSM: 4,
      defaultBg: '#F2EFE6',
      defaultColor: colors.textSecondary,
    },
    Modal: {
      borderRadiusLG: 14,
      paddingLG: 24,
      titleFontSize: 17,
    },
    Form: {
      labelColor: colors.textSecondary,
      itemMarginBottom: 18,
    },
    Tabs: {
      itemSelectedColor: colors.primaryDark,
      itemHoverColor: colors.primary,
      itemActiveColor: colors.primaryDark,
      inkBarColor: colors.accent,
      titleFontSize: 15,
    },
    Statistic: {
      contentFontSize: 28,
      titleFontSize: 13,
    },
    Dropdown: {
      borderRadiusLG: 10,
      paddingBlock: 6,
    },
    Descriptions: {
      titleColor: colors.textPrimary,
      labelBg: 'transparent',
      itemPaddingBottom: 14,
    },
    Popconfirm: {
      borderRadiusLG: 10,
    },
  },
};

export default antdTheme;
