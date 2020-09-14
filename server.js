const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
var request = require("request");
var path = require('path');         //permette di creare una static directory per i file css


const mongodb_connection_string = "mongodb+srv://Bizzarro20:ProgettoWeb@cluster0-sr8wq.mongodb.net/DrinkAdvisor?retryWrites=true&w=majority";


//FUNCTIONS -------------------------------


//funzione sanitize utilizzata per la tabella searchDrink nella user_page per considerare solo le colonne necessarie da far visualizzare (solo quelle che servono) ottenute dal API
function convert_to_list_api_result_for_user(o) {
    let a = [];
    let b = [];
    for (let i = 0; i < o.length; i++) {
        a.push([o[i].strDrink,  o[i].strCategory, o[i].strAlcoholic, [o[i].strIngredient1, o[i].strIngredient2, o[i].strIngredient3, o[i].strIngredient4, o[i].strIngredient5, o[i].strIngredient6, o[i].strIngredient7, o[i].strIngredient8, o[i].strIngredient9, o[i].strIngredient10, o[i].strIngredient11, o[i].strIngredient12, o[i].strIngredient13, o[i].strIngredient14, o[i].strIngredient15]]);
    }
    for (let j=0; j < a.length; j++) {
        let filtered1 = a[j][3].filter(function (el) {      //eliminare valori null
            return el != null;
        });

        a[j][3] = filtered1;            //riassegnare per ciascun elemento del vettore il campo tre (ingredienti)
    }
    let col0 = [];
    let col1 = [];
    let col2 = [];
    let col3 = [];

    for (let z = 0; z < a.length; z++){
        col0.push(a[z][0]);
        col1.push(a[z][1]);
        col2.push(a[z][2]);
        col3.push(a[z][3]);

        b.push(col0[z], "*",col1[z], "*",col2[z], "*",col3[z],"*");

    }
    //console.log(b);
    return b;
}

//funzione sanitize utilizzata per la tabella searchDrink nella user_page per considerare solo le colonne necessarie da far visualizzare (solo quelle che servono) ottenute dal API
function convert_to_list_api_result_for_pub(o) {
    var a = [];
    var b = [];
    for (let i = 0; i < o.length; i++) {
        a.push([o[i].strDrink, o[i].strCategory, o[i].strAlcoholic, o[i].strGlass, o[i].strInstructions,[o[i].strIngredient1, o[i].strIngredient2, o[i].strIngredient3, o[i].strIngredient4, o[i].strIngredient5, o[i].strIngredient6, o[i].strIngredient7, o[i].strIngredient8, o[i].strIngredient9, o[i].strIngredient10, o[i].strIngredient11, o[i].strIngredient12, o[i].strIngredient13, o[i].strIngredient14, o[i].strIngredient15],[o[i].strMeasure1, o[i].strMeasure2, o[i].strMeasure3, o[i].strMeasure4, o[i].strMeasure5, o[i].strMeasure6, o[i].strMeasure7, o[i].strMeasure8, o[i].strMeasure9, o[i].strMeasure10, o[i].strMeasure11, o[i].strMeasure12, o[i].strMeasure13, o[i].strMeasure14, o[i].strMeasure15]]);
    }
    for (let j=0; j < a.length; j++) {
        var filtered1 = a[j][5].filter(function (el) {      //eliminare null ingredienti
            return el != null;
        });
        var filtered2 = a[j][6].filter(function (el) {      //eliminare null quantità di ciascun ingrediente
            return el != null;
        });
        a[j][5] = filtered1;
        a[j][6] = filtered2;
    }
    var col0 = [];              //colonne del datatable
    var col1 = [];
    var col2 = [];
    var col3 = [];
    var col4 = [];
    var col5 = [];
    var col6 = [];

    for (let z = 0; z < a.length; z++){
        col0.push(a[z][0]);
        col1.push(a[z][1]);
        col2.push(a[z][2]);
        col3.push(a[z][3]);
        col4.push(a[z][4]);
        col5.push(a[z][5]);
        col6.push(a[z][6]);
        b.push(col0[z], "*",col1[z],"*", col2[z], "*",col3[z], "*",col4[z], "*",col5[z], "*",col6[z],"*");

    }
    return b;
}

