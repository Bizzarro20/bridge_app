const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();
var request = require("request");


const mongodb_connection_string = "mongodb+srv://Bizzarro20:ProgettoWeb@cluster0-sr8wq.mongodb.net/DrinkAdvisor?retryWrites=true&w=majority"

function get_drink(drink){
    let connAPI = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`
    return new Promise(function (result, reject) {
        request.get(connAPI, function (err,resp, body) {
            if (err){
                reject(err);
            }else{
                let res = JSON.parse(body);
                if (res.total_results == 0) {
                    result(-1)
                }else {
                    let a = [];
                    for (let i = 0; i < res.drinks.length; i++) {
                        a.push(res.drinks[i].strDrink);
                        result(a);
                    }
                }
            }
        })
    })
}



/*
function get_two_cities(city1, city2){
    let res1 = get_latlon(city1);
    let res2 = get_latlon(city2);
    return new Promise(function (resolve, reject) {
        res1.then(values => {
            let lat1 = values[0];
            let lon1 = values[1];
            res2.then(values2 => {
                let lat2 = values2[0];
                let lon2 = values2[1];
                //console.log([lat1, lat2, lon1, lon2])
                resolve([lat1, lat2, lon1, lon2]);
            })
        });
    })
}

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}
*/
MongoClient.connect(mongodb_connection_string, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('DrinkAdvisor')
        const userCollection = db.collection('users') //!!!!!!!!!!
        const pubCollection = db.collection('pubs') //!!!!!!!!!!
        const reviewCollection = db.collection('reviews');

        app.use(bodyParser.urlencoded({extended: true}));
        app.set('view engine', 'ejs')

        app.listen(3001, function () {
            console.log('listening on 3001')
            //console.log( compare_ns("33° 51' 17.33652'' S","45° 28' 0.48000'' N") );
        });

        //pagina iniziale
        app.get('/', (req, res) => {
            res.render('login.ejs', {data: {"status": " "}})
        });


        app.get('/userRegistration', (req, res) => {
            res.render('user_registration.ejs', {data: {"status": " "}})
        });

        app.get('/pubRegistration', (req, res) => {
            res.render('pub_registration.ejs', {data: {"status": " "}})
        });

        app.post('/search_drink', (req,res) => {
            console.log('=====================')
            console.log(req.body)
            console.log('=====================')
            let searchdrink = req.body.searchdrink;
            console.log(searchdrink);
            let d = get_drink(searchdrink);
            d.then(value => {
                console.log("fatta!");
                console.log(value);
                res.render('user_page.ejs', {data: {"lista": value}});
            }).catch(error => {
                res.render('user_page.ejs', {data: {"lista": "errore"}})
                console.log("nope!");
                //console.log(error)
            });
            //console.log(res);
            //res.render('user_page.ejs', {data: {"status": "tutto bene"}})

        });

        app.post('/user_register', (req, res) => {
            console.log('=====================')
            console.log(req.body)
            console.log('=====================')
            let name = req.body.name;
            let email = req.body.email;
            let password = req.body.password;
            //console.log("The random beer is:", value)
            let dati = {
                "name": name,
                "email": email,
                "password": password
            };
            var promise = new Promise((resolve, reject) => {
                request.post("http://localhost:3000/users", {json: dati},
                    (error, response, body) => {
                        if (error) {
                            //console.log("nope!");
                            reject(error);
                        }// promise is rejected
                        //console.log("yup!");
                        //console.log(resp.name);
                        resolve(body); // promise is fulfilled
                    });
            }).then(value => {
                console.log("fatta!");
                console.log(value)
                if (value.name == 'MongoError') {
                    res.render('homepage.ejs', {data: {"status": "Error on DB"}})
                    //res.redirect("/")
                } else {
                    if (value.token == null) {
                        res.render('login.ejs', {data: {"status": "error of some kind"}})
                    } else {
                        res.render('login.ejs', {data: {"status": "success: the token is " + value.token}})

                    }
                }
            })
                .catch(error => {
                    res.render('user_registration.ejs', {data: {"status": "errore"}})
                    console.log("nope!");
                    //console.log(error)
                });


        });

        app.post('/pub_register', (req, res) => {
            console.log('=====================')
            console.log(req.body)
            console.log('=====================')
            let ditta = req.body.ditta;
            let email = req.body.email;
            let password = req.body.password;
            //console.log("The random beer is:", value)
            let dati = {
                "ditta": ditta,
                "email": email,
                "password": password
            };
            var promise = new Promise((resolve, reject) => {
                request.post("http://localhost:3002/pubs", {json: dati},
                    (error, response, body) => {
                        if (error) {
                            //console.log("nope!");
                            reject(error);
                        }// promise is rejected
                        //console.log("yup!");
                        //console.log(resp.name);
                        resolve(body); // promise is fulfilled
                    });
            }).then(value => {
                console.log("fatta!");
                console.log(value)

                if (value.name == 'MongoError') {
                    res.render('homepage.ejs', {data: {"status": "Error on DB"}})
                    //res.redirect("/")
                } else {
                    if (value.token == null) {
                        res.render('login.ejs', {data: {"status": "error of some kind"}})
                    } else {
                        res.render('login.ejs', {data: {"status": "success: the token is " + value.token}})

                    }
                }
            })
                .catch(error => {
                    res.render('pub_registration.ejs', {data: {"status": "errore"}})
                    console.log("nope!");
                    //console.log(error)
                });


        });

        app.post('/user_login', (req, res) => {
            console.log('=====================')
            console.log(req.body)
            console.log('=====================')
            let email = req.body.emaillogin;
            let password = req.body.passwordlogin;
            let dati = {
                "email": email,
                "password": password
            };
            var promise = new Promise((resolve, reject) => {
                request.post("http://localhost:3000/users/login", {json: dati},
                    (error, response, body) => {
                        if (error) {
                            reject(error);
                        }
                        resolve(body);
                    });
            }).then(value => {
                console.log("fatta!");
                /*
                //console.log(value)

                let token = value.token;
                if (token) {
                    res.render('homepage.ejs', {data: {"status": token}})
                    //res.redirect("/")
                } else {
                    res.render('login.ejs', {data: {"status": "error on login"}})
                    //res.redirect({data: {"status":token}},"/")
                }
*/
                res.render('user_page.ejs', {data: {"status": ""}});
                //window.location.replace('/user_page.ejs');

            })
                .catch(error => {
                    res.render('login.ejs', {data: {"status": "errore"}})
                    console.log("nope!");
                    //console.log(error)
                });


        });


        app.post('/pub_login', (req, res) => {
            console.log('=====================')
            console.log(req.body)
            console.log('=====================')
            let email = req.body.emaillogin;
            let password = req.body.passwordlogin;
            let dati = {
                "email": email,
                "password": password
            };
            var promise = new Promise((resolve, reject) => {
                request.post("http://localhost:3002/pubs/login", {json: dati},
                    (error, response, body) => {
                        if (error) {
                            reject(error);
                        }
                        resolve(body);
                    });
            }).then(value => {
                console.log("fatta!");
                //console.log(value)
                let token = value.token;
                if (token) {
                    res.render('homepage.ejs', {data: {"status": token}})
                    //res.redirect("/")
                } else {
                    res.render('login.ejs', {data: {"status": "error on login"}})
                    //res.redirect({data: {"status":token}},"/")
                }

                //res.redirect("/")
            }).catch(error => {
                res.render('login.ejs', {data: {"status": "errore"}})
                console.log("nope!");
                //console.log(error)
            });


        });
        app.post('/insert_review', (req, res) => {
            console.log('=====================')
            console.log(req.body)
            console.log('=====================')
            let user = req.body.user;
            let pub = req.body.pub;
            let drink = req.body.drink;
            let rank = req.body.rank;
            let dati = {
                "timestamp": Date.now(),
                "user": user,
                "pub": pub,
                "drink": drink,
                "rank": rank
            };
            var promise = new Promise((resolve, reject) => {
                request.post("http://localhost:3003/review", {json: dati},
                    (error, response, body) => {
                        if (error) {
                            reject(error);
                        }
                        resolve(body);
                    });
            }).then(value => {
                console.log("fatta!");
                //console.log(value)
                res.render('user_page.ejs', {data: {"status": "review saved"}});

                //res.redirect("/")
            }).catch(error => {
                res.render('login.ejs', {data: {"status": "errore"}})
                console.log("nope!");
                //console.log(error)
            })
        })
    }).catch(error => console.error(error));


