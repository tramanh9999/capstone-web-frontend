import React from 'react';

const TagList = (props) => {
    const { tags } = props;

    const getBadgeClassname = (index) => {
        if(index % 3 == 0) return 'badge-primary';
        else if(index % 3 === 1) return 'badge-danger';
        return 'badge-warning';
    }

    return (
        <>
            {tags.map((tag, index) => (
                <span key={tag.id}>{tag.title}{index != (tags.length - 1) ? ', ' : ''} </span>
            ))}
        </>
    );
};

export default TagList;
