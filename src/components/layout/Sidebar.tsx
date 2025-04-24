// src/components/layout/Sidebar.tsx
import {
    Squares2X2Icon,
    DocumentTextIcon,
    BuildingOffice2Icon,
    UsersIcon,
    Cog6ToothIcon,
    ChevronDownIcon,
  } from "@heroicons/react/24/outline";
  
  import Image from "next/image";
import Link from "next/link";
  
  export default function Sidebar() {
    return (
      <aside className="w-64 h-screen border-r flex flex-col justify-between bg-white">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center mb-10 space-x-3">
            <div className="w-8 h-8 rounded-full bg-green-700" />
            <div>
              <p className="text-sm font-semibold">SOPA</p>
              <p className="text-xs text-gray-400">Panel principal</p>
            </div>
          </div>
  
          {/* Menu */}
          <nav className="space-y-2">
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
              href="/groups"
              className="flex items-center justify-between px-3 py-2 rounded-md text-sky-900 hover:bg-gray-100"
            >
              <div className="flex items-center space-x-3">
                <UsersIcon className="h-5 w-5" />
                <span>Gestión de grupos</span>
              </div>
            </Link>
  
            <a
              href="#"
              className="flex items-center justify-between px-3 py-2 rounded-md text-sky-900 hover:bg-gray-100"
            >
              <div className="flex items-center space-x-3">
                <Cog6ToothIcon className="h-5 w-5" />
                <span>Configuración</span>
              </div>
            </a>
          </nav>
        </div>
  
        {/* User section */}
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <Image
              src="/" 
              alt="Avatar"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <span className="text-sm text-gray-800">Danny Admin</span>
          </div>
        </div>
      </aside>
    );
  }
  