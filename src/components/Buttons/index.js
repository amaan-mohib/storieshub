import React from "react";
import StyledButton from "./styles";
import Loader from "./Loder";

const Button = ({
  children,
  onClick = () => {},
  startIcon,
  endIcon,
  disabled = false,
  loading = false,
  ...props
}) => {
  return (
    <StyledButton onClick={onClick} disabled={disabled || loading} {...props}>
      {((loading && !endIcon) || startIcon) && (
        <div className="load right">
          {loading && !endIcon ? (
            <Loader className="loading-icon" />
          ) : (
            startIcon
          )}
        </div>
      )}
      {children}
      {((loading && !startIcon) || endIcon) && (
        <div className="load left">
          {loading && endIcon ? <Loader className="loading-icon" /> : endIcon}
        </div>
      )}
    </StyledButton>
  );
};

export default Button;
