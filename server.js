const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();
var request = require("request");
var path = require('path');         //permette di creare una static directory per i file css


const mongodb_connection_string = "mongodb+srv://Bizzarro20:ProgettoWeb@cluster0-sr8wq.mongodb.net/DrinkAdvisor?retryWrites=true&w=majority"


//FUNCTIONS -------------------------------


//funzione sanitize per considerare solo le colonne necessarie da far visualizzare (solo quelle che servono) ottenute dal API ...DA FAREEEEE
function convert_to_list_api_result_for_user(o) {
    let a = [];
    let b = [];
    for (let i = 0; i < o.length; i++) {
        a.push([o[i].strDrink,  o[i].strCategory, o[i].strAlcoholic, [o[i].strIngredient1, o[i].strIngredient2, o[i].strIngredient3, o[i].strIngredient4, o[i].strIngredient5, o[i].strIngredient6, o[i].strIngredient7, o[i].strIngredient8, o[i].strIngredient9, o[i].strIngredient10, o[i].strIngredient11, o[i].strIngredient12, o[i].strIngredient13, o[i].strIngredient14, o[i].strIngredient15]])
    }
    for (let j=0; j < a.length; j++) {
        let filtered1 = a[j][3].filter(function (el) {      //eliminare null
            return el != null;
        });

        a[j][3] = filtered1;
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
    console.log(b);
    return b;
}

function convert_to_list_api_result_for_pub(o) {
    var a = [];
    var b = [];
    for (let i = 0; i < o.length; i++) {
        a.push([o[i].strDrink, o[i].strCategory, o[i].strAlcoholic, o[i].strGlass, o[i].strInstructions,[o[i].strIngredient1, o[i].strIngredient2, o[i].strIngredient3, o[i].strIngredient4, o[i].strIngredient5, o[i].strIngredient6, o[i].strIngredient7, o[i].strIngredient8, o[i].strIngredient9, o[i].strIngredient10, o[i].strIngredient11, o[i].strIngredient12, o[i].strIngredient13, o[i].strIngredient14, o[i].strIngredient15],[o[i].strMeasure1, o[i].strMeasure2, o[i].strMeasure3, o[i].strMeasure4, o[i].strMeasure5, o[i].strMeasure6, o[i].strMeasure7, o[i].strMeasure8, o[i].strMeasure9, o[i].strMeasure10, o[i].strMeasure11, o[i].strMeasure12, o[i].strMeasure13, o[i].strMeasure14, o[i].strMeasure15]])
    }
    for (let j=0; j < a.length; j++) {
        var filtered1 = a[j][5].filter(function (el) {      //eliminare null
            return el != null;
        });
        var filtered2 = a[j][6].filter(function (el) {
            return el != null;
        });
        a[j][6] = filtered1;
        a[j][7] = filtered2;
    }
    var col0 = [];
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
// //ottengo una lista di json legate alla ricerca fatta.
function get_drink_for_pub(drink){
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
                    let b = convert_to_list_api_result_for_pub(a);
                    result(b);
                }
            }
        })
    })
}

//funzione che fa una richiesta al API con il nome del drink di cui si desiderano info
// //ottengo una lista di json legate alla ricerca fatta.
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


//lista con i dati che visualizza un pub quando vuole vedere le recensioni fatte sui suoi drink
function get_my_pub_reviews(o, p) {
    let a = [];
    for (let i = 0; i < o.review.length; i++) {
        if (o.review[i].pub == p) {
            let date1= o.review[i].timestamp;   //convert mongodb date
            date1.toString();
            let date2 = date1.substring(0, 10);
            a.push(date2, "*",o.review[i].user, "*", o.review[i].drink,  "*",o.review[i].rank,  "*",o.review[i].comment, "*")
        }
    }
    return a;
}


//funziona ... basta inserire un pò di reviews con il nome dei drink giusti (uguali a quelli nel catalogo)

//funzione che calcola la media dei voti per ciascun drink nel catalogo del pub che ha fatto login
function get_average_rank_per_drink(o, p, c) {
    let a = [];

    //prendi tutte le reviews del pub loggato
    for (let i = 0; i < o.review.length; i++) {
        if (o.review[i].pub == p) {
            a.push(o.review[i].drink, o.review[i].rank)
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
            b.push(c[z+2], "*", 0, "*")               //salvo zero
        }
        else {
            b.push(c[z + 2],  "*", (somma / cnt),  "*")       //altrimenti salvo la media nel vettore b (drink, media)
        }                                                         //* utilizzato per il datatable associato.
        somma = 0;
        cnt = 0;
    }
    return b;
}