//funzione che fa una richiesta al API con il nome del drink di cui si desiderano info
//ottengo una lista di json legate alla ricerca fatta.  --- per info utili al pub
function get_drink_for_pub(drink){
    let connAPI = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`
    return new Promise(function (result, reject) {
        request.get(connAPI, function (err,resp, body) {
            if (err){
                reject(err);
            }else{
                let res = JSON.parse(body);
                if (res.drinks == null) {           //controlla se il drink cercato è presente oppure no nel API
                    result(-1);
                }else {
                    let a = [];
                    for (let i = 0; i < res.drinks.length; i++) {
//                        a.push(res.drinks[i].idDrink);
                        a.push(res.drinks[i]);

                        //result(a);
                    }
                    let b = convert_to_list_api_result_for_pub(a);
                    result(b);
                }
            }
        })
    })
}

//funzione che fa una richiesta al API con il nome del drink di cui si desiderano info
//ottengo una lista di json legate alla ricerca fatta. ---- per info utili allo user
function get_drink_for_user(drink){
    let connAPI = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`
    return new Promise(function (result, reject) {
        request.get(connAPI, function (err,resp, body) {
            if (err){
                reject(err);
            }else{
                let res = JSON.parse(body);
                if (res.drinks == null) {           //controlla se il drink cercato è presente oppure no nel API
                    result(-1)
                }else {
                    let a = [];
                    for (let i = 0; i < res.drinks.length; i++) {
//                        a.push(res.drinks[i].idDrink);
                        a.push(res.drinks[i]);

                        //result(a);
                    }
                    let b = convert_to_list_api_result_for_user(a);
                    result(b);
                }
            }
        })
    })
}


//lista con i dati che visualizza un pub quando vuole vedere le recensioni fatte sui suoi drink -- funzione usata ai fini del inserimento corretto nei datatable
function get_my_pub_reviews(o, p) {
    let a = [];
    for (let i = 0; i < o.review.length; i++) {
        if (o.review[i].pub == p) {
            let date1= o.review[i].timestamp;   //convert mongodb date
            date1.toString();
            let date2 = date1.substring(0, 10);
            a.push(date2, "*",o.review[i].user, "*", o.review[i].drink,  "*",o.review[i].rank,  "*",o.review[i].comment, "*");
        }
    }
    if (a.length == 0){
        return -1;
    }
    return a;
}

//funzione che calcola la media dei voti per ciascun drink nel catalogo del pub che ha fatto login
function get_average_rank_per_drink(o, p, c) {
    let a = [];

    //prendi tutte le reviews del pub loggato
    for (let i = 0; i < o.review.length; i++) {
        if (o.review[i].pub == p) {
            a.push(o.review[i].drink, o.review[i].rank);
        }
    }

    //prendo la lista dei drink nel catalogo di quel pub
    //ogni volta che ottengo un drink nelle reviews prima salvate
    // che combacia con un drink nel catalogo del pub, aggiungi il valore
    // del rank in una variabile somma che poi serve per calcolare la media di quel
    // drink nel catalogo.
    //salvo quel drink e la media in un vettore b

    let b= [];
    let somma = 0;
    let cnt = 0;
    for (let z = 0; z < c.length; z+=4){        //c è il catalogo, vado avanti di quattro perchè c contiene due colonne (pub_loggato, drink) che sono divise da dei * in quanto il catalogo è salvato in locale in questo modo
         for (let j = 0; j < a.length; j+=2) {      //a contiene le recesioni, vado avanti di due perchè ha due colonne (drink, rank)
            if (a[j] == c[z+2]) {                   //confronto tra i nomi del drink di ciascun vettore
                    somma+= a[j+1];                 //sommo il rank
                    cnt++;                      //per dividere e ottenere la media
            }
         }
        if(isNaN(somma/cnt)){           //gestito NaN, capita se non ho recensioni per un drink nel catalogo
            b.push(c[z+2], "*", 0, "*");               //salvo zero
        }
        else {
            b.push(c[z + 2],  "*", (somma / cnt).toFixed(2),  "*");       //altrimenti salvo la media nel vettore b (drink, media), to fixed serve per arrottondare
        }                                                         //* utilizzato per il datatable associato.
        somma = 0;
        cnt = 0;
    }
    if (b.length == 0){
        return -1;
    }
    return b;
}

