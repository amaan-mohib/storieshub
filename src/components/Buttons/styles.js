import styled, { css } from "styled-components";

const StyledButton = styled.button`
  text-align: center;
  text-decoration: none;
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background);
  border: 1px solid var(--hr);
  border-radius: 0.3rem;
  padding: 6px 16px;
  font-size: 0.875rem;
  min-width: 64px;
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  user-select: none;
  text-transform: uppercase;
  letter-spacing: 0.02857em;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    width 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  ${(props) =>
    props.secondary &&
    css`
      background-color: transparent;
      border: none;
      box-shadow: none;
      padding: 7px 8px;
    `}
  ${(props) =>
    props.outlined &&
    css`
      border: 1px solid var(--secondary-text);
      background-color: transparent;
      box-shadow: none;
      padding: 5px 15px;
    `}
  ${(props) =>
    props.fullWidth &&
    css`
      width: 100%;
    `}
  &:active:enabled {
    background-color: rgba(0, 0, 0, 0.2);
  }
  &:disabled {
    color: var(--secondary-text);
    cursor: not-allowed;
  }
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--hover);
    }
    &:disabled:hover {
      background-color: var(--background);
    }
  }
  svg {
    width: 20px;
    height: 20px;
  }
  .load {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .right {
    margin-right: 12px;
  }
  .left {
    margin-left: 12px;
  }
  .loading-icon {
    margin: 0 !important;
  }
`;

export default StyledButton;
