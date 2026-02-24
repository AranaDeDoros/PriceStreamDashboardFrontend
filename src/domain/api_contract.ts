interface Run {
  id: string;
  startedAt: string;
  finishedAt: string;
  status: string;
  [key: string]: unknown;
}

interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

type FailedTokenResponse = {
  detail: string;
};

interface TokenRequest {
  username: string;
  password: string;
}

export type { Run, Token, FailedTokenResponse, TokenRequest };
