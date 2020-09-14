//aspetto che i dati arrivino nel ejs, poi questi dati formano il dataset da mettere nella tabella

$.fn.dataTableExt.sErrMode = 'throw';   //necessario per evitare warning persistenti

$(document).ready(function f1() {
    let my_pub_reviews1 = document.getElementById("my_pub_reviews").innerText;
    let v1 = my_pub_reviews1.split(",*,");
    v1[v1.length - 1] = v1[v1.length - 1].substring(0, v1[v1.length - 1].length - 2);
    let my_pub_reviews = v1;
    let dataset_pub = [];
    for (let j = 0; j < my_pub_reviews.length; j += 5) {
        dataset_pub.push([my_pub_reviews[j], my_pub_reviews[j + 1], my_pub_reviews[j + 2], my_pub_reviews[j + 3], my_pub_reviews[j + 4]]);
    }
    $(document).ready( function () {
        t1= $('#table_my_pub_reviews').DataTable({
            data: dataset_pub,
            columns: [
                { title: "Date" },
                { title: "User" },
                { title: "Drink" },
                { title: "Rank" },
                { title: "Comment"}
            ]
        })
    });
    $('#my_pub_reviews').hide();


})

$(document).ready(function f2() {
    let my_pub_catalogue1 = document.getElementById("my_pub_catalogue").innerText;
    let v1 = my_pub_catalogue1.split(",*,");
    v1[v1.length - 1] = v1[v1.length - 1].substring(0, v1[v1.length - 1].length - 2);
    let my_pub_catalogue = v1;
    let dataset_catalogue = [];
    for (let j = 0; j < my_pub_catalogue.length; j += 2) {
        dataset_catalogue.push([my_pub_catalogue[j], my_pub_catalogue[j + 1]]);
    }
    $(document).ready( function () {
        t = $('#table_pub_catalogue').DataTable({
            data: dataset_catalogue,
            columns: [
                { title: "Date Insert" },
                { title: "Drink" }
            ]
        })
    });

    $('#my_pub_catalogue').hide();


})

$(document).ready(function f3() {
    let drink1 = document.getElementById("drink_for_pub").innerText;
    let v1 = drink1.split(",*,");
    v1[v1.length - 1] = v1[v1.length - 1].substring(0, v1[v1.length - 1].length - 2);
    let drink = v1;
    let dataset_drink = [];
    for (let j = 0; j < drink.length; j += 7) {
        dataset_drink.push([drink[j], drink[j + 1], drink[j + 2], drink[j + 3], drink[j + 4], drink[j + 5], drink[j + 6]]);
    }
    $(document).ready( function () {
        $('#table_drink_info').DataTable({
            data: dataset_drink,
            columns: [
                { title: "Drink" },
                { title: "Category" },
                { title: "Alcoholic/Not Alcoholic" },
                { title: "Type of Glass" },
                { title: "Instructions" },
                { title: "Ingredients" },
                { title: "Quantity of ingredients" }
            ]
        })
    });

    $('#drink_for_pub').hide();


})

$(document).ready(function f4() {
    let my_pub_perf1 = document.getElementById("pub_performance_for_each_drink").innerText;
    let v1 = my_pub_perf1.split(",*,");
    v1[v1.length - 1] = v1[v1.length - 1].substring(0, v1[v1.length - 1].length - 2);
    let my_pub_perf = v1;
    let dataset_pub_perf = [];
    for (let j = 0; j < my_pub_perf.length; j += 2) {
        dataset_pub_perf.push([my_pub_perf[j], my_pub_perf[j + 1]]);
    }
    $(document).ready( function () {
        t = $('#table_drinks_performance').DataTable({
            data: dataset_pub_perf,
            columns: [
                { title: "Drink" },
                { title: "Average Rank" }
            ]
        })
    });

    $('#pub_performance_for_each_drink').hide();


})