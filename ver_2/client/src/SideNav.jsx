import Nav from "./Nav";

function isActive(path) {
  return window.location.pathname.startsWith(path);
}

function SideNav() {
  return (
    <Nav>
      <Nav.List>
        <Nav.Item>
          <Nav.Link to="/" active={isActive("/")}>
            Home
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link to="/about" active={isActive("/about")}>
            About
          </Nav.Link>
        </Nav.Item>
        <Nav.Item disabled>
          <Nav.Link>Coming Soon</Nav.Link>
        </Nav.Item>

        {/* <Nav.Separator /> */}

        <Nav.Item>
          <Nav.Link to="/back/python" active={isActive("/back")}>
            Backend
          </Nav.Link>
          <Nav.List expanded={isActive("/back")}>
            <Nav.Item>
              <Nav.Link to="/back/python" active={isActive("/back/python")}>
                Python
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link to="/back/java" active={isActive("/back/java")}>
                Java
              </Nav.Link>
            </Nav.Item>
          </Nav.List>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link to="/front/html" active={isActive("/front")}>
            Frontend
          </Nav.Link>
          <Nav.List expanded={isActive("/front")}>
            <Nav.Item>
              <Nav.Link to="/front/html" active={isActive("/front/html")}>
                HTML
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link to="/front/css" active={isActive("/front/css")}>
                CSS
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link to="/front/js/react" active={isActive("/front/js")}>
                JavaScript
              </Nav.Link>
              <Nav.List expanded={isActive("/front/js")}>
                <Nav.Item>
                  <Nav.Link
                    to="/front/js/react"
                    active={isActive("/front/js/react")}
                  >
                    React
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    to="/front/js/vue"
                    active={isActive("/front/js/vue")}
                  >
                    Vue
                  </Nav.Link>
                </Nav.Item>
              </Nav.List>
            </Nav.Item>
          </Nav.List>
        </Nav.Item>

        {/* <Nav.Separator /> */}

        <Nav.Item>
          <Nav.Link to="/help" active={isActive("/help")}>
            Help
          </Nav.Link>
        </Nav.Item>
      </Nav.List>
    </Nav>
  );
}

export default SideNav;