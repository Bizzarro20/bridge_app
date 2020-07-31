//aspetto che i dati arrivino nel ejs, poi questi dati formano il dataset da mettere nella tabella

$.fn.dataTableExt.sErrMode = 'throw';   //necessario per evitare warning persistenti

$(document).ready(function f1() {
        let last_rev1 = document.getElementById("allreviews").innerText;
        let v1 = last_rev1.split(",*,");
        v1[v1.length - 1] = v1[v1.length - 1].substring(0, v1[v1.length - 1].length - 2)
        let last_rev = v1;
        let dataset1 = [];
        for (let j = 0; j < last_rev.length; j += 6) {
            dataset1.push([last_rev[j], last_rev[j + 1], last_rev[j + 2], last_rev[j + 3], last_rev[j + 4], last_rev[j + 5]]);
        }
        $(document).ready(function () {
            $('#table_users_reviews').DataTable({
                data: dataset1,
                columns: [
                    {title: "Date"},
                    {title: "User"},
                    {title: "Pub"},
                    {title: "Drink"},
                    {title: "Rank"},
                    {title: "Comment"}
                ]
            })
        });
        $('#allreviews').hide()


    })

$(document).ready(function f2() {
    let my_rev1 = document.getElementById("userreviews").innerText;
    let v2 = my_rev1.split(",*,");
    v2[v2.length - 1] = v2[v2.length - 1].substring(0, v2[v2.length - 1].length - 2)
    let my_rev = v2;
    let dataset2 = [];
    for (let j = 0; j < my_rev.length; j += 5) {
        dataset2.push([my_rev[j], my_rev[j + 1], my_rev[j + 2], my_rev[j + 3], my_rev[j + 4]]);
    }
    console.log(dataset2)
    $(document).ready(function () {
        $('#table_my_reviews').DataTable({
            data: dataset2,
            columns: [
                {title: "Date"},
                {title: "Pub"},
                {title: "Drink"},
                {title: "Rank"},
                {title: "Comment"}
            ]
        })
    });

    $('#userreviews').hide()
})

$(document).ready(function f3() {
    let drink_user1 = document.getElementById("drinks_for_user").innerText
    let v2 = drink_user1.split(",*,");
    v2[v2.length - 1] = v2[v2.length - 1].substring(0, v2[v2.length - 1].length - 2)
    let drink_user = v2;

    let dataset_drink_user = [];
    for (var i = 0; i < drink_user.length; i+=4) {
        dataset_drink_user.push([drink_user[i],drink_user[i+1],drink_user[i+2],drink_user[i+3]]);
    }
    $(document).ready( function () {
        $('#table_drink_info_for_user').DataTable({
            data: dataset_drink_user,
            columns: [
                { title: "Drink" },
                { title: "Category" },
                { title: "Alcoholic/Not Alcoholic" },
                { title: "Ingredient" }
            ]
        })
    });
    $('#drinks_for_user').hide()


});


$(document).ready(function f4() {
    let catalogues1 = document.getElementById("catalogues").innerText
    let v2 = catalogues1.split(",*,");
    v2[v2.length - 1] = v2[v2.length - 1].substring(0, v2[v2.length - 1].length - 2)
    let catalogues = v2;

    let dataset_catalogue = [];
    for (var i = 0; i < catalogues.length; i += 2) {
        dataset_catalogue.push([catalogues[i], catalogues[i + 1]]);
    }

    $(document).ready(function () {
        $('#table_catalogues').DataTable({
            data: dataset_catalogue,
            columns: [
                {title: "Pub"},
                {title: "Drink"}
            ]
        })
    })
    $('#catalogues').hide()

});

