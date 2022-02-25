import { ReactElement, useCallback, useEffect, useMemo } from "react";
import Meta from "./meta";
import CustomNavbar from "./Navbar";
import { Container, Stack } from "react-bootstrap";

interface LayoutProps {
  children: ReactElement | ReactElement[];
}

const Layout = ({ children }: LayoutProps) => (
  <>
    <Meta />
    <div className="flex flex-col min-h-screen">
      <Stack gap={5}>
        <CustomNavbar />
        <main className="">
          <Container>{children}</Container>
        </main>
      </Stack>
    </div>
  </>
);

export default Layout;
