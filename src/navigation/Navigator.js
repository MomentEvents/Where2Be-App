import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

// This class contains all of the methods used to move between screens. It is used in the AppNav.js class,
// in which the Router.js class has a reference to this navigation object.

// This function navigates to a new part of the screen. Name should be a name of a component in the router.js file.
// Params should be thought of as parameters you want to pass in between the screens
export function navigate(name, params) {
    if(navigationRef.isReady()){
        navigationRef.navigate(name, params);
    }
}

// This function is the same as navigate()
export function push(name, params) {
    if(navigationRef.isReady()){
        navigationRef.navigate(name, params);
    }
}

// This function pops a screen from the stack.
export function pop(){
    if(navigationRef.isReady() && navigationRef.canGoBack()){
        navigationRef.goBack();
    }
}
// This function is the same as pop()
export function goBack(){
    if(navigationRef.isReady() && navigationRef.canGoBack()){
        navigationRef.goBack();
    }
}

// This function pops a screen until it cannot pop screens anymore
export function popToTop(){
    while(navigationRef.canGoBack()){
        navigationRef.goBack();
    }
}