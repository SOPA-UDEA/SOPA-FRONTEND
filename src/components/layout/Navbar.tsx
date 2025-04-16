"use client";

import { Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import { TbWorldCode } from "react-icons/tb";

const Nav = () => {
  return (
    <Navbar position="static">
      <NavbarBrand className="flex gap-2">
        <TbWorldCode size={28} className="text-secondary-900" />{" "}
        <p className="font-bold  text-3xl">
          UdeA <span className="text-2xl font-normal">SAM</span>
        </p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {/* <NavbarItem>
          <Link color="secondary" href="#">
            New Search
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link color="secondary" href="#">
            History
          </Link>
        </NavbarItem> */}
      </NavbarContent>
      <NavbarContent justify="end"></NavbarContent>
    </Navbar>
  );
};

export default Nav;
