const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();
var request = require("request");


const mongodb_connection_string = "mongodb+srv://Bizzarro20:ProgettoWeb@cluster0-sr8wq.mongodb.net/DrinkAdvisor?retryWrites=true&w=majority"


//funzione sanitize per considerare solo le colonne necessarie ottenute dal API
function convert_to_list(o) {
    var a = [];
    for (let i = 0; i < o.length; i++) {
        a.push([o[i].idDrink, o[i].strDrink, o[i].strCategory, o[i].strAlcoholic, o[i].strGlass, o[i].strIngredient1])
    }
    return a;
}

//ottengo una lista di json legate alla ricerca fatta.
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
//                        a.push(res.drinks[i].idDrink);
                        a.push(res.drinks[i]);

                        //result(a);
                    }
                    let b = convert_to_list(a);
                    result(b);
                }
            }
        })
    })
}

//sanitize list pub reviews
function get_my_pub_reviews(o, p) {
    let a = [];
    for (let i = 0; i < o.review.length; i++) {
        if (o.review[i].pub == p) {
            a.push(o.review[i].timestamp, o.review[i]._id, o.review[i].user, o.review[i].drink, o.review[i].rank, o.review[i].comment)
        }
    }
    return a;
}

//sanitize list user reviews
function get_user_reviews(o, u){
    let a = [];
    for (let i = 0; i < o.review.length; i++) {
        if (o.review[i].user == u) {
            a.push(o.review[i].timestamp, o.review[i]._id, o.review[i].pub, o.review[i].drink, o.review[i].rank, o.review[i].comment)
        }
    }
    return a;
}