//funzione che seleziona i campi da far visualizzare all'utente quando questo -- funzione usata ai fini del inserimento corretto nei datatable
// vuole vedere le recensioni che ha fatto
function get_user_reviews(o, u){
    let a = [];
    for (let i = 0; i < o.review.length; i++) {
        if (o.review[i].user == u) {
            let date1= o.review[i].timestamp;         //convert mongodb date
            date1.toString();
            let date2 = date1.substring(0, 10);
            a.push(date2,"*", o.review[i].pub, "*",o.review[i].drink,"*", o.review[i].rank, "*",o.review[i].comment, "*");
        }
    }
    if (a.length == 0){
        return -1;
    }
    return a;
}

//funzione che permette di ottenere il catalogo di un determinato pub dato l'insieme dei cataloghi -- funzione usata ai fini del inserimento corretto nei datatable
function get_pub_catalogue(o, p){
    let a = [];
    for (let i = 0; i < o.catalogue.length; i++) {
        if (o.catalogue[i].pub == p) {
            let date1= o.catalogue[i].timestamp;   //convert mongodb date
            date1.toString();
            let date2 = date1.substring(0, 10);
            a.push(date2, "*",o.catalogue[i].drink, "*");
        }
    }
    if (a.length == 0){
        return -1;
    }
    return a;
}

//funzione che permette di ottenere le tutte recensioni tranne dello user loggato -- funzione usata ai fini del inserimento corretto nei datatable
function get_all_reviews(o,u){
    let a = [];
    for (let i = 0; i < o.review.length; i++) {
        if (o.review[i].user != u) {
            let date1 = o.review[i].timestamp;//convert mongodb date
            date1.toString();
            let date2 = date1.substring(0, 10);
            a.push(date2,"*", o.review[i].user, "*",o.review[i].pub,"*", o.review[i].drink, "*",o.review[i].rank, "*",o.review[i].comment,"*");

        }
    }
    if (a.length == 0){
        return -1;
    }
    return a;
}

//converte in dataset il json cosi che i cataloghi sono visualizzabili nella user_page in modo adeguato -- funzione usata ai fini del inserimento corretto nei datatable
function edit_data_format_of_catalogue(o){
    let a = [];
    for (let i = 0; i < o.catalogue.length; i++) {
            a.push(o.catalogue[i].pub, "*",o.catalogue[i].drink,"*");
        }
    if (a.length == 0){
        return -1;
    }
    return a;

}




//APP MANAGEMENT ------------------------------------


