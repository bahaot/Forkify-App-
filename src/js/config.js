/*
--- many real world applications have 2 special modules are completly independent from the rest of the architecture 
1) module for the project configuration
2) module for some general helper functions that are gonna be useful across the entire project 


--- this one is configuration module: 
- into this file we will put all the variables that should be constansts and sholud be reused accross the project 
- the goal of having this file with all these variable is that will allow us to easily configure our project
  by simply changing some of the data that is here in this configuration file 
- we will not put all the variables, the only variables that we do want here are the ones that are resbonsiple 
for kind of defining some important data about tha application itself

*/

export const FORKIFY_API_URL = `https://forkify-api.herokuapp.com/api/v2/recipes/`;
// im using uppercase becasue this is a constant that will never change
export const TIMEOUT_SEC = 10;

export const RES_PER_PAGE = 10;

export const KEY = "b5e8b845-2c37-453f-9ba6-fafc77a4331e";

export const MODAL_CLOSE_SECONDS = 2.5;
