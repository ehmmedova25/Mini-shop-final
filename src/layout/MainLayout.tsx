import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = ({ children }: { children: ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <Navbar />
    <main style={{ flex: 1 }}>
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 24px",
        boxSizing: "border-box",
        width: "100%",
      }}>
        {children}
      </div>
    </main>
    <Footer />
  </div>
);

export default MainLayout;