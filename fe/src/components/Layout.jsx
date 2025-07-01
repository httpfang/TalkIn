import Sidebar, { MobileNav } from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false, hideNavOnMobile = false }) => {
  return (
    <div className={`min-h-screen ${hideNavOnMobile ? 'mobile-hide-nav' : ''}`}>
      <div className="flex">
        {showSidebar && (!hideNavOnMobile ? <Sidebar /> : <div className="hidden lg:block"><Sidebar /></div>)}

        <div className="flex-1 flex flex-col">
          {!hideNavOnMobile ? <Navbar /> : <div className="hidden lg:block"><Navbar /></div>}

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
      {/* Mobile bottom nav */}
      {!hideNavOnMobile && <MobileNav />}
    </div>
  );
};
export default Layout;
