import React, { createContext } from "react";

type EventContextType = {
}

export const EventContext = createContext<EventContextType>({
})
export const EventProvider = ({ children }) => {

    // This is to be done at a later update
    return(
        <EventContext.Provider value={{}}>
            {children}
        </EventContext.Provider>
    )
}