import React from "react";
import styled from "styled-components";

const Item = styled.li`
  margin: 8px;
`;

function NavItem({ children, disabled = false }) {
  return <Item role={disabled ? "presentation" : null}>{children}</Item>;
}

export default NavItem;