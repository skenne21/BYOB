# BYOB

## Group: [Sabrina Kennedy](https://github.com/skenne21), [Steven Lawson](https://github.com/stevenleelawson)

## Description

This API provides access to two endpoints: States and National Parks. Each park provides information about name, location, date created, the state the park is located in, the summary of the park to give users more information about all the national parks in the United States. Each state end-point provides name, abbreviations, date in statehood and capital. You can search all the parks located by state name or by the abbreviation of the state. USers need to register with email and name of their application to gain a web token to use on the GET endpoints. ADMIN access tokens are given to users to be able to access the  PUT, DELETE, POST endpoints for both states and parks.

[Click Here to get access to token](https://skenne21.herokuapp.com/)

This project was to build a RESTful API with node.js, express with knex. Using JSON web tokens to authicate users for accesss to the API. Project specs are [located here](http://frontend.turing.io/projects/build-your-own-backend.html)

## Set Up

Clone this projects repo: (https://github.com/skenne21/BYOB)

Run `npm install` from the root directory

Run `npm start`

once your server is up and running visit localhost:300, to view form needed to gain access for API.

You can run the lint with `npm  run eslint`

You can run the testing suite with `npm test`.

___
## Endpoints Available 

### GET Endpoints:

#### GET States

 `GET /api/v1/states`
 
 ##### Required Params
 | Name      | Type           | Description  |
| ------------- |:-------------:| -----:|
| token     | string | public access|
| abbv     | string | state abbreviation (CO) |

##### Description

+ Can GET all states or you can add request params of the abbreviation of the State.

##### Example Request

`GET /api/v1/states?token=tokenstring`

##### Example Response

```
{
id: 1,
name: "Alabama",
abbv: "AL",
capital: "Montgomery",
stateHood: "December 14, 1819",
created_at: "2018-05-15T21:13:35.341Z",
updated_at: "2018-05-15T21:13:35.341Z"
},
{
id: 2,
name: "Alaska",
abbv: "AK",
capital: "Juneau",
stateHood: "January 3, 1959",
created_at: "2018-05-15T21:13:35.341Z",
updated_at: "2018-05-15T21:13:35.341Z"
}

```
##### Example Request

`GET /api/v1/states/abbv=AL?token=tokenstring`

##### Example Response

```
{
id: 1,
name: "Alabama",
abbv: "AL",
capital: "Montgomery",
stateHood: "December 14, 1819",
created_at: "2018-05-15T21:13:35.341Z",
updated_at: "2018-05-15T21:13:35.341Z"
}

```

#### Get Parks

 `GET /api/v1/parks`
 
 ##### Required Params
 
 | Name      | Type           | Description  |
| ------------- |:-------------:| -----:|
| token     | string | public access|

##### Description

+ Can GET all National Parks.

##### Example Request

`GET /api/v1/parks?token=tokenstring`

##### Example Response

```
{
id: 1,
name: "Acadia",
date_open: "February 26, 1919",
latLong: "44.35°N 68.21°W",
location: "Maine",
summary: "Covering most of Mount Desert Island and other coastal islands, Acadia features the tallest mountain on the Atlantic coast of the United States, granite peaks, ocean shoreline, woodlands, and lakes. There are freshwater, estuary, forest, and intertidal habitats.",
state_id: 19,
created_at: "2018-05-15T21:13:35.397Z",
updated_at: "2018-05-15T21:13:35.397Z"
},

{
id: 2,
name: "Badlands",
date_open: "November 10, 1978",
latLong: "43.75°N 102.50°W",
location: "South Dakota",
summary: "The Badlands are a collection of buttes, pinnacles, spires, and mixed-grass prairies. The White River Badlands contain the largest assemblage of known late Eocene and Oligocene mammal fossils. The wildlife includes bison, bighorn sheep, black-footed ferrets, and prairie dogs.",
state_id: 41,
created_at: "2018-05-15T21:13:35.400Z",
updated_at: "2018-05-15T21:13:35.400Z"
}

```

#### Get an State With ID

 `GET /api/v1/states/:id`
 
 ##### Required Params
 
 | Name      | Type           | Description  |
| ------------- |:-------------:| -----:|
| token     | string | public access|
| id     | number | specific state id |

##### Description

+ Can GET one specific state with dynamic ID.

##### Example Request

`GET /api/v1/states/:id?token=tokenstring`

##### Example Response

```
{
id: 1,
name: "Alabama",
abbv: "AL",
capital: "Montgomery",
stateHood: "December 14, 1819",
created_at: "2018-05-15T21:13:35.341Z",
updated_at: "2018-05-15T21:13:35.341Z"
}

```

#### Get an Park With ID

 `GET /api/v1/parks/:id`
 
 ##### Required Params
 
 | Name      | Type           | Description  |
| ------------- |:-------------:| -----:|
| token     | string | public access|
| id     | number | specific state id |

##### Description

+ Can GET one specific park with dynamic ID.

##### Example Request

`GET /api/v1/parks/:id?token=tokenstring`

##### Example Response

```
{
id: 1,
name: "Acadia",
date_open: "February 26, 1919",
latLong: "44.35°N 68.21°W",
location: "Maine",
summary: "Covering most of Mount Desert Island and other coastal islands, Acadia features the tallest mountain on the Atlantic coast of the United States, granite peaks, ocean shoreline, woodlands, and lakes. There are freshwater, estuary, forest, and intertidal habitats.",
state_id: 19,
created_at: "2018-05-15T21:13:35.397Z",
updated_at: "2018-05-15T21:13:35.397Z"
}

```

#### Get All The Parks With a Certain State ID 

 `GET /api/v1/states/:id/parks`
 
 ##### Required Params
 
 | Name      | Type           | Description  |
| ------------- |:-------------:| -----:|
| token     | string | public access|
| id     | number | specific state id |

##### Description

+ Can GET all National Parks with a specific dynamic State ID.

##### Example Request

`GET /api/v1/states/:id/parks?token=tokenstring`

##### Example Response

```
{
id: 16,
name: "Denali ",
date_open: "February 26, 1917",
latLong: "63.33°N 150.50°W",
location: "Alaska",
summary: "Centered on Denali, the tallest mountain in North America, Denali is serviced by a single road leading to Wonder Lake. Denali and other peaks of the Alaska Range are covered with long glaciers and boreal forest. Wildlife includes grizzly bears, Dall sheep, caribou, and gray wolves. (BR)",
state_id: 2,
created_at: "2018-05-15T21:13:35.411Z",
updated_at: "2018-05-15T21:13:35.411Z"
},
{
id: 17,
name: "Gates of the Arctic",
date_open: "December 2, 1980",
latLong: "67.78°N 153.30°W",
location: "Alaska",
summary: "The countrys northernmost park protects an expanse of pure wilderness in Alaskas Brooks Range and has no park facilities. The land is home to Alaska Natives who have relied on the land and caribou for , years.",
state_id: 2,
created_at: "2018-05-15T21:13:35.411Z",
updated_at: "2018-05-15T21:13:35.411Z"
},
{
id: 22,
name: "Glacier Bay ",
date_open: "December 2, 1980",
latLong: "58.50°N 137.00°W",
location: "Alaska",
summary: "Glacier Bay contains tidewater glaciers, mountains, fjords, and a temperate rainforest, and is home to large populations of grizzly bears, mountain goats, whales, seals, and eagles. When discovered in by George Vancouver, the entire bay was covered by ice, but the glaciers have since receded more than miles ( km). (WHS) (BR)",
state_id: 2,
created_at: "2018-05-15T21:13:35.413Z",
updated_at: "2018-05-15T21:13:35.413Z"
},


```
___

### POST Endpoints:

#### Authorization:

Admin JSON Web Token is required to access theses endpoints, emails ending with turing.io are required to register for admin token.

#### POST States

 `POST /api/v1/states`
 
 ##### Required Params
 
 | Name      | Type           | Description  |
| ------------- |:-------------:| -----:|
| token     | string | private|
| name     | string | state name |
| abbv     | string | state abbreviation |
| capital     | string | state capital |
| stateHood    | string | date state came into statehood |

##### Description

+ Can POST a new state.

##### Example Request

`POST /api/v1/states?token=adminTokenString`

##### Example Response

```
{
name: "Hawaii",
abbv: "HW",
capital: "Montgomery",
stateHood: "December 14, 1819",
}

```

#### POST States

 `POST /api/v1/parks`
 
 ##### Required Params
 
 | Name      | Type           | Description  |
| ------------- |:-------------:| -----:|
| token  | string | private|
| name  | string | Park Name |
| location | string | State Park is Located In |
| date_open | string | Date Park Opened |
| latLong | string | latitude and longitude of park |
| summary | string | description of park |
| state_id | number | state Id of park is related with |


##### Description

+ Can POST a new park.

##### Example Request

`POST /api/v1/states?token=adminTokenString`

##### Example Response

```
{

name: "Bay ",
date_open: "December 2, 1980",
latLong: "58.50°N 137.00°W",
location: "Alaska",
summary: "Glacier Bay contains tidewater glaciers, mountains, fjords, and a temperate rainforest, and is home to large populations of grizzly bears, mountain goats, whales, seals, and eagles. When discovered in by George Vancouver, the entire bay was covered by ice, but the glaciers have since receded more than miles ( km). (WHS) (BR)",
state_id: 2,

}

```

___

### DELETE Endpoints:

#### Authorization:

Admin JSON Web Token is required to access theses endpoints, emails ending with turing.io are required to register for admin token.

#### DELETE States

 `DELETE /api/v1/states/:id`
 
 ##### Required Params
 
 | Name      | Type           | Description  |
| ------------- |:-------------:| -----:|
| token     | string | private|
| id    | string | state wanting to remove |

##### Description

+ Can DELETE a state.

##### Example Request

`DELETE /api/v1/states/:id?token=adminTokenString`

##### Example Response

```
{
id: 1
}

```

#### DELETE Parks

 `DELETE /api/v1/parks/:id`
 
 ##### Required Params
 
 | Name      | Type           | Description  |
| ------------- |:-------------:| -----:|
| token     | string | private|
| id    | string | park wanting to remove |

##### Description

+ Can DELETE a park.

##### Example Request

`DELETE /api/v1/parks/:id?token=adminTokenString`

##### Example Response

```
{
id: 1
}

```
___

### PUT Endpoints:

#### Authorization:

Admin JSON Web Token is required to access theses endpoints, emails ending with turing.io are required to register for admin token.

#### PUT States

 `PUT /api/v1/states/:id`
 
 ##### Required Params
 
 | Name      | Type           | Description  |
| ------------- |:-------------:| -----:|
| token     | string | private|
| name     | string | state name |
| abbv     | string | state abbreviation |
| capital     | string | state capital |
| stateHood    | string | date state came into statehood |

##### Description

+ Can PUT to replace a whole state.

##### Example Request

`PUT /api/v1/states/:id?token=adminTokenString`

##### Example Response

```
{
id: 1
}

```

#### PUT States

 `PUT /api/v1/parks/:id`
 
 ##### Required Params
 
  | Name      | Type           | Description  |
| ------------- |:-------------:| -----:|
| token  | string | private|
| name  | string | Park Name |
| location | string | State Park is Located In |
| date_open | string | Date Park Opened |
| latLong | string | latitude and longitude of park |
| summary | string | description of park |
| state_id | number | state Id of park is related with |

##### Description

+ Can PUT to replace a whole park.

##### Example Request

`PUT /api/v1/parks/:id?token=adminTokenString`

##### Example Response

```
{
id: 1
}

```


