This is our services folder. The purpose of the services folder is to 
have an organized way for us to centralize and reuse our backend calls while making 
it easy for us to debug any issues we have.

Usage for services:

const someResult = await someService(someParameter).catch((error) => {Alert.alert("Error", error)})

someResult will be the intended result if the promise resolves (aka a successful result occurs).
someResult will be undefined if the promise rejects (aka an error result)