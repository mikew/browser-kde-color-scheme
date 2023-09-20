import Container from '@mui/material/Container';
import { saveAs } from 'file-saver';

import JsonUrl from 'json-url';
import Box from '@mui/material/Box';
import { enqueueSnackbar } from 'notistack';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import ArchiveIcon from '@mui/icons-material/Archive';
import { Codec } from 'json-url/dist/node/index';

import parseKdeIni, { ParsedKdeIni } from '@src/lib/parseKdeIni';
import { buildManifestZip } from '@src/lib/buildManifest';
import { buildFirefoxTheme } from '@src/lib/buildFirefoxTheme';
import Divider from '@mui/material/Divider';

import { ReactComponent as ChromiumLogo } from '@src/svgs/chromium-logo.svg';
import { ReactComponent as FirefoxLogo } from '@src/svgs/firefox-logo.svg';
import { ReactComponent as EdgeLogo } from '@src/svgs/edge-logo.svg';

const jsonCodec: Codec = JsonUrl('lzma');

function App() {
  const [parsedIni, setParsedIni] = useState<ParsedKdeIni | undefined>(
    undefined
  );

  const handleDrop: React.DragEventHandler = async (event) => {
    event.preventDefault();
    setParsedIni(undefined);

    const file = event.dataTransfer.files[0];
    if (!file) {
      enqueueSnackbar('No file dropped', { variant: 'error' });
      return;
    }

    try {
      const contents = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (onloadEvent) => {
          const result = onloadEvent.target?.result;
          result
            ? resolve(result.toString())
            : reject(new Error(`${file.name} is empty`));
        };

        reader.onerror = (onerrorEvent) => {
          reject(onerrorEvent);
        };

        reader.readAsText(file);
      });

      setParsedIni(parseKdeIni(contents));
    } catch (err) {
      console.error(err);
      enqueueSnackbar(
        `Error while reading ${file.name}. Check your browsers console.`,
        {
          variant: 'error',
        }
      );
    }
  };

  return (
    <Container fixed maxWidth="md" sx={{ paddingY: 4 }}>
      <Stack divider={<Divider />} spacing={4}>
        <Box>
          <Box
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
          >
            <Box
              paddingX={2}
              paddingY={6}
              textAlign="center"
              borderRadius={1}
              bgcolor="info.light"
              color="info.contrastText"
              sx={{
                '&:hover': {
                  bgcolor: 'info.main',
                },
              }}
            >
              Drop <code>~/.config/kdeglobals</code> here
            </Box>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            maxWidth="80ch"
            display="block"
            marginX="auto"
            paddingX={2}
            textAlign="center"
          >
            Note: this will read whatever file you drop in. If you drop in your
            kdeglobals file, it will be parsed and turned into a valid theme for
            various browsers.
          </Typography>
        </Box>

        <Box>
          <ChromiumSection ini={parsedIni} />
        </Box>

        <Box>
          <FirefoxSection ini={parsedIni} />
        </Box>
      </Stack>
    </Container>
  );
}

const FirefoxSection: React.FC<{ ini?: ParsedKdeIni }> = (props) => {
  const [themeParam, setThemeParam] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function run() {
      if (!props.ini) {
        return;
      }

      try {
        const compressed = await jsonCodec.compress(
          buildFirefoxTheme(props.ini)
        );
        setThemeParam(compressed);
      } catch (err) {
        console.error(err);
        enqueueSnackbar(
          'Error while building Firefox theme. Check your browsers console for more details.',
          {
            variant: 'error',
          }
        );
      }
    }

    setThemeParam(undefined);
    run();
  }, [props.ini]);

  return (
    <>
      <Stack direction="row" spacing={2}>
        <Box>
          <BigLogoWithLabel logo={<FirefoxLogo />} label="Firefox Color" />
        </Box>

        <Box>
          {themeParam ? (
            <Button
              variant="outlined"
              href={`https://color.firefox.com?theme=${themeParam}`}
              target="_blank"
              startIcon={<OpenInNewIcon />}
            >
              View on color.firefox.com
            </Button>
          ) : (
            <Waiting />
          )}
        </Box>
      </Stack>
    </>
  );
};

const ChromiumSection: React.FC<{ ini?: ParsedKdeIni }> = (props) => {
  const handleDownloadClick: React.MouseEventHandler = async () => {
    if (!props.ini) {
      return;
    }

    try {
      const { zipFileName, blob } = await buildManifestZip(props.ini);
      saveAs(blob, zipFileName);
    } catch (err) {
      console.error(err);
      enqueueSnackbar(
        'Error while building Chromium theme. Check your browsers console for more details.',
        {
          variant: 'error',
        }
      );
    }
  };

  return (
    <>
      <Stack direction="row" spacing={2}>
        <Box>
          <BigLogoWithLabel logo={<ChromiumLogo />} label="Chromium" />
          <br />
          <BigLogoWithLabel logo={<EdgeLogo />} label="Edge" />
        </Box>

        <Box>
          {props.ini ? (
            <>
              <Button
                variant="outlined"
                startIcon={<ArchiveIcon />}
                onClick={handleDownloadClick}
              >
                Download .zip
              </Button>

              <br />

              <Typography
                variant="caption"
                color="text.secondary"
                // textAlign="center"
              >
                After downloading:
                <ol>
                  <li>
                    Visit <code>chrome://extensions</code>
                  </li>
                  <li>Turn on Developer Mode</li>
                  <li>Extract the .zip file</li>
                  <li>
                    Drag either the "Browser Decorations" or "System
                    Decorations" folder to <code>chrome://extensions</code>
                  </li>
                </ol>
              </Typography>
            </>
          ) : (
            <Waiting />
          )}
        </Box>
      </Stack>
    </>
  );
};

const BigLogoWithLabel: React.FC<{ logo: React.ReactNode; label: string }> = (
  props
) => {
  return (
    <Box textAlign="center">
      <Box
        sx={{
          '& svg, & img': {
            width: '100%',
            maxWidth: 96,
          },
        }}
      >
        {props.logo}
      </Box>

      <Typography variant="caption" color="text.secondary">
        {props.label}
      </Typography>
    </Box>
  );
};

const Waiting = () => {
  return <Typography color="text.secondary">Waiting ...</Typography>;
};

export default App;