MongoClient.connect(mongodb_connection_string, { useUnifiedTopology: true })
    .then(client => {

        //iniziazione
        console.log('Connection string for the DB work, so you are connected to Database')
        const db = client.db('DrinkAdvisor')    //nome del db

        //collections nel db
        const userCollection = db.collection('users');
        const pubCollection = db.collection('pubs');
        const reviewCollection = db.collection('reviews');
        const catalogueCollection = db.collection('catalogue');


        //VARIABLES ------------- info salvate in locale
        var user_token_value = 0;
        var userdata = "";
        var pub_token_value = 0;
        var pubdata = "";
        var catalogo_pub_loggato = [];
        var lista_di_tutti_pub = [];



        //------------------

        app.use(express.static(path.join(__dirname, 'public'))); //per file css

        app.use(bodyParser.urlencoded({extended: true}));  //cosi posso parsare ciò che arriva dalle form action cosi arrivano come json  le req
        app.set('view engine', 'ejs');           //ogni volta che fai rendering ... usa ejs .. cosi posso passare a ejs un json che può usare ... quindi es status lo posso leggere

        app.listen(3001, function () {
            console.log('Server is listening on 3001');
        });




        //GESTIONE GET ------------

        //pagina iniziale
        app.get('/', (req, res) => {
            res.render('login.ejs', {data: {"status": " "}});

        });

        //gestione click bottoni registrazione
        app.get('/userRegistration', (req, res) => {
            res.render('user_registration.ejs');
        });
        app.get('/pubRegistration', (req, res) => {
            res.render('pub_registration.ejs');
        });



        //ottieni tabella review nella pub_page
        app.get('/show_review_my_pub', (req,res) => {
            let pub = pubdata.ditta;           //salvato durante login
            let token = pub_token_value;
            let headers = {'Authorization': 'Bearer ' + token};
            let dati = {
                "pub": pub,
            };
            var promise = new Promise((resolve, reject) => {
                request.get({url: "http://localhost:3003/review/pub", json: dati, headers: headers},
                    (error, response, body) => {
                        if (error) {
                            reject(error);
                        }// promise is rejected
                        resolve(body); // promise is fulfilled
                    });
            }).then(value => {
                console.log("you get the reviews concering your pub!");
                let rev= get_my_pub_reviews(value,pubdata.ditta);
                if (rev == -1){
                    res.render('pub_page.ejs', {data: {"first_section_failure": "no reviews received yet!"}});
                }else {
                    res.render('pub_page.ejs', {data: {"my_pub_reviews": rev}});
                }
            });
        });


        //ottenere il rank medio per ogni drink nel catalogo del pub che ha fatto login
        app.get('/average_rank_each_drink', (req,res) => {
            let pub = pubdata.ditta;           //salvato durante login
            let token = pub_token_value;
            let headers = {'Authorization': 'Bearer ' + token};
            let dati = {
                "pub": pub,
            };
            var promise1 = new Promise((resolve, reject) => {           //promise per ottere il catalogo --- da passare alla funzione
                request.get({url: "http://localhost:3004/catalogue/pub", json: dati, headers: headers},
                    (error, response, body) => {
                        if (error) {
                            reject(error);
                        }// promise is rejected
                        resolve(body); // promise is fulfilled
                    });
            }).then(value => {
                let rev= get_pub_catalogue(value,pubdata.ditta);
                if (rev == -1){
                    res.render('pub_page.ejs', {data: {"first_section_failure": "No drink in catalogue"}});  // lo devo fare xk devo mandare al client .. qui siamo il server
                }
                else {
                    catalogo_pub_loggato = rev;             //inizializzazione var globale
                    var promise2 = new Promise((resolve, reject) => {                   //promise per ottenere le recensioni del pub loggato
                        request.get({url: "http://localhost:3003/review/pub", json: dati, headers: headers},
                            (error, response, body) => {
                                if (error) {
                                    reject(error);
                                }// promise is rejected
                                resolve(body); // promise is fulfilled
                            });
                    }).then(value => {
                        console.log("you get all the drinks performances")
                        let rev = get_average_rank_per_drink(value, pubdata.ditta, catalogo_pub_loggato);
                        res.render('pub_page.ejs', {data: {"best_drinks": rev}});
                    });
                }
        });
    });


        //ottieni tabella review di un utente
        app.get('/show_review_of_user', (req,res) => {
            let user = userdata.name;           //salvato durante login
            let token = user_token_value;
            let headers = {'Authorization': 'Bearer ' + token};
            let dati = {
                "name": user,
            };
            var promise = new Promise((resolve, reject) => {
                request.get({url: "http://localhost:3003/review/user", json: dati, headers: headers},
                    (error, response, body) => {
                        if (error) {
                            reject(error);
                        }// promise is rejected
                        resolve(body); // promise is fulfilled
                    });
            }).then(value => {
                console.log("you get the reviews that you submitted!");
                let rev= get_user_reviews(value,userdata.name);
                if (rev == -1){
                    res.render('user_page.ejs', {data: {"section_one_failure": "no reviews done yet!","show_pubs": lista_di_tutti_pub}});  // lo devo fare xk devo mandare al client .. qui siamo il server
                }
                else {
                    res.render('user_page.ejs', {data: {"my_reviews": rev,"show_pubs": lista_di_tutti_pub}});  // lo devo fare xk devo mandare al client .. qui siamo il server
                }

            });
        });



        //ottenere i drink di un pub nel suo catalogo
        app.get('/show_my_drink', (req,res) => {
            let pub = pubdata.ditta;           //salvato durante login
            let token = pub_token_value;
            let headers = {'Authorization': 'Bearer ' + token};
            let dati = {
                "ditta": pub,
            };
            var promise = new Promise((resolve, reject) => {
                request.get({url: "http://localhost:3004/catalogue/pub", json: dati, headers: headers},
                    (error, response, body) => {
                        if (error) {
                            reject(error);
                        }// promise is rejected
                        resolve(body); // promise is fulfilled
                    });
            }).then(value => {
                console.log("you get your catalogue of drinks!");
                let rev= get_pub_catalogue(value,pubdata.ditta);
                if (rev == -1){
                    res.render('pub_page.ejs', {data: {"first_section_failure": "No drink in catalogue"}});  // lo devo fare xk devo mandare al client .. qui siamo il server
                }
                else {
                    catalogo_pub_loggato = rev;             //inizializzazione var globale
                    res.render('pub_page.ejs', {data: {"catalogo": rev}});  // lo devo fare xk devo mandare al client .. qui siamo il server
                }
            });
        });


        //carica tutte le reviews nella user_page
        app.get('/get_all_reviews', (req,res) => {
            let token = user_token_value;
            let headers = {'Authorization': 'Bearer ' + token};
            var promise = new Promise((resolve, reject) => {
                request.get({url: "http://localhost:3003/review/user", headers: headers},  //nota review/user .. review/pub SONO UGUALI!!!
                    (error, response, body) => {
                        if (error) {
                            reject(error);
                        }// promise is rejected
                        resolve(body); // promise is fulfilled
                    });
            }).then(value => {
                console.log("you get the reviews made by all users!");
                var obj = JSON.parse(value);
                let r = get_all_reviews(obj, userdata.name);
                if (r == -1){
                    res.render('user_page.ejs', {data: {"section_one_failure": "no reviews done by now","show_pubs": lista_di_tutti_pub}});
                }
                else {
                    res.render('user_page.ejs', {data: {"reviews": r, "show_pubs": lista_di_tutti_pub}});
                }
            });
        });

        //permette di ottenere i cataloghi di tutti i pub nella pagina del user
        app.get('/show_pubs_catalogues_and_info', (req,res) => {
            let token = user_token_value;
            let headers = {'Authorization': 'Bearer ' + token};
            var promise = new Promise((resolve, reject) => {
                request.get({url: "http://localhost:3004/catalogue/all",headers: headers},
                    (error, response, body) => {
                        if (error) {
                            reject(error);
                        }// promise is rejected
                        resolve(body); // promise is fulfilled
                    });
            }).then(value => {
                console.log("all the data regarding catalogues are loaded");
                var obj = JSON.parse(value);
                let rev= edit_data_format_of_catalogue(obj);
                if (rev == -1){
                    res.render('user_page.ejs', {data: {"section_one_failure": "no information are available yet","show_pubs": lista_di_tutti_pub}});  // lo devo fare xk devo mandare al client .. qui siamo il server

                }else {
                    res.render('user_page.ejs', {data: {"pub_catalogues": rev, "show_pubs": lista_di_tutti_pub}});
                }
            });
        });






        //GESTIONE POST ------------

        //permette di cercare un drink e le relative info e di renderizzarle nella pagina del pub
        app.post('/search_drink_for_my_pub', (req,res) => {
            console.log('=====================');
            console.log(req.body);
            console.log('=====================');
            let searchdrink = req.body.searchdrinkformypub;
            let d = get_drink_for_pub(searchdrink);
            d.then(value => {
                console.log("drink research worked!");
                if (value == -1)
                {
                    res.render('pub_page.ejs', {data: {"lista_drink_failure": "Sorry, drink information not available or check if you digit the drink name correctly"}});
                }
                res.render('pub_page.ejs', {data: {"lista_drink": value}});
            }).catch(error => {
                res.render('pub_page.ejs', {data: {"lista_drink": "drink not find"}});
                console.log("nope!");
            })

        });

        //permette di ottenere le info su un drink e di renderizzarle nella pagina del user
        app.post('/search_drink', (req,res) => {
            console.log('=====================');
            console.log(req.body);
            console.log('=====================');
            let searchdrink = req.body.searchdrink;
            let d = get_drink_for_user(searchdrink);
            d.then(value => {
                console.log("drink research worked!");
                if (value == -1){
                    res.render('user_page.ejs', {data: {"lista_drink_failure_user": "Sorry, no information are available for this drink or check if you digit the drink name correctly. Moreover, you can contact directly a pub if you find the drink that you are interested in the catalogues of the pubs","show_pubs": lista_di_tutti_pub}});
                }
                res.render('user_page.ejs', {data: {"lista_drink_user": value, "show_pubs": lista_di_tutti_pub}});
            }).catch(error => {
                res.render('user_page.ejs', {data: {"lista_drink_user": "drink not find"}});
                console.log("nope!");
            });
        });

        //registra un nuovo utente nel db
        app.post('/user_register', (req, res) => {
            console.log('=====================');
            console.log(req.body);
            console.log('=====================');
            let name = req.body.name;
            let email = req.body.email;
            let password = req.body.password;
            let dati = {
                "name": name,
                "email": email,
                "password": password
            };
            var promise = new Promise((resolve, reject) => {
                request.post("http://localhost:3000/users", {json: dati},
                    (error, response, body) => {
                        if (error) {
                            reject(error);
                        }// promise is rejected
                        resolve(body); // promise is fulfilled
                    });
            }).then(value => {
                console.log("new user registered!");
                //console.log(value);
                if (value.name == 'MongoError') {
                    res.render('login.ejs', {data: {"status": "Error on DB, please retry or contact the administrator"}});
                    //res.redirect("/")
                } else {
                    if (value.token == null) {
                        res.render('login.ejs', {data: {"status": "error of some kind regarding token generation"}});
                    } else {
                        res.render('login.ejs', {data: {"status": "user registered sucessfully!"}});

                    }
                }
            })
                .catch(error => {
                    res.render('user_registration.ejs', {data: {"status": "error in user registration"}});
                    console.log("nope!");
                });


        });

        //registra un nuovo pub nel db
        app.post('/pub_register', (req, res) => {
            console.log('=====================');
            console.log(req.body);
            console.log('=====================');
            let ditta = req.body.ditta;
            let email = req.body.email;
            let password = req.body.password;
            let dati = {
                "ditta": ditta,
                "email": email,
                "password": password
            };
            var promise = new Promise((resolve, reject) => {
                request.post("http://localhost:3002/pubs", {json: dati},
                    (error, response, body) => {
                        if (error) {
                            reject(error);
                        }// promise is rejected
                        resolve(body); // promise is fulfilled
                    });
            }).then(value => {
                console.log("new pub registered!");
                //console.log(value)

                if (value.name == 'MongoError') {
                    res.render('login.ejs', {data: {"status": "Error on DB"}});
                    //res.redirect("/")
                } else {
                    if (value.token == null) {
                        res.render('login.ejs', {data: {"status": "error of some kind"}});
                    } else {
                        res.render('login.ejs', {data: {"status": "pub registered successfully!"}});

                    }
                }
            })
                .catch(error => {
                    res.render('pub_registration.ejs', {data: {"status": "error in pub registration"}});
                    console.log("nope!");
                });
        });

        //viene gestito il login, viene emesso un nuovo token che viene salvato nel db
        app.post('/user_login', (req, res) => {
            console.log('=====================');
            console.log(req.body);
            console.log('=====================');
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
                if (user_token_value) {
                    var allpub = pubCollection.find().toArray().then((data) => {
                        // al login viene caricata la lista dei pub nel tag select in modo da poter fare le reviews solo sui pub nella App
                        var result = [];
                        for (let i = 0; i < data.length; i++) {
                            result.push(data[i].ditta);
                        }
                        lista_di_tutti_pub = result;            //inizializza variabile globale, ricaricata ogni volta che faccio una nuova recensione
                        res.render('user_page.ejs', {data: {"show_pubs": lista_di_tutti_pub}});
                    })
                } else {
                    res.render('login.ejs', {data: {"status": "error on login of user"}});
                    //res.redirect({data: {"status":token}},"/")
                }
            })
            .catch(error => {
                        res.render('login.ejs', {data: {"status": "errore"}});
                        console.log("nope!");
                    });
            });



        //viene gestito il login, viene emesso un nuovo token che viene salvato nel db
        app.post('/pub_login', (req, res) => {
            console.log('=====================');
            console.log(req.body);
            console.log('=====================');
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
                if (pub_token_value) {
                    res.render('pub_page.ejs',{data:{"status": ""}});
                    //res.redirect("/")
                } else {
                    res.render('login.ejs', {data: {"status": "error on login of pub"}});
                    //res.redirect({data: {"status":token}},"/")
                }

                //res.redirect("/")
            }).catch(error => {
                res.render('login.ejs', {data: {"status": "errore"}});
                console.log("nope!");
            });
        });

        //viene gestito il logout del user
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
            let headers = {'Authorization': 'Bearer ' + token}
            var promise = new Promise((resolve, reject) => {
                request.post({url: "http://localhost:3000/users/me/logout", json: dati, headers: headers}, //dati usati da file review e header da auth_user
                    (error, response, body) => {
                        if (error) {
                            reject(error);
                        }
                        resolve(body);
                    });
            }).then(value => {
                console.log("logout worked!");
                res.render('login.ejs', {data: {"status": "logout of user"}});

                //res.redirect("/")
            }).catch(error => {
                res.render('login.ejs', {data: {"status": "error during logout"}});
                console.log("nope!");
            })

        });

        //viene gestito il logout del pub
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
            let headers = {'Authorization': 'Bearer ' + token};
            var promise = new Promise((resolve, reject) => {
                request.post({url: "http://localhost:3002/pubs/me/logout", json: dati, headers: headers}, //dati usati da file review e header da auth_user
                    (error, response, body) => {
                        if (error) {
                            reject(error);
                        }
                        resolve(body);
                    });
            }).then(value => {
                console.log("logout worked!");
                res.render('login.ejs', {data: {"status": "logout of pub"}});

                //res.redirect("/")
            }).catch(error => {
                res.render('login.ejs', {data: {"status": "error during logout"}});
                console.log("nope!");
            })

        });


        //inserimento di un nuovo drink nel catalogo e quindi nel db
        app.post('/insert_drink_in_catalogue', (req, res) => {
            console.log('=====================');
            console.log(req.body);
            console.log('=====================');
            let drink = req.body.newdrink;
            let pub = pubdata.ditta;
            let token = pub_token_value;
            let headers = {'Authorization': 'Bearer ' + token};
            let dati = {
                "timestamp": Date.now(),
                "pub": pub,
                "drink": drink
            };
            var promise = new Promise((resolve, reject) => {
                request.post({url: "http://localhost:3004/catalogue", json: dati, headers: headers}, //dati usati da file review e header da auth_user
                    (error, response, body) => {
                        if (error) {
                            reject(error);
                        }
                        resolve(body);
                    });
            }).then(value => {
                console.log("drink insert correctly in catalogue!");
                catalogo_pub_loggato = get_pub_catalogue(value,pubdata.ditta) ;
                res.render('pub_page.ejs', {data: {"status": "drink saved in the catalogue"}});

                //res.redirect("")
            }).catch(error => {
                res.render('pub_page.ejs', {data: {"status": "error during drink insert"}});
                console.log("nope!");
            })
        });

        //rimuove un drink dal catalogo
        app.post('/remove_drink_in_catalogue', (req,res) => {
            let drink = req.body.removedrink;
            let pub = pubdata.ditta;
            let dati = {
                "ditta": pub,
                "drink": drink
            };
            console.log(dati);
            let token = pub_token_value;
            let headers = {'Authorization': 'Bearer ' + token};
            var promise = new Promise((resolve, reject) => {
                request.post({url: "http://localhost:3004/catalogue/pub/removedrink", json: dati, headers: headers}, //dati usati da file review e header da auth_user
                    (error, response, body) => {
                        if (error) {
                            reject(error);
                        }
                        resolve(body);
                    });
            }).then(value => {
                console.log("drink deleted from catalogue!");
                catalogo_pub_loggato = get_pub_catalogue(value,pubdata.ditta) ;
                console.log(catalogo_pub_loggato);
                res.render('pub_page.ejs', {data: {"status": "drink deleted from catalogue!"}});

                //res.redirect("/")
            }).catch(error => {
                res.render('pub_page.ejs', {data: {"status": "drink deleted from catalogue!"}});
            })

        });


        // di una nuova recesione nel db
        app.post('/insert_review', (req, res) => {
            console.log('=====================');
            console.log(req.body);
            console.log('=====================');
            let user = userdata.name;           //salvato durante login
            let pub = req.body.pub;
            //controllo pub disponibile nel database
                let drink = req.body.drink;
                let rank = req.body.rank;
                let comment = req.body.comment;
                let token = user_token_value;
                let headers = {'Authorization': 'Bearer ' + token};
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
                    res.render('user_page.ejs', {data: {"show_pubs": lista_di_tutti_pub,"status": "review saved correctly"}});  //ricarica il vettore dei pub tra cui scegliere

                    //res.redirect("/")
                }).catch(error => {
                    res.render('user_page.ejs', {data: {"status": "error during review insert"}});
                    console.log("nope!");
                })


        });



    }).catch(error => console.error(error));


