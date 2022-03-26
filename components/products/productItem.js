import Link from "next/link";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import Image from "next/image";

function ProductItem({ product, addToCartHandler }) {
  return (
    <Card>
      <Link href={`/product/${product.slug}`} passHref>
        <CardActionArea>
          <CardMedia>
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={400}
              layout="responsive"
            />
          </CardMedia>
          <CardContent>
            <Typography>{product.name}</Typography>
            <Rating value={product.rating} readOnly></Rating>
          </CardContent>
        </CardActionArea>
      </Link>
      <CardActions>
        <Typography>$ {product.price}</Typography>
        <Button
          size="small"
          color="primary"
          onClick={() => addToCartHandler(product)}
        >
          Add To Cart
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductItem;
