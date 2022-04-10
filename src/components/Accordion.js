import React, { useState } from "react";
import FeatherIcon from "feather-icons-react";

const Accordion = ({ title, component, isOpen = false, notification = 0 }) => {
  const [open, setOpen] = useState(isOpen);
  return (
    <div className="accordion members">
      <div className="accordion-title" onClick={() => setOpen(!open)}>
        <h3 className="heading-h3">
          {title}
          {notification !== 0 && <p className="badge">{notification}</p>}
        </h3>
        <div className="icon-button">
          <FeatherIcon icon={open ? "chevron-up" : "chevron-down"} />
        </div>
      </div>
      {open && (
        <div>
          <hr />
          {component}
        </div>
      )}
    </div>
  );
};

export default Accordion;
