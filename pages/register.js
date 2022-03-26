import { Fragment, useState } from "react";
import MuiLink from "@mui/material/Link";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import dynamic from "next/dynamic";

const HeadTag = dynamic(() => import("../components/layout/HeadTag"));

const InpField = dynamic(() => import("../components/InpField"));
const Form = dynamic(() => import("../components/Form"));

const createUser = async userData => {
  const reponse = await fetch("/api/auth/signUp", {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await reponse.json();
  if (!reponse.ok) {
    throw new Error(data.message || "Something went wrong!");
  }
  return data;
};

function Register() {
  const [userCredentials, setUserCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleChange = e => {
    const { name, value } = e.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  };

  const formSubmitHandler = async e => {
    closeSnackbar();
    if (userCredentials.password !== userCredentials.password) {
      enqueueSnackbar("Passwords don't match", { variant: "error" });
      return;
    }

    e.preventDefault();
    try {
      const result = await createUser(userCredentials);
      try {
        const response = await signIn("credentials", {
          redirect: false,
          email: userCredentials.email,
          password: userCredentials.password,
        });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  return (
    <Fragment>
      <HeadTag title="Register" />
      <Form onSubmit={formSubmitHandler}>
        <Typography>Register</Typography>
        <List>
          <ListItem>
            <InpField
              variant="outlined"
              name="name"
              fullWidth
              id="name"
              label="Name"
              inputProps={{ type: "text" }}
              onChange={handleChange}
            />
          </ListItem>
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
            <InpField
              variant="outlined"
              name="confirmPassword"
              fullWidth
              id="confirmPassword"
              label="confirm Password"
              inputProps={{ type: "password" }}
              onChange={handleChange}
            />
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Register
            </Button>
          </ListItem>
          <ListItem>
            Do you have an account? &nbsp;
            <Link href="/login" passHref>
              <MuiLink> Login</MuiLink>
            </Link>
          </ListItem>
        </List>
      </Form>
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
export default Register;
