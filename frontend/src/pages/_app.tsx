import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "@/styles/theme";
import createEmotionCache from "@/styles/createEmotionCache";
import axios from "../components/utils/apiClient";
import { Toaster } from "react-hot-toast";
import Auth from "@/components/utils/Auth";
import DefaultLayout from "@/components/layout/DefaultLayout";
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

// axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
// axios.defaults.withCredentials = true;

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Toaster
          toastOptions={{
            style: {
              // background: "green",
              // color: `${theme.palette.text.primary}`,
              fontFamily: `${theme.typography.body1}`,
            },
            success: {
              style: {
                background: "green",
                color: `${theme.palette.text.primary}`,
              },
            },
            error: {
              style: {
                background: `${theme.palette.error.dark}`,
              },
            },
          }}
        />

        <Auth>
          <DefaultLayout>
            <Component {...pageProps} />
          </DefaultLayout>
        </Auth>
      </ThemeProvider>
    </CacheProvider>
  );
}
