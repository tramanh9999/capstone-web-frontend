import React, { useState } from 'react';

export const LayoutContext = React.createContext();

export const LayoutProvider = (props) => {
   
    const [openSidebar, setOpenSidebar] = useState(true);
   
    const state = { openSidebar };
    const methods = { setOpenSidebar };

    return (
        <LayoutContext.Provider value={{
            ...state,
            ...methods
        }}>
            { props.children }
        </LayoutContext.Provider>
    )
}