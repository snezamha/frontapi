import LocalSwitcher from "@/components/shared/locale-switcher";
import ThemeButton from "@/components/shared/theme-switcher";
import Footer from "@/components/layout/footer";

const RoutesLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex justify-end items-center gap-2 w-full px-5 py-5">
        <LocalSwitcher />
        <ThemeButton />
      </div>
      <div className="flex justify-center items-center grow h-full overflow-hidden">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default RoutesLayout;
