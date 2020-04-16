import React, { useState, useEffect } from 'react';

import { MDBBtn, MDBCard, MDBCardBody, MDBFormInline, MDBIcon } from 'mdbreact';
import { Select, MenuItem, Input, ListItemText, Checkbox, Chip, FormControl, InputLabel } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import MainLayout from '../../../layouts/main-layout/MainLayout';
import StoryService from '../../../services/story.service';
import TagService from '../../../services/tag.service';


import MySpinner from '../../../components/common/MySpinner';
import StoryCard from '../../../components/common/StoryCard';
import TagsSelect from '../../../components/common/TagsSelect';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
        style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        },
    },
};

let searchTimeout = null;

const SearchStoriesPage = () => {

    const [stories, setStories] = useState([]);
    const [isLoadingStories, setIsLoadingStories] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [tags, setTags] = useState([]);
    const [filters, setFilters] = useState({
        tags: [],
        keyword: '',
        page: 1,
        itemsPerPage: 12,
    });

    useEffect( () => {
        getTags();
        getStories();
    }, []);

    const changeFilters = (prop, value) => {
        filters[prop] = value;
        setFilters({ ...filters });
       
        if(prop === 'keyword'){
            clearTimeout(searchTimeout);
            searchTimeout = window.setTimeout(() => {
                setFilters({ ...filters, page: 1 });
                getStories();
            }, 300);
        } else {
            getStories();
        }
    }

    const getTags = async () => {
        try {
            const res  = await TagService.getTags();
            setTags(res.data);
           
        } catch (error) {
            console.log(error);
        }
    }

    const getStories = async () => {
        setIsLoadingStories(true);
        const selectedTags = filters.tags.map(t => t.id);
        try {
            const res = await StoryService.searchStories({ 
                ...filters, 
                isActive: true, 
                isPublished: true, 
                tags: selectedTags
            });
            console.log(res);
            
            setStories(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.log(error);
            setStories([]);
        }
        setIsLoadingStories(false);
    }

    const changePage = (e, value) => {
        console.log(value);
        changeFilters('page', value);
    }

    const selectedTags = tags.filter(tag => filters.tags.indexOf(tag.id) > -1);

    return (
        <MainLayout>
            <div className="container-fluid">
            <div className="row">
                <div className="col-sm-3">
                    <FormControl style={{ width: '100%' }}>
                        <InputLabel>Tìm truyện, tác giá</InputLabel>
                        <Input
                            value={filters.keyword}
                            onChange={e => changeFilters('keyword', e.target.value)}
                            
                        />
                    </FormControl>
                </div>
                <div className="col-sm-6">
                    <TagsSelect
                        tags={tags} 
                        setSelectedTags={(tags) => changeFilters('tags', tags)}
                        selectedTags={filters.tags}
                    />
                </div>
            </div>
                <div className="row mt-5">
                    <div className="col-sm-3">
                        <h3 className="text-bold">Tất cả truyện</h3>
                    </div>
                    <div className="col-sm-9">
                        <Pagination 
                            style={{float: 'right'}}
                            count={totalPages} 
                            page={filters.page}
                            color="primary" 
                            onChange={changePage} />
                         <div className="clearfix"></div>
                    </div>
                </div>
                
                <hr style={{ border: '1px solid #ccc' }}/>
                {(!isLoadingStories) && (
                    <div className="row" style={{ marginBottom: '50px' }}>
                        {stories.map(story => (
                            <div className="col-sm-6 col-md-4 col-lg-3 px-2" key={story.id}>
                                <StoryCard story={story} />
                            </div>
                        ))}
                    </div>
                )}

                {(isLoadingStories) && (
                   <MySpinner/>  
                )}
                
           </div>
        </MainLayout>
    );
};


export default SearchStoriesPage;
