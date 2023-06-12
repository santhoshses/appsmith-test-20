import { GoogleOAuthURL, GithubOAuthURL, OIDCOAuthURL } from "./ApiConstants";

import GithubLogo from "assets/images/Github.png";
import GoogleLogo from "assets/images/Google.png";
import OIDCLogo from "assets/images/no_image.png";
export type SocialLoginButtonProps = {
  url: string;
  name: string;
  logo: string;
  label?: string;
};

export const GoogleSocialLoginButtonProps: SocialLoginButtonProps = {
  url: GoogleOAuthURL,
  name: "Google",
  logo: GoogleLogo,
};

export const OIDCSocialLoginButtonProps: SocialLoginButtonProps = {
  url: OIDCOAuthURL,
  name: "OpenID",
  logo: OIDCLogo,
};

export const GithubSocialLoginButtonProps: SocialLoginButtonProps = {
  url: GithubOAuthURL,
  name: "Github",
  logo: GithubLogo,
};

export const SocialLoginButtonPropsList: Record<
  string,
  SocialLoginButtonProps
> = {
  google: GoogleSocialLoginButtonProps,
  github: GithubSocialLoginButtonProps,
  oidc: OIDCSocialLoginButtonProps,
};

export type SocialLoginType = keyof typeof SocialLoginButtonPropsList;
