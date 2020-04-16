import React from 'react';
import { UserProvider } from './user.context';
import { LayoutProvider } from './layout.context';

function ProviderComposer({ contexts, children }) {
    return contexts.reduceRight((kids, parent) => (
        React.cloneElement(parent, {
            children: kids
        })
    ), children)
}

const GlobalContext = (props) => {
    const contexts = [ 
        <UserProvider/>,
        <LayoutProvider/>
    ];
    
    return (
        <ProviderComposer contexts={contexts}>
            { props.children }
        </ProviderComposer>
    )
} 

export default GlobalContext;