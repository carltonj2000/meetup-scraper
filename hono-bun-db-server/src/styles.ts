import { css } from "hono/css";

export const navCss = css`
  display: flex;
  flex-direction: column;
  padding: 2px 10px 0 2px;
  border: 1px solid red;
  gap: 5px;
`;

export const sideBySideCss = css`
  display: flex;
  flex-direction: row;
  border: 1px solid red;
`;
