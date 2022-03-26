import Box from "@mui/material/Box";
import Link from "next/link";
import { Fragment, useContext, useState } from "react";
import AdminContext from "../../../store/admin/adminContext";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import { useSnackbar } from "notistack";
import dynamic from "next/dynamic";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import Grid from "@mui/material/Grid";
const HeadTag = dynamic(() => import("../../../components/layout/HeadTag"));

function AddProduct() {
  const adminContext = useContext(AdminContext);
  const { enqueueSnackbar } = useSnackbar();

  const {
    createRequest,
    createSuccess,
    createFail,
    loadingCreate,
    uploadRequest,
    uploadSuccess,
    uploadFail,
    loadingUpload,
    loading,
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
  const handleChange = e => {
    const { value, name } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const submitHandler = async e => {
    e.preventDefault();
    try {
      createRequest();
      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: JSON.stringify({ product }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      createSuccess();
      enqueueSnackbar("New Item added", { variant: "success" });
      router.push(`/admin/products`);
    } catch (err) {
      createFail();
    }
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

      setProduct({
        ...product,
        image: data.secure_url,
      });
      uploadSuccess();
    } catch (err) {
      uploadFail();
    }
  };
  return (
    <Fragment>
      <HeadTag title="Add Product" />
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card>
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
              <ListItem>
                <Typography component="h1" variant="h1">
                  Add Product
                </Typography>
              </ListItem>

              <ListItem>
                <Box sx={{ width: "100%" }}>
                  <form onSubmit={submitHandler}>
                    <List>
                      <ListItem>
                        <TextField
                          placeholder="ex:free shirt"
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
                          placeholder="ex: free-shirt"
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
                          placeholder="ex: 80"
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
                          placeholder="ex: Shirts"
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
                          placeholder="ex: Nike"
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
                          placeholder="ex: 100"
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
                          placeholder="ex: A popular shirt"
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
                          Add Product
                        </Button>
                        {loadingCreate && <CircularProgress />}
                      </ListItem>
                    </List>
                  </form>
                </Box>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default dynamic(() => Promise.resolve(AddProduct), { ssr: false });