//funzione che seleziona i campi da far visualizzare all'utente quando questo
// vuole vedere le recensioni che ha fatto
function get_user_reviews(o, u){
    let a = [];
    for (let i = 0; i < o.review.length; i++) {
        if (o.review[i].user == u) {
            let date1= o.review[i].timestamp;         //convert mongodb date
            date1.toString();
            let date2 = date1.substring(0, 10);
            a.push(date2,"*", o.review[i].pub, "*",o.review[i].drink,"*", o.review[i].rank, "*",o.review[i].comment, "*")
        }
    }
    return a;
}


/*
//ottieni una lista di tutti i pub registrati su DrinkAdvisor
function get_all_pub_names (o){
    let b = [];
    for (let i = 0; i < o.pub.length; i++) {
        b.push(o.pub[i].ditta);
    }
    return b;
}*/


//funzione che permette di ottenere il catalogo di un determinato pub dato l'insieme dei cataloghi
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
    return a;
}

//funzione che permette di ottenere le ultime recensioni     DA FINIRE (METTO ULTIME RECENSIONI E BASTA e tolgo quelle del user loggato)
function get_all_reviews(o,u){
    let a = [];
    for (let i = 0; i < o.review.length; i++) {
        if (o.review[i].user != u) {
            let date1 = o.review[i].timestamp;//convert mongodb date
            date1.toString();
            let date2 = date1.substring(0, 10);
            a.push(date2,"*", o.review[i].user, "*",o.review[i].pub,"*", o.review[i].drink, "*",o.review[i].rank, "*",o.review[i].comment,"*")

        }
    }
    return a;
}

//converte in dataset il json cosi che i cataloghi sono visualizzabili nella user_page in modo adeguato
function edit_data_format_of_catalogue(o){
    let a = [];
    for (let i = 0; i < o.catalogue.length; i++) {
            a.push(o.catalogue[i].pub, "*",o.catalogue[i].drink,"*")
        }

    return a;

}




//APP MANAGEMENT ------------------------------------


