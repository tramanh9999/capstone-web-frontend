import React from 'react';
import {
    EmailShareButton,
    FacebookShareButton,
    FacebookIcon,
    EmailIcon,
    
  } from "react-share";

const SocialShare = (props) => {
    const { shareUrl } = props;

    return (
        // <FacebookShareCount size={32} round={true} url={shareUrl} >facebook share</FacebookShareCount>
        <div className="mt-3">
            <FacebookShareButton url={shareUrl} quote={''}>
                <FacebookIcon round={true} size={30}/>
            </FacebookShareButton>{"  "}
            <EmailShareButton url={shareUrl}>
                <EmailIcon round={true} size={30}/>
            </EmailShareButton>
        </div>
    );
};


export default SocialShare;
