import LocalSwitcher from "@/components/shared/locale-switcher";
import ThemeButton from "@/components/shared/theme-switcher";
import { SheetMenu } from "./sheet-menu";

export function Navbar() {
  return (
    <header className="top-0 z-10">
      <div className="flex items-center mx-5 py-4">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
        </div>
        <div className="flex justify-end items-center gap-2 w-full ">
          <LocalSwitcher />
          <ThemeButton />
        </div>
      </div>
    </header>
  );
}
