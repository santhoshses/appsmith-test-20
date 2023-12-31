import styled from "styled-components";
import React from "react";
import { importSvg } from "design-system-old";

const SpinnerSvg = importSvg(() => import("assets/svg/loader-2-fill.svg"));

const CheckmarkWrapper = styled.div<{ $height: string; $width: string }>`
  #loading-spinner {
    animation: loading-spinner 2s linear infinite;
  }

  @keyframes loading-spinner {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

function SpinnerLoader(props: { height: string; width: string }) {
  return (
    <CheckmarkWrapper $height={props.height} $width={props.width}>
      <SpinnerSvg id="loading-spinner" />
    </CheckmarkWrapper>
  );
}

export default SpinnerLoader;
