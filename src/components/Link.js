import Link from "next/link";
import React from "react";

const LinkComp = ({ href, className, style, children }) => {
  return (
    <Link href={href}>
      <a className={className || ""} style={style || {}}>
        {children}
      </a>
    </Link>
  );
};

export default LinkComp;
