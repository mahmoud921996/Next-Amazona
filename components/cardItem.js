import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const CardItem = ({ price, handleClick, x, text, val, btnText }) => {
  return (
    <Card>
      <List>
        <ListItem>
          <Grid container>
            <Grid item xs={6}>
              <Typography>{x}</Typography>
            </Grid>
            <Grid item xs={6} align="right">
              <Typography>${price}</Typography>
            </Grid>
          </Grid>
        </ListItem>
        <ListItem>
          <Grid container>
            <Grid item xs={6}>
              <Typography>{text}</Typography>
            </Grid>
            <Grid item xs={6} align="right">
              <Typography>
                {/*  */}
                {val}
              </Typography>
            </Grid>
          </Grid>
        </ListItem>
        <ListItem>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleClick}
          >
            {btnText}
          </Button>
        </ListItem>
      </List>
    </Card>
  );
};

export default CardItem;
