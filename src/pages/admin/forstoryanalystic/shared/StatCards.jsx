import React from "react";
import { Grid, Card, IconButton, Tooltip } from "@material-ui/core";
import Icon from "@mdi/react";
import { withStyles } from "@material-ui/styles";
import { mdiCursorDefaultClickOutline } from "@mdi/js";
import { mdiEyeOutline } from "@mdi/js";
import { mdiShareOutline } from "@mdi/js";
import { mdiFlagVariantOutline } from "@mdi/js";
const styles = (theme) => ({
  icon: {
    fontSize: "44px",
    opacity: 0.6,
    // color: theme.palette.primary.main
    color: "#0277bd",
  },
value:{
  color: "#a94442",
  fontWeight: "bold",
}
  
});
// cai nay  het!

const StatCards = ({ classes, view, share, hitpoint, clicklink }) => {
  return (
    <Grid container spacing={3} className="mb-3">
      <Grid item xs={12} md={6}>
        <Card className="play-card p-sm-24 bg-paper" elevation={6}>
          <div className="flex items-center">
            <Icon path={mdiEyeOutline} color="#ccc" size={1.5} />
            <div className="ml-3" >
              <h5 className="font-medium text-muted">Lượt xem</h5>
              <h6 className="m-0 mt-1 font-medium " ><span style={{ color: "#a94442",
    fontWeight: "bold", fontSize: "28px"}}>{view} lượt</span></h6>
            </div>
          </div>
          {/* <Tooltip title="View Details" placement="top">
            <IconButton>
              <Icon>arrow_right_alt</Icon>
            </IconButton>
          </Tooltip> */}
        </Card>
      </Grid>
      {/* <Grid item xs={12} md={6}>
        <Card className="play-card p-sm-24 bg-paper" elevation={6}>
          <div className="flex items-center">
            <Icon path={mdiShareOutline} color="#ccc" size={1.5} />
            <div className="ml-3">
              <h5 className="font-medium   text-muted">Share</h5>

              <h6 className="m-0 mt-1 text-primary font-medium">
                {share} lượt
              </h6>
            </div>
          </div>
        
        </Card>
      </Grid> */}
      <Grid item xs={12} md={6}>
        <Card className="play-card p-sm-24 bg-paper" elevation={6}>
          <div className="flex items-center">
            <Icon
              path={mdiCursorDefaultClickOutline}
              color="#ccc"
              size={1.5}
            ></Icon>
            <div className="ml-3">
              <h5 className="font-medium  text-muted ">Click vào link </h5>

              <h6 className="m-0 mt-1 text-primary font-medium">
              <span style={{ color: "#a94442",
    fontWeight: "bold", fontSize: "28px"}}>{clicklink} click</span>
              </h6>
            </div>
          </div>
          {/* <Tooltip title="View Details" placement="top">
            <IconButton>
              <Icon>arrow_right_alt</Icon>
            </IconButton>
          </Tooltip> */}
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card className="play-card p-sm-24 bg-paper" elevation={6}>
          <div className="flex items-center">
          <Icon path={mdiFlagVariantOutline} size={1.5} color="#ccc"></Icon>
            <div className="ml-3">
              <h5 className="font-medium  text-muted">Hoàn thành</h5>

              <h6 className="m-0 mt-1 text-primary font-medium">
              <span style={{ color: "#a94442",
    fontWeight: "bold", fontSize: "28px"}}> {hitpoint} lượt</span>
              </h6>
            </div>
          </div>
          {/* <Tooltip title="View Details" placement="top">
            <IconButton>
              <Icon>arrow_right_alt</Icon>
            </IconButton>
          </Tooltip> */}
        </Card>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles, { withTheme: true })(StatCards);