MongoClient.connect(mongodb_connection_string, { useUnifiedTopology: true })
    .then(client => {

        console.log('Connection string for the DB work, so you are connected to Database')
        const db = client.db('DrinkAdvisor')    //nome del db

        const userCollection = db.collection('users') //!!!!!!!!!!
        const pubCollection = db.collection('pubs') //!!!!!!!!!!
        const reviewCollection = db.collection('reviews');
        const catalogueCollection = db.collection('catalogue');


        //VARIABLES ------------- per salvare informazioni riguardo il pub o lo user che ha fatto login
        var user_token_value = 0;
        var userdata = "";
        var pub_token_value = 0;
        var pubdata = "";
        var catalogo_pub_loggato = [];
        var lista_di_tutti_pub = [];

        //------------------

        app.use(express.static(path.join(__dirname, 'public'))); //per file css

        app.use(bodyParser.urlencoded({extended: true}));  //cosi posso parsare ciò che arriva dalle form action cosi arrivano come json  le req
        app.set('view engine', 'ejs')           //ogni volta che fai rendering ... usa ejs .. cosi posso passare a ejs un json che può usare ... quindi es status lo posso leggere

        app.listen(3001, function () {
            console.log('Server is listening on 3001')
        });



        //GESTIONE GET ------------

        //pagina iniziale
        app.get('/', (req, res) => {
            res.render('login.ejs', {data: {"status": " "}})

        });

        //gestione click bottoni registrazione
        app.get('/userRegistration', (req, res) => {
            res.render('user_registration.ejs', {data: {"status": ""}})
        });
        app.get('/pubRegistration', (req, res) => {
            res.render('pub_registration.ejs', {data: {"status": ""}})
        });

        //ottieni tabella review nella pub_page
        app.get('/show_review_my_pub', (req,res) => {
            let pub = pubdata.ditta;           //salvato durante login
            let token = pub_token_value;
            let headers = {'Authorization': 'Bearer ' + token}
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
                console.log(rev);
                res.render('pub_page.ejs', {data: {"my_pub_reviews": rev}})
                if (value.pub == 'MongoError') {
                    res.render('pub_page.ejs', {data: {"status": "Error on DB"}})
                    //res.redirect("/")
                } else {
                        res.render('pub_page.ejs', {data: {"status": "pub review are now visible"}})

                    }

            })
        });


        //ottenere il rank medio per ogni drink nel catalogo del pub che ha fatto login
        app.get('/average_rank_each_drink', (req,res) => {
            let pub = pubdata.ditta;           //salvato durante login
            let token = pub_token_value;
            let headers = {'Authorization': 'Bearer ' + token}
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
                console.log("you get all the reviews concering you!");
                let rev= get_average_rank_per_drink(value,pubdata.ditta, catalogo_pub_loggato);
                console.log(rev);
                res.render('pub_page.ejs', {data: {"best_drinks": rev}})
                if (value.pub == 'MongoError') {
                    res.render('pub_page.ejs', {data: {"status": "Error on DB"}})
                    //res.redirect("/")
                } else {
                    res.render('pub_page.ejs', {data: {"status": "pub review are now visible"}})

                }

            })
        });


        //ottieni tabella review di un utente
        app.get('/show_review_of_user', (req,res) => {
            let user = userdata.name;           //salvato durante login
            let token = user_token_value;
            let headers = {'Authorization': 'Bearer ' + token}
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
                console.log(rev);
                res.render('user_page.ejs', {data: {"my_reviews": rev,"show_pubs": lista_di_tutti_pub}})  // lo devo fare xk devo mandare al client .. qui siamo il server

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



        //ottenere i drink di un pub nel suo catalogo
        app.get('/show_my_drink', (req,res) => {
            let pub = pubdata.ditta;           //salvato durante login
            let token = pub_token_value;
            let headers = {'Authorization': 'Bearer ' + token}
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
                console.log(rev);
                catalogo_pub_loggato = rev;             //inizializzazione var globale
                res.render('pub_page.ejs', {data: {"catalogo": rev}})  // lo devo fare xk devo mandare al client .. qui siamo il server



                    //metto anche caso successo il render ( si fa xk cosi appena inserisco o faccio qualcosa ... mi va
                //in una pagina ... altrimenti mi continua a girare il cerchio nella pagina)


            })
        });


        /*

        //ottieni i pubs nel db nella user_page   --- MAGARI POSSO USARE LE COLLECTION SOPRA?  TOLTOOOOOOO
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
                console.log("you get the list of all pubs registered in DrinkAdvisor!");
                var obj = JSON.parse(value);
                let r = get_all_pub_names(obj);
                console.log(r);
                res.render('user_page.ejs', {data: {"pub_in_db": r}})
                if (value.pub == 'MongoError') {
                    res.render('pub_page.ejs', {data: {"pub_in_db": "Error on DB"}})
                }else{
                    res.render('pub_page.ejs', {data: {"status": "Pubs are visibles"}})

                }
            }).catch(error => {
            res.render('user_page.ejs', {data: {"status": "error di qualcosa"}})
            console.log("nope!");
        });
        });
*/

        //carica le ultime i reviews nella user_page    DA FARE LE ULTIME!!!!!!!!
        app.get('/get_all_reviews', (req,res) => {
            let token = user_token_value;
            let headers = {'Authorization': 'Bearer ' + token}
            var promise = new Promise((resolve, reject) => {
                request.get({url: "http://localhost:3003/review/user", headers: headers},  //nota review/user .. review/pub SONO UGUALI!!!
                    (error, response, body) => {
                        if (error) {
                            reject(error);
                        }// promise is rejected
                        resolve(body); // promise is fulfilled
                    });
            }).then(value => {
                console.log("you get the last reviews made by all users!");
                var obj = JSON.parse(value);
                let r = get_all_reviews(obj, userdata.name);
                console.log(r);
                res.render('user_page.ejs', {data: {"reviews": r,"show_pubs": lista_di_tutti_pub}})  // lo devo fare xk devo mandare al client .. qui siamo il server

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

        //permette di ottenere i cataloghi di tutti i pub nella pagina del user
        app.get('/show_pubs_catalogues_and_info', (req,res) => {
            let token = user_token_value;
            let headers = {'Authorization': 'Bearer ' + token}
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
                res.render('user_page.ejs', {data: {"pub_catalogues": rev,"show_pubs": lista_di_tutti_pub}})  // lo devo fare xk devo mandare al client .. qui siamo il server



                //metto anche caso successo il render ( si fa xk cosi appena inserisco o faccio qualcosa ... mi va
                //in una pagina ... altrimenti mi continua a girare il cerchio nella pagina)


            })
        });






        //GESTIONE POST ------------

        //permette di cercare un drink e le relative info e di renderizzarle nella pagina del pub
        app.post('/search_drink_for_my_pub', (req,res) => {
            console.log('=====================')
            console.log(req.body)
            console.log('=====================')
            let searchdrink = req.body.searchdrinkformypub;
            let d = get_drink_for_pub(searchdrink);
            d.then(value => {
                if (value == -1)
                {
                    res.render('pub_page.ejs', {data: {"lista_drink_failure": "Sorry, drink information not available"}});
                }
                res.render('pub_page.ejs', {data: {"lista_drink": value}});
            }).catch(error => {
                res.render('pub_page.ejs', {data: {"lista_drink": "drink not find"}})
                console.log("nope!");
            })

        });

        //permette di ottenere le info su un drink e di renderizzarle nella pagina del user
        app.post('/search_drink', (req,res) => {
            console.log('=====================')
            console.log(req.body)
            console.log('=====================')
            let searchdrink = req.body.searchdrink;
            let d = get_drink_for_user(searchdrink);
            d.then(value => {
                if (value == -1){
                    res.render('user_page.ejs', {data: {"lista_drink_failure_user": "Sorry, no information are available for this drink. You can contact directly a pub if you find the drink that you are interested in the catalogues of the pubs","show_pubs": lista_di_tutti_pub}});
                }
                res.render('user_page.ejs', {data: {"lista_drink_user": value, "show_pubs": lista_di_tutti_pub}});
            }).catch(error => {
                res.render('user_page.ejs', {data: {"lista_drink_user": "drink not find"}})
                console.log("nope!");
            });
        });

        //registra un nuovo utente nel db
        app.post('/user_register', (req, res) => {
            console.log('=====================')
            console.log(req.body)
            console.log('=====================')
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
                });


        });

        //registra un nuovo pub nel db
        app.post('/pub_register', (req, res) => {
            console.log('=====================')
            console.log(req.body)
            console.log('=====================')
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
                });


        });

        //viene gestito il login, viene emesso un nuovo token che viene salvato nel db
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
                var allpub = pubCollection.find().toArray().then((data) => {
                    // Here you can do something with your data
                    var result = [];
                    for (let i = 0; i < data.length; i++) {
                        result.push(data[i].ditta);
                    }
                    console.log(result);
                    lista_di_tutti_pub = result;            //inizializza variabile globale, ricaricata ogni volta che faccio una nuova recensione
                    res.render('user_page.ejs', {data: {"show_pubs": lista_di_tutti_pub}});
                    console.log(result);
                })

                    /*if (value.token) {
                        res.render('user_page.ejs', {data: {"status": "loggato e il tuo token è " + value.token}});
                    }else{
                        res.render('login.ejs', {data: {"status": "error on login of user"}})
                        //res.redirect({data: {"status":token}},"/")
                    }
                })*/
                    .catch(error => {
                        res.render('login.ejs', {data: {"status": "errore"}})
                        console.log("nope!");
                    });
            })
        });

        //viene gestito il login, viene emesso un nuovo token che viene salvato nel db
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
                res.render('login.ejs', {data: {"status": "logout all of user"}});

                //res.redirect("/")
            }).catch(error => {
                res.render('login.ejs', {data: {"status": "errore durante logout all"}})
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
            let headers = {'Authorization': 'Bearer ' + token}
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
                res.render('login.ejs', {data: {"status": "logout all of pub"}});

                //res.redirect("/")
            }).catch(error => {
                res.render('login.ejs', {data: {"status": "errore durante logout all"}})
                console.log("nope!");
            })

        });


        //inserimento di un nuovo drink nel catalogo e quindi nel db
        app.post('/insert_drink_in_catalogue', (req, res) => {
            console.log('=====================')
            console.log(req.body)
            console.log('=====================')
            let drink = req.body.newdrink;
            let pub = pubdata.ditta;
            let token = pub_token_value;
            let headers = {'Authorization': 'Bearer ' + token}
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
                res.render('pub_page.ejs', {data: {"status": "drink saved in the catalogue"}});

                //res.redirect("/")
            }).catch(error => {
                res.render('pub_page.ejs', {data: {"status": "error during drink insert"}})
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
            let headers = {'Authorization': 'Bearer ' + token}
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
                res.render('pub_page.ejs', {data: {"status": "error during deleting the drink"}})
                console.log("nope!");
            })

        });


        // di una nuova recesione nel db
        app.post('/insert_review', (req, res) => {
            console.log('=====================')
            console.log(req.body)
            console.log('=====================')
            let user = userdata.name;           //salvato durante login
            let pub = req.body.pub;
            //controllo pub disponibile nel database
                let drink = req.body.drink;
                let rank = req.body.rank;
                let comment = req.body.comment;
                let token = user_token_value;
                let headers = {'Authorization': 'Bearer ' + token}
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
                    res.render('user_page.ejs', {data: {"show_pubs": lista_di_tutti_pub}});  //ricarica il vettore dei pub tra cui scegliere

                    //res.redirect("/")
                }).catch(error => {
                    res.render('user_page.ejs', {data: {"status": "error during review insert"}})
                    console.log("nope!");
                })


        });



    }).catch(error => console.error(error));


