import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const StyledRating = withStyles({
    iconFilled: {
      color: '#ff6d75',
    },
    iconHover: {
      color: '#ff3d47',
    },
  })(Rating);

const customIcons = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon />,
        label: 'Quá tệ',
    },
    2: {
        icon: <SentimentDissatisfiedIcon />,
        label: 'Tệ',
    },
    3: {
        icon: <SentimentSatisfiedIcon />,
        label: 'Hài lòng',
    },
    4: {
        icon: <SentimentSatisfiedAltIcon />,
        label: 'Hay',
    },
    5: {
        icon: <SentimentVerySatisfiedIcon />,
        label: 'Rất hay',
    },
};

const MyRating = (props) => {
    const { value, onChange } = props;

    return (
        <Box component="fieldset" mb={3} 
            borderColor="transparent">
            <Rating
                name="customized-empty"
                value={value}
                precision={0.5}
                onChange={(e, value) => {
                    onChange(value);
                }}
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
            />
      </Box>
    );
};


export default MyRating;
