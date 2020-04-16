import React from 'react';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(3),
      },
    },
}));

const TagsSelect = (props) => {

    const classes = useStyles();
    const { tags, setSelectedTags, selectedTags } = props;


    return (
        <div className={classes.root}>
            <Autocomplete
                multiple
                id="tags-standard"
                options={tags}
                getOptionLabel={option => option.title}
                onChange={(e, value) => setSelectedTags(value)}
                defaultValue={selectedTags}
                renderInput={params => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Chọn thể loại"
                    />
                )}
            />
        </div>
    );
};


export default TagsSelect;