//sanitize the list of all pubs
function get_all_pub_names (o){
    let b = [];
    for (let i = 0; i < o.pub.length; i++) {
        b.push(o.pub[i].ditta);
    }
    return b;
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
        const db = client.db('DrinkAdvisor')    //nome del db
        const userCollection = db.collection('users') //!!!!!!!!!!
        const pubCollection = db.collection('pubs') //!!!!!!!!!!
        const reviewCollection = db.collection('reviews');

        //variabili globali per salvare il user e pub loggati
        var user_token_value = 0;
        var userdata = "";

        var pub_token_value = 0;
        var pubdata = "";



        app.use(bodyParser.urlencoded({extended: true}));  //cosi posso parsare ciò che arriva dalle form action cosi arrivano come json  le req
        app.set('view engine', 'ejs')           //ogni volta che fai rendering ... usa ejs .. cosi posso passare a ejs un json che può usare ... quindi es status lo posso leggere

        app.listen(3001, function () {
            console.log('listening on 3001')
            //console.log( compare_ns("33° 51' 17.33652'' S","45° 28' 0.48000'' N") );
        });

        //pagina iniziale
        app.get('/', (req, res) => {
            res.render('login.ejs', {data: {"status": " "}})

        });


        app.get('/userRegistration', (req, res) => {
            res.render('user_registration.ejs', {data: {"status": ""}})
        });

        app.get('/pubRegistration', (req, res) => {
            res.render('pub_registration.ejs', {data: {"status": ""}})
        });

        //ottieni tabella review nella pub_page --- funziona ;)
        app.get('/show_review_my_pub', (req,res) => {
            let pub = pubdata.ditta;           //salvato durante login
            let token = pub_token_value;
            console.log(token);
            let headers = {'Authorization': 'Bearer ' + token}
            console.log(headers);
            let dati = {
                "pub": pub,
            };
            var promise = new Promise((resolve, reject) => {
                request.get({url: "http://localhost:3003/review/pub", json: dati, headers: headers},
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
                console.log("get andata!");
                console.log(value);
                console.log(typeof value)
                console.log(pubdata.ditta);
                let rev= get_my_pub_reviews(value,pubdata.ditta);
                console.log(rev);

                res.render('pub_page.ejs', {data: {"status": rev}})
                if (value.pub == 'MongoError') {
                    res.render('pub_page.ejs', {data: {"status": "Error on DB"}})
                    //res.redirect("/")
                } else {
                        res.render('pub_page.ejs', {data: {"status": "pub review are now visible"}})

                    }

            })
        });

        //ottieni tabella review di un utente --- funzia
        app.get('/show_review_of_user', (req,res) => {
            let user = userdata.name;           //salvato durante login
            let token = user_token_value;
            console.log(token);
            let headers = {'Authorization': 'Bearer ' + token}
            console.log(headers);
            let dati = {
                "name": user,
            };
            var promise = new Promise((resolve, reject) => {
                request.get({url: "http://localhost:3003/review/user", json: dati, headers: headers},
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
                console.log("get andata!");
                console.log(value);
                console.log(typeof value)
                console.log(userdata.name);
                let rev= get_user_reviews(value,userdata.name);
                console.log(rev);
                res.render('user_page.ejs', {data: {"status": rev}})  // lo devo fare xk devo mandare al client .. qui siamo il server

                if (value.user == 'MongoError') {
                    res.render('user_page.ejs', {data: {"status": "Error on DB"}})
                    //res.redirect("/")  USO QUESTO SE HO HTML xk quello va bene se voglio mandare qualcosa in ejs
                    //ma io continuo cosi xk mantengo render ... file ejs... per debugging
                }

                //metto anche caso successo il render ( si fa xk cosi appena inserisco o faccio qualcosa ... mi va
                //in una pagina ... altrimenti mi continua a girare il cerchio nella pagina)

                else {
                        res.render('user_page.ejs', {data: {"status": "user review are now visible ;)"}})

                    }

            })
        });


        //ottieni i pubs nel db nella user_page  funziona ;)
        app.get('/show_pubs', (req,res) => {
            var promise = new Promise((resolve, reject) => {
                request.get({url: "http://localhost:3002/pubs/all"},
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
                console.log("get andata!");
                console.log(value);
                console.log(typeof value)
                var obj = JSON.parse(value);
                console.log(typeof(obj));
                let r = get_all_pub_names(obj);
                console.log(r);
                res.render('user_page.ejs', {data: {"status": r}})
                if (value.pub == 'MongoError') {
                    res.render('pub_page.ejs', {data: {"status": "Error on DB"}})
                }else{
                    res.render('pub_page.ejs', {data: {"status": "Pubs are visibles"}})

                }
            }).catch(error => {
            res.render('user_page.ejs', {data: {"status": "error di qualcosa"}})
            console.log("nope!");
            //console.log(error)
        });
        });


        app.post('/search_drink_for_my_pub', (req,res) => {
            console.log('=====================')
            console.log(req.body)
            console.log('=====================')
            let searchdrink = req.body.searchdrinkformypub;
            console.log(searchdrink);
            let d = get_drink(searchdrink);
            d.then(value => {
                console.log("drink find!");
                console.log(value);
                dataSet = value;
                res.render('pub_page.ejs', {data: {"lista": value}});
            }).catch(error => {
                res.render('pub_page.ejs', {data: {"lista": "drink not find"}})
                console.log("nope!");
                //console.log(error)
            })
            //console.log(res);
            //res.render('user_page.ejs', {data: {"status": "tutto bene"}})

        });

        app.post('/search_drink', (req,res) => {
            console.log('=====================')
            console.log(req.body)
            console.log('=====================')
            let searchdrink = req.body.searchdrink;
            console.log(searchdrink);
            let d = get_drink(searchdrink);
            d.then(value => {
                console.log("drink find!");
                console.log(value);
                res.render('user_page.ejs', {data: {"lista": value}});
            }).catch(error => {
                res.render('user_page.ejs', {data: {"lista": "drink not find"}})
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
                console.log("user registered!");
                console.log(value)
                if (value.name == 'MongoError') {
                    res.render('login.ejs', {data: {"status": "Error on DB"}})
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
                    res.render('user_registration.ejs', {data: {"status": "error in user registration"}})
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
                console.log("pub registered!");
                console.log(value)

                if (value.name == 'MongoError') {
                    res.render('login.ejs', {data: {"status": "Error on DB"}})
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
                    res.render('pub_registration.ejs', {data: {"status": "error in pub registration"}})
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
                console.log("user loggato!");
                user_token_value = value.token;
                userdata = value.user;          //tutte le info sul user
                console.log(userdata);
                console.log(user_token_value);
                if (value.token) {
                    res.render('user_page.ejs', {data: {"status": "loggato e il tuo token è " + value.token}});
                }else{
                    res.render('login.ejs', {data: {"status": "error on login of user"}})
                    //res.redirect({data: {"status":token}},"/")
                }
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
                console.log("pub loggato!");
                pub_token_value = value.token;
                pubdata = value.pub;          //tutte le info sul user
                console.log(pubdata);
                console.log(pub_token_value);
                //console.log(value)
                let token = value.token;
                if (token) {
                    res.render('pub_page.ejs', {data: {"status": "loggato e il tuo token è " + token}})
                    //res.redirect("/")
                } else {
                    res.render('login.ejs', {data: {"status": "error on login of pub"}})
                    //res.redirect({data: {"status":token}},"/")
                }

                //res.redirect("/")
            }).catch(error => {
                res.render('login.ejs', {data: {"status": "errore"}})
                console.log("nope!");
                //console.log(error)
            });
        });

        app.post('/logout_user', (req,res) => {
            let user = userdata.name;
            let email = userdata.email;
            let password = userdata.password;
            let dati = {
                "name": user,
                "email": email,
                "password": password
            };
            let token = user_token_value;
            console.log(token);
            let headers = {'Authorization': 'Bearer ' + token}
            console.log(headers);
            var promise = new Promise((resolve, reject) => {
                request.post({url: "http://localhost:3000/users/me/logout", json: dati, headers: headers}, //dati usati da file review e header da auth_user
                    (error, response, body) => {
                        if (error) {
                            reject(error);
                        }
                        resolve(body);
                    });
            }).then(value => {
                console.log("logout all del user fatto con successo!");
                //console.log(value)
                res.render('login.ejs', {data: {"status": "logout all of user"}});

                //res.redirect("/")
            }).catch(error => {
                res.render('login.ejs', {data: {"status": "errore durante logout all"}})
                console.log("nope!");
                //console.log(error)
            })

        });

        app.post('/logout_pub', (req,res) => {
            let pub = pubdata.ditta;
            let email = pubdata.email;
            let password = pubdata.password;
            let dati = {
                "ditta": pub,
                "email": email,
                "password": password
            };
            let token = pub_token_value;
            console.log(token);
            let headers = {'Authorization': 'Bearer ' + token}
            console.log(headers);
            var promise = new Promise((resolve, reject) => {
                request.post({url: "http://localhost:3002/pubs/me/logout", json: dati, headers: headers}, //dati usati da file review e header da auth_user
                    (error, response, body) => {
                        if (error) {
                            reject(error);
                        }
                        resolve(body);
                    });
            }).then(value => {
                console.log("logout all del pub fatto con successo!");
                //console.log(value)
                res.render('login.ejs', {data: {"status": "logout all of pub"}});

                //res.redirect("/")
            }).catch(error => {
                res.render('login.ejs', {data: {"status": "errore durante logout all"}})
                console.log("nope!");
                //console.log(error)
            })

        });


        app.post('/insert_review', (req, res) => {
            console.log('=====================')
            console.log(req.body)
            console.log('=====================')
            let user = userdata.name;           //salvato durante login
            let pub = req.body.pub;
            let drink = req.body.drink;
            let rank = req.body.rank;
            let comment = req.body.comment;
            let token = user_token_value;
            console.log(token);
            let headers = {'Authorization': 'Bearer ' + token}
            console.log(headers);
            let dati = {
                "timestamp": Date.now(),
                "user": user,     //variabile globale
                "pub": pub,
                "drink": drink,
                "rank": rank,
                "comment": comment
            };
            var promise = new Promise((resolve, reject) => {
                request.post({url: "http://localhost:3003/review", json: dati, headers: headers}, //dati usati da file review e header da auth_user
                    (error, response, body) => {
                        if (error) {
                            reject(error);
                        }
                        resolve(body);
                    });
            }).then(value => {
                console.log("review insert correctly!");
                console.log(value)
                res.render('user_page.ejs', {data: {"status": "review saved"}});

                //res.redirect("/")
            }).catch(error => {
                res.render('login.ejs', {data: {"status": "error during review insert"}})
                console.log("nope!");
                //console.log(error)
            })
        });


    }).catch(error => console.error(error));


