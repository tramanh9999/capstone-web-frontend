import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

function SimpleMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [value, setValue] = React.useState();

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div>
      <Button
        variant="outlined"
        aria-owns={anchorEl ? "simple-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        Open Menu
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>1 ngày trước</MenuItem>
        <MenuItem onClick={handleClose}>5 ngày trước</MenuItem>
        <MenuItem onClick={handleClose}>28 ngày trước</MenuItem>
      </Menu>
    </div>
  );
}

export default SimpleMenu;
