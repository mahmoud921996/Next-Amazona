import { Fragment, useContext, useEffect, useRef, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import classes from "../../styles/style";
import MenuIcon from "@mui/icons-material/Menu";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import MuiLink from "@mui/material/Link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ThemeContext from "../../store/ThemeContext";
import ProductsContext from "../../store/products/productsContext";
import { useSnackbar } from "notistack";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Grow from "@mui/material/Grow";
import Cookies from "js-cookie";

import Popper from "@mui/material/Popper";

const Navbar = () => {
  const { data: session, status } = useSession();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [categories, setCategories] = useState([]);

  const productsContext = useContext(ProductsContext);
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const {
    cart: { cartItems },
    clearCart,
  } = productsContext;
  const [query, setQuery] = useState("");
  const anchorRef = useRef(null);

  const router = useRouter();
  const [sidbarVisible, setSidebarVisible] = useState(false);
  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const queryChangeHandler = e => {
    setQuery(e.target.value);
  };
  const submitHandler = e => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };
  const handleClose = (event, redirect) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
    if (redirect) {
      router.push(redirect);
    }
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/admin/products/categories`);
      const data = await res.json();
      setCategories(data.categories);
    } catch (err) {
      enqueueSnackbar(err, { variant: "error" });
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSignOut = async () => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
    clearCart();
    Cookies.remove("cartItems");
    const data = await signOut({ redirect: false, callbackUrl: "/login" });
    router.push(data.url);
  };

  const isDesktop = useMediaQuery("(min-width:600px)");
  return (
    <Fragment>
      <AppBar position="static" sx={classes.appbar}>
        <Toolbar sx={classes.toolbar}>
          <Box display="flex" alignItems="center">
            <IconButton
              edge="start"
              aria-label="open drawer"
              onClick={sidebarOpenHandler}
              sx={classes.menuButton}
            >
              <MenuIcon sx={classes.navbarButton} />
            </IconButton>
            <Link href="/">
              <a>
                <Typography sx={classes.brand}>Amazona</Typography>
              </a>
            </Link>
          </Box>

          <Drawer
            anchor="left"
            open={sidbarVisible}
            onClose={sidebarCloseHandler}
          >
            <List>
              <ListItem>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>Shopping by category</Typography>
                  <IconButton aria-label="close" onClick={sidebarCloseHandler}>
                    <CancelIcon />
                  </IconButton>
                </Box>
              </ListItem>
              <Divider light />
              {categories.map(category => (
                <Link
                  key={category}
                  href={`/search?category=${category}`}
                  passHref
                >
                  <ListItem button component="a" onClick={sidebarCloseHandler}>
                    <ListItemText primary={category}></ListItemText>
                  </ListItem>
                </Link>
              ))}
            </List>
          </Drawer>
          {isDesktop && (
            <Box>
              <form onSubmit={submitHandler}>
                <Box sx={classes.searchForm}>
                  <InputBase
                    name="query"
                    className={classes.searchInput}
                    placeholder="Search products"
                    onChange={queryChangeHandler}
                    value={query}
                  />
                  <IconButton
                    type="submit"
                    sx={classes.searchButton}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </Box>
              </form>
            </Box>
          )}

          <Box>
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              inputProps={{ "aria-label": "controlled" }}
            ></Switch>

            <Link href="/cart" passHref>
              <MuiLink
                sx={{
                  color: "#fff",
                  marginLeft: "10px",
                }}
              >
                <Typography component="span">
                  {cartItems.length > 0 ? (
                    <Badge color="secondary" badgeContent={cartItems.length}>
                      Cart
                    </Badge>
                  ) : (
                    "Cart"
                  )}
                </Typography>
              </MuiLink>
            </Link>
            {session && status !== "loading" ? (
              <>
                <Button
                  ref={anchorRef}
                  id="composition-button"
                  aria-controls={open ? "composition-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={handleToggle}
                >
                  {session.user.name}
                </Button>

                <Popper
                  open={open}
                  anchorEl={anchorRef.current}
                  role={undefined}
                  placement="bottom-start"
                  transition
                  disablePortal
                  style={{ zIndex: "10" }}
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === "bottom-start"
                            ? "left top"
                            : "left bottom",
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                          <MenuList
                            autoFocusItem={open}
                            id="composition-menu"
                            aria-labelledby="composition-button"
                          >
                            <MenuItem onClick={e => handleClose(e, "/profile")}>
                              Profile
                            </MenuItem>
                            <MenuItem
                              onClick={e => handleClose(e, "/order-history")}
                            >
                              Order History
                            </MenuItem>
                            <MenuItem
                              onClick={e => handleClose(e, "/admin/dashboard")}
                            >
                              Dashboard
                            </MenuItem>
                            <MenuItem onClick={handleSignOut}>Logout</MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </>
            ) : (
              <Link href="/login" passHref>
                <MuiLink>
                  <Typography component="span">Login</Typography>
                </MuiLink>
              </Link>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Fragment>
  );
};

export default Navbar;
