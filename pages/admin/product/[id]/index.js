import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import AdminContext from "../../../../store/admin/adminContext";
import classes from "../../../../styles/style";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { useSnackbar } from "notistack";
import dynamic from "next/dynamic";
const Form = dynamic(() => import("../../../../components/Form"));
const HeadTag = dynamic(() => import("../../../../components/layout/HeadTag"));

function EditProduct(props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const productId = props.params.id;
  const router = useRouter();
  const adminContext = useContext(AdminContext);
  const {
    loading,
    error,
    fetchOrderFail,
    fetchOrderStart,
    fetchOrderSuccess,
    loadingUpdate,
    updateRequest,
    updateSuccess,
    updateFail,
    uploadRequest,
    uploadSuccess,
    uploadFail,
    loadingUpload,
  } = adminContext;
  const [product, setProduct] = useState({
    name: "",
    price: "",
    slug: "",
    image: "",
    category: "",
    countInStock: "",
    brand: "",
    description: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchOrderStart();
        const response = await fetch(`/api/admin/products/${productId}`);
        const { product } = await response.json();
        fetchOrderSuccess();
        setProduct({
          name: product.name,
          price: product.price,
          slug: product.slug,
          image: product.image,
          category: product.category,
          countInStock: product.countInStock,
          brand: product.brand,
          description: product.description,
        });
      } catch (err) {
        fetchOrderFail();
      }
    };
    fetchData();
  }, []);
  const submitHandler = async e => {
    e.preventDefault();
    closeSnackbar();

    try {
      updateRequest();
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        body: JSON.stringify({ product }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      updateSuccess();
      enqueueSnackbar(data.message, { variant: "success" });
      router.push("/admin/products");
    } catch (error) {
      updateFail();
      enqueueSnackbar(error, { variant: "error" });
    }
  };
  const handleChange = e => {
    const { value, name } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const uploadHandler = async e => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    bodyFormData.append("upload_preset", "uploads");
    try {
      uploadRequest();
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/next-amazona22/image/upload",
        {
          method: "POST",
          body: bodyFormData,
        }
      );
      const data = await response.json();
      console.log(data);
      uploadSuccess();
      setProduct({
        ...product,
        image: data.secure_url,
      });
      enqueueSnackbar("File uploaded successfully", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err, { variant: "error" });
      uploadFail(err);
    }
  };
  return (
    <Fragment>
      <HeadTag title={`Edit product ${productId}`} />
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card sx={classes.section}>
            <List>
              <Link href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                </ListItem>
              </Link>
              <Link href="/admin/orders" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Orders"></ListItemText>
                </ListItem>
              </Link>
              <Link href="/admin/products" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Products"></ListItemText>
                </ListItem>
              </Link>
              <Link href="/admin/users" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Users"></ListItemText>
                </ListItem>
              </Link>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card>
            <List>
              <Grid container>
                <Grid item md={6}></Grid>
                <ListItem>
                  <Typography component="h1" variant="h1">
                    Edit Product {productId}
                  </Typography>
                </ListItem>
              </Grid>
              <ListItem>
                {loading && <CircularProgress></CircularProgress>}
                {error && <Typography sx={classes.error}>{error}</Typography>}
              </ListItem>
              <ListItem>
                <Box sx={{ width: "100%" }}>
                  <Form onSubmit={submitHandler}>
                    <List>
                      <ListItem>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="name"
                          name="name"
                          label="Name"
                          inputProps={{ type: "text" }}
                          value={product.name}
                          onChange={handleChange}
                        ></TextField>
                      </ListItem>
                      <ListItem>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="slug"
                          name="slug"
                          label="Slug"
                          inputProps={{ type: "text" }}
                          value={product.slug}
                          onChange={handleChange}
                        ></TextField>
                      </ListItem>
                      <ListItem>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="price"
                          name="price"
                          label="Price"
                          inputProps={{ type: "text" }}
                          value={product.price}
                          onChange={handleChange}
                        ></TextField>
                      </ListItem>
                      <ListItem>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="image"
                          name="image"
                          label="Image"
                          inputProps={{ type: "text" }}
                          value={product.image}
                          onChange={handleChange}
                        ></TextField>
                      </ListItem>
                      <ListItem>
                        <Button variant="contained" component="label">
                          Upload File
                          <input type="file" onChange={uploadHandler} hidden />
                        </Button>
                        {loadingUpload && <CircularProgress />}
                      </ListItem>
                      <ListItem>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="category"
                          name="category"
                          label="Category"
                          inputProps={{ type: "text" }}
                          value={product.category}
                          onChange={handleChange}
                        ></TextField>
                      </ListItem>
                      <ListItem>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="brand"
                          name="brand"
                          label="Brand"
                          value={product.brand}
                          onChange={handleChange}
                          inputProps={{ type: "text" }}
                        ></TextField>
                      </ListItem>
                      <ListItem>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="countInStock"
                          name="countInStock"
                          label="CountInStock"
                          value={product.countInStock}
                          inputProps={{ type: "text" }}
                          onChange={handleChange}
                        ></TextField>
                      </ListItem>
                      <ListItem>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id="description"
                          name="description"
                          label="Description"
                          value={product.description}
                          onChange={handleChange}
                          inputProps={{ type: "text" }}
                        ></TextField>
                      </ListItem>

                      <ListItem>
                        <Button
                          variant="contained"
                          type="submit"
                          fullWidth
                          color="primary"
                        >
                          Update
                        </Button>
                        {loadingUpdate && <CircularProgress />}
                      </ListItem>
                    </List>
                  </Form>
                </Box>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: {
      params,
    },
  };
}
export default dynamic(() => Promise.resolve(EditProduct), { ssr: false });
