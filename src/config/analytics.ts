const normalize = (value: string | undefined) => value?.trim() ?? "";

const env = import.meta.env;

export const ANALYTICS = {
  gtmId: normalize(env.PUBLIC_GTM_ID),
  googleTagId: normalize(env.PUBLIC_GOOGLE_TAG_ID),
} as const;
