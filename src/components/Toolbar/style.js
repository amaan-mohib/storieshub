import styled from "styled-components";

const Background = styled.div`
  .toolbar {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
  .dialog-bg {
    position: absolute;
    left: 0;
    top: 0;
    margin-top: 0;
    transform: unset;
  }
  .dialog {
    position: relative;
    top: 50vh;
  }
  .stat {
    font-size: x-small;
    color: var(--secondary-text);
    margin-right: 20px;
  }
`;

export default Background;
