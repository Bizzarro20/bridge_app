//GESTIONE LOGIN CON SEGNALAZIONI DI CAMPI INVALIDI

$(document)
    .ready(function() {
        $('.ui.form')
            .form({
                fields: {
                    email: {
                        identifier  : 'emaillogin',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter your e-mail'
                            },
                            {
                                type   : 'email',
                                prompt : 'Please enter a valid e-mail'
                            }
                        ]
                    },
                    password: {
                        identifier  : 'passwordlogin',
                        rules: [
                            {
                                type   : 'empty',
                                prompt : 'Please enter your password'
                            },
                            {
                                type   : 'length[6]',
                                prompt : 'Your password must be at least 6 characters'
                            }
                        ]
                    }
                }
            })
        ;
    })
;