import Link from "next/link";
import { Fragment, useState } from "react";
import MuiLink from "@mui/material/Link";
import { signIn } from "next-auth/react";
import dynamic from "next/dynamic";
import { getSession } from "next-auth/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
const InpField = dynamic(() => import("../components/InpField"));
const Form = dynamic(() => import("../components/Form"));
const HeadTag = dynamic(() => import("../components/layout/HeadTag"));

function Login() {
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = e => {
    const { value, name } = e.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const response = await signIn("credentials", {
      redirect: false,
      email: userCredentials.email,
      password: userCredentials.password,
    });
    if (
      window.history.length > 1 &&
      document.referrer.indexOf(window.location.host) !== -1
    ) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <Fragment>
      <HeadTag title="login" />
      <Box sx={{ maxWidth: "800px", margin: "0 auto" }}>
        <Form onSubmit={handleSubmit}>
          <Typography>Login</Typography>
          <List>
            <ListItem>
              <InpField
                variant="outlined"
                name="email"
                fullWidth
                id="email"
                label="Email"
                inputProps={{ type: "email" }}
                onChange={handleChange}
              />
            </ListItem>
            <ListItem>
              <InpField
                variant="outlined"
                name="password"
                fullWidth
                id="password"
                label="Password"
                inputProps={{ type: "password" }}
                onChange={handleChange}
              />
            </ListItem>
            <ListItem>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                color="primary"
              >
                Login
              </Button>
            </ListItem>
            <ListItem>
              {`Don't have an account?`} &nbsp;
              <Link href="/register" passHref>
                <MuiLink>Register</MuiLink>
              </Link>
            </ListItem>
          </List>
        </Form>
      </Box>
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
export default Login;
