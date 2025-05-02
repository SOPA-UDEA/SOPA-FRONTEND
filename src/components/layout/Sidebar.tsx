// src/components/layout/Sidebar.tsx
import {
    Squares2X2Icon,
    DocumentTextIcon,
    BuildingOffice2Icon,
    UsersIcon,
    Cog6ToothIcon,
    ChevronDownIcon,
  } from "@heroicons/react/24/outline";
import { Link, User } from "@heroui/react";

  
  import Image from "next/image";
import Link from "next/link";

  export default function Sidebar() {
    return (
      <aside className="w-64 h-screen border-r flex flex-col justify-between bg-white">
        <div className="p-6">
            <User
            className="Text-2xl font-bold"
          avatarProps={{
          src: "/src/assets/images/isotipo.png",
          }}
          name="SOPA"
        />
          {/* Menu */}
          <nav className="space-y-2">
          {/* classrooms */}

            <Link
              href="../classrooms"
              className="flex items-center justify-between px-3 py-2 rounded-md text-sky-900 hover:bg-gray-100"
            >
              <div className="flex items-center space-x-3">
                <UsersIcon className="h-5 w-5" />
                <span>Programación académica</span>
              </div>
            </Link>

            <Link
              href="/pensum"
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-sky-900 hover:bg-gray-100 font-medium"
            >
              <Squares2X2Icon className="h-5 w-5" />
              <span>Pensum</span>
            </Link>  
            <Link
              href="history"
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-sky-900 hover:bg-gray-100"
            >
              <DocumentTextIcon className="h-5 w-5" />
              <span>Historial de programaciones</span>
            </Link>

            <Link
              href="/classrooms"
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-sky-900 hover:bg-gray-100"
            >
              <BuildingOffice2Icon className="h-5 w-5" />
              <span>Gestión de aulas</span>
            </Link>
            <Link
              href="#"
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-sky-900 hover:bg-gray-100 font-medium"
            >
              <Squares2X2Icon className="h-5 w-5" />
              <span>Acerca de</span>
            </Link>
            <Link
              href="/groups"
              className="flex items-center justify-between px-3 py-2 rounded-md text-sky-900 hover:bg-gray-100"
            >
              <div className="flex items-center space-x-3">
                <UsersIcon className="h-5 w-5" />
                <span>Gestión de grupos</span>
              </div>
            </Link>
  
            <Link
              href="#"
              className="flex items-center justify-between px-3 py-2 rounded-md text-sky-900 hover:bg-gray-100"
            >
              <div className="flex items-center space-x-3">
                <Cog6ToothIcon className="h-5 w-5" />
                <span>Configuración</span>
              </div>
            </Link>


          </nav>
        </div>


  
        {/* User section */}
        <div className="p-6">
        <User
      avatarProps={{
        src: "https://avatars.githubusercontent.com/u/30373425?v=4",
      }}
      description={
        <Link  size="sm">
          @jrgarciadev
        </Link>
      }
      name="Junior Garcia"
    />
        </div>
      </aside>
    );
  }
  