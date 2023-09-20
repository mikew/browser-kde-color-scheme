import { ParsedKdeIni } from './parseKdeIni';

export function buildFirefoxTheme(ini: ParsedKdeIni) {
  const viewBackgroundNormal = ini['Colors:View']['BackgroundNormal'];
  const viewBackgroundAlternate = ini['Colors:View']['BackgroundAlternate'];
  const viewForegroundNormal = ini['Colors:View']['ForegroundNormal'];

  const windowForegroundNormal = ini['Colors:Window']['ForegroundNormal'];
  const windowForegroundInactive = ini['Colors:Window']['ForegroundInactive'];

  const wmActiveBackground = ini['WM']['activeBackground'];
  const wmActiveForeground = ini['WM']['activeForeground'];
  const wmInactiveBackground = ini['WM']['inactiveBackground'];

  const manifest: FirefoxTheme = {
    title: 'test',
    colors: {
      // background_tab: windowBackgroundNormal,
      // background_tab_inactive: windowBackgroundInactive,
      // bookmark_text: windowForegroundNormal,
      // button_background: DEBUG_COLOR,
      frame: parseRgb(wmActiveBackground),
      frame_inactive: parseRgba(wmInactiveBackground),
      ntp_background: parseRgba(viewBackgroundNormal),
      // ntp_header: DEBUG_COLOR,
      // ntp_link: DEBUG_COLOR,
      ntp_text: parseRgba(viewForegroundNormal),
      toolbar_field: parseRgba(viewBackgroundNormal),
      toolbar_field_text: parseRgba(viewForegroundNormal),
      tab_background_text: parseRgb(windowForegroundInactive),
      tab_line: parseRgba(viewBackgroundAlternate),
      // tab_background_text_inactive: wmInactiveForeground,
      tab_text: parseRgba(windowForegroundNormal),
      toolbar: parseRgba(viewBackgroundAlternate),
      // toolbar_button_icon: windowForegroundNormal,
      toolbar_text: parseRgba(windowForegroundInactive),
      popup: parseRgba(viewBackgroundNormal),
      popup_text: parseRgba(viewForegroundNormal),
    },
  };

  return manifest;
}

function parseRgb(input: string) {
  const split = input.split(',').map(Number);

  const rgb: Rgb = {
    r: split[0] || 0,
    g: split[1] || 0,
    b: split[2] || 0,
  };

  return rgb;
}

function parseRgba(input: string) {
  const split = input.split(',').map(Number);

  const rgba: Rgba = {
    r: split[0] || 0,
    g: split[1] || 0,
    b: split[2] || 0,
    a: split[3] || 1,
  };

  return rgba;
}

// https://github.com/mozilla/FirefoxColor/blob/master/docs/theme-schema.json

type R = number;
type G = number;
type B = number;
type A = number;

interface Rgb {
  r: R;
  g: G;
  b: B;
}

interface Rgba {
  r: R;
  g: G;
  b: B;
  a?: A;
}

interface FirefoxTheme {
  title: string;

  colors: {
    frame: Rgb;
    tab_background_text: Rgb;
    sidebar?: Rgb;
    button_background_active?: Rgba;
    button_background_hover?: Rgba;
    frame_inactive?: Rgba;
    icons?: Rgba;
    icons_attention?: Rgba;
    ntp_background?: Rgba;
    ntp_text?: Rgba;
    popup: Rgba;
    popup_border?: Rgba;
    popup_highlight?: Rgba;
    popup_highlight_text?: Rgba;
    popup_text: Rgba;
    sidebar_border?: Rgba;
    sidebar_highlight?: Rgba;
    sidebar_highlight_text?: Rgba;
    sidebar_text?: Rgba;
    tab_background_separator?: Rgba;
    tab_line: Rgba;
    tab_loading?: Rgba;
    tab_selected?: Rgba;
    tab_text?: Rgba;
    toolbar: Rgba;
    toolbar_bottom_separator?: Rgba;
    toolbar_field: Rgba;
    toolbar_field_border?: Rgba;
    toolbar_field_border_focus?: Rgba;
    toolbar_field_focus?: Rgba;
    toolbar_field_highlight?: Rgba;
    toolbar_field_highlight_text?: Rgba;
    toolbar_field_separator?: Rgba;
    toolbar_field_text: Rgba;
    toolbar_field_text_focus?: Rgba;
    toolbar_text: Rgba;
    toolbar_top_separator?: Rgba;
    toolbar_vertical_separator?: Rgba;
  };

  images?: {
    theme_frame?: string;
    additional_backgrounds?: string[];
  };
}
