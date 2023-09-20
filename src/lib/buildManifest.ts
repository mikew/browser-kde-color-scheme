import { ParsedKdeIni } from './parseKdeIni';

export function buildSystemDecorationTheme(ini: ParsedKdeIni) {
  let windowBackgroundNormal = parseColor(
    ini['Colors:Window']['BackgroundNormal']
  );
  try {
    windowBackgroundNormal = parseColor(
      ini['Colors:Header']['BackgroundNormal']
    );
  } catch {}
  let windowBackgroundInactive = parseColor(
    ini['Colors:Window']['BackgroundNormal']
  );
  try {
    windowBackgroundInactive = parseColor(
      ini['Colors:Header__Inactive']['BackgroundNormal']
    );
  } catch {}

  const viewBackgroundNormal = parseColor(
    ini['Colors:View']['BackgroundNormal']
  );
  const viewBackgroundAlternate = parseColor(
    ini['Colors:View']['BackgroundAlternate']
  );
  const viewForegroundNormal = parseColor(
    ini['Colors:View']['ForegroundNormal']
  );

  const windowForegroundNormal = parseColor(
    ini['Colors:Window']['ForegroundNormal']
  );
  const windowForegroundInactive = parseColor(
    ini['Colors:Window']['ForegroundInactive']
  );

  const manifest: Manifest = {
    manifest_version: 2,
    name: 'test',
    description: 'Built with https://stackblitz.com/edit/node-rnhgxf',
    version: '1.0.0',
    theme: {
      colors: {
        background_tab: windowBackgroundNormal,
        background_tab_inactive: windowBackgroundInactive,
        bookmark_text: windowForegroundNormal,
        button_background: DEBUG_COLOR,
        frame: windowBackgroundNormal,
        frame_inactive: windowBackgroundInactive,
        ntp_background: viewBackgroundNormal,
        ntp_header: DEBUG_COLOR,
        ntp_link: DEBUG_COLOR,
        ntp_text: viewForegroundNormal,
        omnibox_background: viewBackgroundNormal,
        omnibox_text: viewForegroundNormal,
        tab_background_text: windowForegroundInactive,
        tab_background_text_inactive: windowForegroundInactive,
        tab_text: windowForegroundNormal,
        toolbar: viewBackgroundAlternate,
        toolbar_button_icon: windowForegroundNormal,
        toolbar_text: windowForegroundInactive,
      },
      tints,
    },
  };

  return manifest;
}

export function buildBrowserDecorationTheme(ini: ParsedKdeIni) {
  const viewBackgroundNormal = parseColor(
    ini['Colors:View']['BackgroundNormal']
  );
  const viewBackgroundAlternate = parseColor(
    ini['Colors:View']['BackgroundAlternate']
  );
  const viewForegroundNormal = parseColor(
    ini['Colors:View']['ForegroundNormal']
  );

  const windowForegroundNormal = parseColor(
    ini['Colors:Window']['ForegroundNormal']
  );
  const windowForegroundInactive = parseColor(
    ini['Colors:Window']['ForegroundInactive']
  );

  const wmActiveBackground = parseColor(ini['WM']['activeBackground']);
  const wmActiveForeground = parseColor(ini['WM']['activeForeground']);
  const wmInactiveBackground = parseColor(ini['WM']['inactiveBackground']);
  const wmInactiveForeground = parseColor(ini['WM']['inactiveForeground']);

  const manifest: Manifest = {
    manifest_version: 2,
    name: 'test',
    description: 'Built with https://stackblitz.com/edit/node-rnhgxf',
    version: '1.0.0',
    theme: {
      colors: {
        background_tab: wmActiveBackground,
        background_tab_inactive: wmInactiveBackground,
        bookmark_text: windowForegroundNormal,
        button_background: DEBUG_COLOR,
        frame: wmActiveBackground,
        frame_inactive: wmInactiveBackground,
        ntp_background: viewBackgroundNormal,
        ntp_header: DEBUG_COLOR,
        ntp_link: DEBUG_COLOR,
        ntp_text: viewForegroundNormal,
        omnibox_background: viewBackgroundNormal,
        omnibox_text: viewForegroundNormal,
        tab_background_text: wmActiveForeground,
        tab_background_text_inactive: wmInactiveForeground,
        tab_text: windowForegroundNormal,
        toolbar: viewBackgroundAlternate,
        toolbar_button_icon: windowForegroundNormal,
        toolbar_text: windowForegroundInactive,
      },
      tints,
    },
  };

  return manifest;
}

export async function buildManifestZip(ini: ParsedKdeIni) {
  const kdeColorSchemeName = ini['General']?.['ColorScheme'];

  const zip = new (window as any).JSZip();

  const systemDecorationTheme = buildSystemDecorationTheme(ini);
  systemDecorationTheme.name = `${kdeColorSchemeName} (System Decorations)`;
  zip.file(
    `${systemDecorationTheme.name}/manifest.json`,
    JSON.stringify(systemDecorationTheme, undefined, 2)
  );

  const browserDecorationTheme = buildBrowserDecorationTheme(ini);
  browserDecorationTheme.name = `${kdeColorSchemeName} (Browser Decorations)`;
  zip.file(
    `${browserDecorationTheme.name}/manifest.json`,
    JSON.stringify(browserDecorationTheme, undefined, 2)
  );

  return {
    blob: (await zip.generateAsync({ type: 'blob' })) as Blob,
    zipFileName: `${kdeColorSchemeName}.zip`,
  };
}

function parseColor(input: string) {
  return input.split(',').map(Number);
}

const tints: ManifestTheme['tints'] = {
  buttons: [-1, -1, 0.98],
};

const DEBUG_COLOR = [255, 0, 255];

interface Manifest {
  manifest_version: number;
  name: string;
  description: string;
  version: string;
  theme: ManifestTheme;
}

interface ManifestTheme {
  colors?: {
    background_tab?: number[];
    background_tab_inactive?: number[];
    background_tab_incognito?: number[];
    background_tab_incognito_inactive?: number[];
    bookmark_text?: number[];
    button_background?: number[];
    frame?: number[];
    frame_inactive?: number[];
    frame_incognito?: number[];
    frame_incognito_inactive?: number[];
    ntp_background?: number[];
    ntp_header?: number[];
    ntp_link?: number[];
    ntp_text?: number[];
    omnibox_background?: number[];
    omnibox_text?: number[];
    tab_background_text?: number[];
    tab_background_text_inactive?: number[];
    tab_background_text_incognito?: number[];
    tab_background_text_incognito_inactive?: number[];
    tab_text?: number[];
    toolbar?: number[];
    toolbar_button_icon?: number[];
    toolbar_text?: number[];
  };
  tints?: {
    background_tab?: number[];
    buttons?: number[];
    frame?: number[];
    frame_inactive?: number[];
    frame_incognito?: number[];
    frame_incognito_inactive?: number[];
  };
}
