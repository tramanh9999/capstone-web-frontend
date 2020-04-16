import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../layouts/main-layout/MainLayout';
import StoryCard from '../../../components/common/StoryCard';
import MySpinner from '../../../components/common/MySpinner';
import StoryService from '../../../services/story.service';
import { Button } from '@material-ui/core';


const HomePage = () => {

    const [trendStories, setTrendStories] = useState([]);
    const [trendStoriesLoading, setTrendStoriesLoading] = useState(false);

    const [suggestedStories, setsuggestedStories] = useState([]);
    const [suggestedStoriesLoading, setsuggestedStoriesLoading] = useState(false);

    const [pageNoRating, setPageNoRating] = useState(1);
    const [pageNoHistory, setPageNoHistory] = useState(1);

    useEffect(() => {
        getTrendStories();
         getsuggestedStories();
    }, []);
   

    const getTrendStories = async () => {
        setTrendStoriesLoading(true);
        try {
            const res = await StoryService.getTrendStories(12);
            console.log(res);
            setTrendStories(res.data);

        } catch (error) {
            console.log(error);
        }
        setTrendStoriesLoading(false);
    }

    const getsuggestedStories = async () => {
        setsuggestedStoriesLoading(true);
        try {
            
            var array = [...suggestedStories]
            if (array.length > 1) {
                
                setPageNoRating(pageNoRating + 1);
                const pageNumber = pageNoRating + 1;
                const res = await StoryService.getSuggestion(pageNumber);
                console.log(res);
                res.data.content.forEach(element => {
                    setsuggestedStories(story => [...story, element]);
                });
            } else {
                const res = await StoryService.getSuggestion(1);
                console.log(res);
                setsuggestedStories(res.data.content);
            }
            console.log(suggestedStories);
        } catch (error) {
            console.log(error);
          
        }
        setsuggestedStoriesLoading(false);
        
    }

    return (
        <MainLayout>
            <div className="container-fluid">
                <h4 className="text-bold">Gợi ý cho bạn</h4>
                <hr style={{ border: '1px solid #ccc' }} />
                {!suggestedStoriesLoading && (
                     <div className="row">
                        {suggestedStories.map(story => (
                            <div className="col-sm-3 px-2" key={story.id}>
                                <StoryCard story={story} />
                            </div>
                        ))}
                    </div>
                )}
                {suggestedStoriesLoading && <MySpinner/>}



                <h4 className="text-bold mt-5">Danh sách thịnh hành</h4>
                <hr style={{ border: '1px solid #ccc' }} />
                {!trendStoriesLoading && (
                    <div className="row">
                        {trendStories.map(story => (
                            <div className="col-sm-12 col-md-6 col-lg-3 px-2" key={story.id}>
                                <StoryCard story={story} />
                            </div>
                        ))}
                    </div>
                )}
                {trendStoriesLoading && <MySpinner/>}

           </div>
        </MainLayout>
    );
};


export default HomePage;
