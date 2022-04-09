import Link from "next/link";
import React from "react";

const LinkComp = ({ href, className, children }) => {
  return (
    <Link href={href}>
      <a className={className || ""}>{children}</a>
    </Link>
  );
};

export default LinkComp;
