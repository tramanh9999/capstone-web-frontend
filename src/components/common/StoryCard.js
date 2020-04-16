import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import StringUtils from '../../utils/string';
// import { MDBCard, MDBCardImage, MDBCardBody, MDBCardText } from 'mdbreact';
import { Card, CardHeader, CardActionArea, Button, CardMedia, Typography, CardActions, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Star as StarIcon, Person as PersonIcon } from '@material-ui/icons';
import TagList from './TagList';
import DateTimeUtils from '../../utils/datetime';
import ValidationUtils from '../../utils/validation';
import StrirngUtils from '../../utils/string';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    marginBottom: '30px'
  },
});

const StoryCard = (props) => {
  const classes = useStyles();
  const { story } = props;

  const viewDetails = () => props.history.push('/stories/details/' + story.id);
  const readStory = () => props.history.push('/stories/read/' + story.id);

  return (
    <Card className={classes.root}>
      <CardActionArea onClick={viewDetails}>
        <CardMedia
          component="img"
          alt={story.title}
          height="140"
          image={ValidationUtils.isEmpty(story.image) ? '/assets/img/no_image.jpeg' : story.image}
          title={story.title}
        />
        <CardContent>
          {!ValidationUtils.isEmpty(story.user) && (
            <span>
              <PersonIcon /> {(story.user.name)}
            </span>
          )}
          <Typography gutterBottom variant="h5" component="h4" style={{ fontSize: '1.2em' }}>
            {story.title}
            <span className="rating-point float-right">
              {story.avgRate} <StarIcon style={{ color: 'red' }} />
            </span>
          </Typography>

          {/* <div className="mb-3">{ StringUtils.truncate(StringUtils.removeHtml(story.intro), 60) }</div> */}
          <div className="mb-3">Lượt đọc: {story.numOfRead}</div>
          <div>
            {DateTimeUtils.getDate(story.createdAt)}
          </div>

          <div className="clearfix"></div>
          <TagList tags={story.tags} />

        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" onClick={readStory}>
          Đọc truyện
          </Button>
        <Button size="small" color="secondary" onClick={viewDetails}>
          Chi tiết
          </Button>
      </CardActions>
    </Card>
  );
};


export default withRouter(StoryCard);
