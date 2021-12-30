var cardNumberValid = false;
//var counter = 0;

$(
    function () {
        $.validator.addMethod("valueNotEquals", function (value, element, arg) {
            return arg !== value;
        }, "Value must not equal arg.");

        $('input[name="addressId"]').on('change', addressChange);
        $('#btnAddAddress').on('click', addAddressForm);
        $('.editAddress').on('click', editAddressForm);
        $('.deleteAddress').on('click', deleteAddress);
        //$('#CardNumber').on('keydown input', { quantity: 16 }, onlyNumbers);
        //$('#CardNumber').on('focusin', function () {
        //    $(this).val($(this).val().replace(new RegExp(" ", "g"), ''));
        //    $(this).attr('maxlength', '16');
        //    return true;
        //});

        $('#CardNumber').on('focusout', function () {
            $(this).attr('maxlength', '19');
            var cardNumberArray = $(this).val().split('');
            var cardWithSpace = '';
            $(cardNumberArray).each(function (index, element) {
                cardWithSpace += element;
                if ((index + 1) % 4 !== 0 || index === 15) {
                    return true;
                }

                cardWithSpace += ' ';
            });

            $(this).val(cardWithSpace);
        });

        $('#CVV').on("keydown input", { quantity: 4 }, onlyNumbers);
        $('#cardRegistration').on('submit', registerCard);
        $('#CardNumber').validateCreditCard(function (result) {
            $('#CardNumber + .text-danger').children().remove()
            cardNumberValid = result.valid;
            var background = '';
            background = $('#CardNumber').css("background-position");

            var indexFirstSpace = background.indexOf(' ');
            var secondPx = background.indexOf('px', indexFirstSpace);
            var back = [];
            back = background.split('');

            $('#CardType').val('');

            if (result.card_type) {

                switch (result.card_type.name) {
                    case 'amex':
                        back.splice(indexFirstSpace + 1, secondPx, '-174px,');
                        $('#CardNumber').css("background-position", back.join(''));
                        $('#CardType').val('193');
                        break;
                    case 'visa':
                        back.splice(indexFirstSpace + 1, secondPx, '-122px,');
                        $('#CardNumber').css("background-position", back.join(''));
                        $('#CardType').val('97');
                        break;
                    case 'mastercard':
                        back.splice(indexFirstSpace + 1, secondPx, '-224px,');
                        $('#CardNumber').css("background-position", back.join(''));
                        $('#CardType').val('98');
                        break;
                    default:
                        back.splice(indexFirstSpace + 1, secondPx, '-71px,');
                        $('#CardNumber').css("background-position", back.join(''));
                        break;

                }
            }
            else {
                back.splice(indexFirstSpace + 1, secondPx, '-71px,');
                $('#CardNumber').css("background-position", back.join(''));
            }


            background = $('#CardNumber').css("background-position");
            var indexLastSpace = background.lastIndexOf(' ');
            // console.log(background);

            if (!cardNumberValid) {
                //$('#CardNumber').css("background-position", "2px -71px, 170% 3px");
                $('#CardNumber').css("background-position", background.slice(0, indexLastSpace + 1) + '3px');
            }
            else {
                //$('#CardNumber').css("background-position", "2px -71px, 170% 3px");
                $('#CardNumber').css("background-position", background.slice(0, indexLastSpace + 1) + '-29px');
            }
        });
    }
);


function onlyNumbers(evt) {
    //console.log(++counter);
    var ignore = [8, 9, 32, 37, 38, 39, 40];
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;

    if (ignore.indexOf(key) === -1) {
        key = String.fromCharCode(key);
        var regex = /[0-9]|\./;
        if (!regex.test(key) || $(this).val().replace(new RegExp(" ", "g"), '').length >= theEvent.data.quantity) {
            if (theEvent.preventDefault) theEvent.preventDefault();
            else theEvent.stop();

            theEvent.returnValue = false;
            theEvent.stopPropagation();
        }
    }
}

function RegisterAddress(event) {
    event.preventDefault();
    $('#RegisterAddress').validate({
        rules: {
            Direccion: {
                "required": true,
                "minlength": 5,
                "maxlength": 150
            },
            Sector: {
                "required": true,
                "minlength": 2,
                "maxlength": 150
            },
            Ciudad: {
                "required": true,
                "minlength": 2,
                "maxlength": 50
            },
            EstadoProvinciaRegion: {
                "required": true,
                "minlength": 2,
                "maxlength": 150
            },
            NvPais: { valueNotEquals: "" },
            NVTipo_Direccion: { valueNotEquals: "" }


        },
        messages: {
            Direccion: {
                "required": "El campo Dirección es requerido.",
                "minlength": "El campo Dirección debe tener más de 5 caracteres.",
                "maxlength": "El campo Dirección debe tener menos de 150 caracteres."
            },
            Sector: {
                "required": "El campo Sector es requerido.",
                "minlength": "El campo Sector debe tener más de 2 caracteres.",
                "maxlength": "El campo Sector debe tener menos de 150 caracteres."
            },
            Ciudad: {
                "required": "El campo Ciudad es requerido.",
                "minlength": "El campo Ciudad debe tener más de 2 caracteres.",
                "maxlength": "El campo Ciudad debe tener menos de 50 caracteres."
            },
            EstadoProvinciaRegion: {
                "required": "Este campo es requerido.",
                "minlength": "Este campo debe tener más de 2 caracteres.",
                "maxlength": "Este campo debe tener menos de 50 caracteres."
            },
            NvPais: { valueNotEquals: "Por favor, seleccione un pais!" },
            NVTipo_Direccion: { valueNotEquals: "Por favor, seleccione el tipo de direccion!" }

        }
    });


    var validator = $('#RegisterAddress').validate();
    validator.settings.errorClass = 'custom-error';
    $('#RegisterAddress').valid();
   
    var numberOfErrors = validator.numberOfInvalids();
    if (!numberOfErrors) {
        $('button[type="submit"]', '#RegisterAddress').addClass('running').attr('disabled', true);
        $.ajax(location.origin + '/Address/AddAddress',
            {
                method: 'POST',
                data: {
                    __RequestVerificationToken: $('input[name="__RequestVerificationToken"]', '#RegisterAddress').first().val(),
                    address: objectifyForm($('#RegisterAddress').serializeArray())
                },
                dataType: 'json',
                success: function (data) {
                    $('.address').remove();
                    InsertAddresses(data);

                    $('.editAddress').on('click', editAddressForm);
                    $('.deleteAddress').on('click', deleteAddress);
                    $('.modal').modal('hide');
                    $('button[type="submit"]', '#cardRegistration').attr('disabled', false);
                    $('input[name="addressId"]').on('change', addressChange);
                },
                error: function (e) {

                    if (e.status === 400 && e.responseJSON && e.responseJSON.ModelState) {
                        var errors = {};
                        for (let [key, value] of Object.entries(e.responseJSON.ModelState)) {
                            var name = key;
                            if (name.indexOf('.') !== -1)
                                name = name.substring(name.lastIndexOf('.') + 1);

                            errors[name] = value[0];
                        }

                        validator.showErrors(errors);
                    } else if (e.status === 302) {
                        window.location = e.responseText;
                    } else {

                        showErrorModal('Datos Invalidos', 'Los datos son invalidos. Intentelo otra vez!');
                    }
                    $('button[type="submit"]', '#RegisterAddress').attr('disabled', false);
                },
                complete: function () {
                    $('button[type="submit"]', '#RegisterAddress').removeClass('running');
                }
            }
        );
    }

    $('label.custom-error','#RegisterAddress').each(function (index,element) {
        let parent = $(this).parent();
        $(this).remove();
        $(element).insertAfter($('.line-bottom', parent));
    });
}


function editAddress(event) {
    event.preventDefault();
    $('#EditAddress').validate({
        rules: {
            Direccion: {
                "required": true,
                "minlength": 5,
                "maxlength": 150
            },
            Sector: {
                "required": true,
                "minlength": 2,
                "maxlength": 150
            },
            Ciudad: {
                "required": true,
                "minlength": 2,
                "maxlength": 50
            },
            EstadoProvinciaRegion: {
                "required": true,
                "minlength": 2,
                "maxlength": 150
            }


        },
        messages: {
            Direccion: {
                "required": "El campo Dirección es requerido.",
                "minlength": "El campo Dirección debe tener más de 5 caracteres.",
                "maxlength": "El campo Dirección debe tener menos de 150 caracteres."
            },
            Sector: {
                "required": "El campo Sector es requerido.",
                "minlength": "El campo Sector debe tener más de 2 caracteres.",
                "maxlength": "El campo Sector debe tener menos de 150 caracteres."
            },
            Ciudad: {
                "required": "El campo Ciudad es requerido.",
                "minlength": "El campo Ciudad debe tener más de 2 caracteres.",
                "maxlength": "El campo Ciudad debe tener menos de 50 caracteres."
            },
            EstadoProvinciaRegion: {
                "required": "Este campo es requerido.",
                "minlength": "Este campo debe tener más de 2 caracteres.",
                "maxlength": "Este campo debe tener menos de 50 caracteres."
            }

        }
    });

    $('#EditAddress').valid();
    var validator = $('#EditAddress').validate();
    var numberOfErrors = validator.numberOfInvalids();
    if (!numberOfErrors) {
        $('button[type="submit"]', '#EditAddress').addClass('running').attr('disabled', true);
        var addressID = $('#addressID', '#EditAddress').val();
        $.ajax(location.origin + '/Address/Edit?addressID=' + addressID,
            {
                method: 'POST',
                data: {
                    __RequestVerificationToken: $('input[name="__RequestVerificationToken"]', '#EditAddress').first().val(),
                    address: objectifyForm($('#EditAddress').serializeArray())
                },
                dataType: 'json',
                success: function (data) {
                    $('.address').remove();
                    InsertAddresses(data);
                    $('input[name="addressId"]').on('change', addressChange);
                    $('.editAddress').on('click', editAddressForm);
                    $('.deleteAddress').on('click', deleteAddress);
                    $('.modal').modal('hide');
                    //$('button[type="submit"]', '#cardRegistration').attr('disabled', false);
                },
                error: function (e) {
                    if (e.status === 400 && e.responseJSON && e.responseJSON.ModelState) {
                        var errors = {};
                        for (let [key, value] of Object.entries(e.responseJSON.ModelState)) {
                            var name = key;
                            if (name.indexOf('.') !== -1)
                                name = name.substring(name.lastIndexOf('.') + 1);

                            errors[name] = value[0];
                        }

                        validator.showErrors(errors);
                    } else if (e.status === 302) {
                        window.location = e.responseText;
                    } else {
                        showErrorModal('Datos Invalidos', 'Los datos son invalidos. Intentelo otra vez!');
                    }
                    $('button[type="submit"]', '#EditAddress').attr('disabled', false);
                },
                complete: function () {
                    $('button[type="submit"]', '#EditAddress').removeClass('running');
                }
            }
        );
    }
}


function registerCard(event) {
    event.preventDefault();
    var validator = $('#cardRegistration').validate();
    var numberOfErrors = validator.numberOfInvalids();

    //$('#CardNumber').validateCreditCard(function (result) { cardNumberValid = result.valid });

    if (!cardNumberValid) validator.showErrors({ "CardNumber": "Tarjeta Invalida" });


    if ($('input[name="addressId"]:checked').length === 0) {
        alert("Por favor, agregue una dirección para continuar!");
    }

    if (!numberOfErrors && cardNumberValid) {
        $('button[type="submit"]', '#cardRegistration').addClass('running').attr('disabled', true);
        $('#CardNumber').val($('#CardNumber').val().replace(new RegExp(" ", "g"), ''));
        this.submit();
    }
}


function addAddressForm(e) {
    e.preventDefault();
    $('#addAddressModal').remove();
    var clientId = $('#Numero_Identificacion').val();

    $.ajax(location.origin + '/Address/AddAddress?clientId=' + clientId,
        {
            success: function (data) {
                $('.modal').modal('hide');
                $('body').append(data);

                $('#RegisterAddress').on('submit', RegisterAddress);
                $('.mobile-label + div > input, .mobile-label + div > select').on('focusin', adjustLabelIn);
                $('.mobile-label + div > input, .mobile-label + div > select').on('focusout', adjustLabelOut);
                $('#addAddressModal').modal('show').on('hidden.bs.modal', function (e) {
                    setTimeout(1000, function () {
                        $('#addAddressModal').remove();
                    });
                });

            },
            error: function () {
                if (ex.status === 302) {
                    window.location = ex.responseText;
                } else {
                    showErrorModal('Añadir Dirección', ex.responseText);
                }
            }
        }
    );
}

function editAddressForm(e) {
    e.preventDefault();
    $('#editAddressModal').remove();
    var clientId = $('#Numero_Identificacion').val();

    $.ajax(e.currentTarget.href,
        {
            success: function (data) {
                $('.modal').modal('hide');
                $('body').append(data);
                $('.mobile-label + div > input, .mobile-label + div > select').on('focusin', adjustLabelIn);
                $('.mobile-label + div > input, .mobile-label + div > select').on('focusout', adjustLabelOut);


                $('#EditAddress').on('submit', editAddress);
                $('#editAddressModal').modal('show')//.on('shown.bs.modal', function () {
                    //
                    //    })
                    .on('hidden.bs.modal', function (e) {
                        setTimeout(1000, function () {

                            $('#editAddressModal').remove();
                        });
                    });

            },
            error: function (e) {
                console.log(e);
                alert("Ha ocurrido un error. Intentelo más tarde!");
            }
        }
    );
}


function validateCard(e) {
    e.preventDefault();
    var validator = $('#formValidator').validate();
    var validNumberCard = 0;
    // $('#CardNumber').validateCreditCard(function (result) { if (result.valid) validNumberCard = 1 });
    var numberOfErrors = validator.numberOfInvalids() + validNumberCard;
    if (!numberOfErrors) {
        $('button[type="submit"]', '#cardValidatorModal').addClass('running').attr('disabled', true).children('span').text('Validando');
        $.ajax('/Api/CardsApi',
            {
                method: 'GET',
                data: { id: $('#amount').val() },
                dataType: 'json',
                success: function (data) {
                    console.log(data);
                    $('.modal').modal('hide');
                    $('#activationSuccess').modal('show');
                },
                error: function (e) {
                    if (e.status === 400 && e.responseJSON.ErrorCount < 3)
                        $('#amount').next('[data-valmsg-for="amount"]').html('<span id="amount-error" class="">El monto es invalido. Por favor intentelo otra vez!</span>');
                    else if (e.status !== 400 && e.responseJSON.ErrorCount < 3) {
                        $('#amount').next('[data-valmsg-for="amount"]').html('<span id="amount-error" class="">Ha ocurrido un error. Intentelo otra vez!</span>');
                    } else {
                        showErrorModal('Blocked Card', 'Su tarjeta ha sido bloqueada en nuestro sistema por motivos de seguridad. Por favor comuniquese al (###) ###-#### para más información o escribanos a agilisa@agilisa.com.');
                    }
                    $('button[type="submit"]', '#cardValidatorModal').attr('disabled', false);
                },
                complete: function () {
                    $('button[type="submit"]', '#cardValidatorModal').removeClass('running').children('span').text('Validate');
                }
            });
    } else {
        var errors = validator.errorList;
        $(errors).each(function () {
            $(this.element).next().html(this.message);
        });
    }
}


function showErrorModal(title, message) {
    $('.modal').modal('hide');
    var modal = $('#error');
    $('#title', modal).text(title);
    $('#message', modal).text(message);
    modal.modal('show');
}

function objectifyForm(formArray) {//serialize data function

    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}



function addressChange(e) {
    $('.address-icons').css({ display: 'none', opacity: 0 });
    $(this).parent().parent().next().removeClass('display-none').css({ display: 'block' }).animate({ opacity: 1 }, 500, 'swing');
}



function deleteAddress(event) {
    event.preventDefault();
    if (confirm("Esta seguro que desea eliminar esta dirección?")) {
        $.ajax($(this).attr('href'),
            {
                method: 'POST',
                data: { __RequestVerificationToken: $('input[name="__RequestVerificationToken"]', '#cardRegistration').first().val(), clientID: $('#clientId').val() },
                dataType: 'json',
                success: function (data) {
                    $('.address').remove();
                    if (data.length > 0) {
                        InsertAddresses(data);
                    } else {
                        var html = '<div class="address"><span class="error">Debe agregar un dirección para proceder con el registro.</span></div>';
                        $('#fieldsetAddress').after(html);
                        $('button[type="submit"]', '#cardRegistration').attr('disabled', true);

                    }
                    $('.editAddress').on('click', editAddressForm);
                    $('.deleteAddress').on('click', deleteAddress);
                    $('input[name="addressId"]').on('change', addressChange);
                },
                error: function (ex) {
                    if (ex.status === 302) {
                        window.location = ex.responseText;
                    } else {
                        showErrorModal('Eliminar Dirección', ex.responseText);
                    }
                }
            }
        );
    }
}

function InsertAddresses(data) {
    $.each(data, function (index, val) {
        var html = '';
        if (val.IsDefault) {
            html += '<div class="address addressselected text-justify">' +
                '<div class="cntr">' +
                '<label class="btn-radio no-center">' +
                '<input type="radio" name="addressId" value="'+val.AddressID+' " checked="">' +
                '<svg width="15px" height="15px" viewBox="0 0 20 20">' +
                '<circle cx="10" cy="10" r="9"></circle>' +
                '<path d="M10,7 C8.34314575,7 7,8.34314575 7,10 C7,11.6568542 8.34314575,13 10,13 C11.6568542,13 13,11.6568542 13,10 C13,8.34314575 11.6568542,7 10,7 Z" class="inner"></path>' +
                '<path d="M10,1 L10,1 L10,1 C14.9705627,1 19,5.02943725 19,10 L19,10 L19,10 C19,14.9705627 14.9705627,19 10,19 L10,19 L10,19 C5.02943725,19 1,14.9705627 1,10 L1,10 L1,10 C1,5.02943725 5.02943725,1 10,1 L10,1 Z" class="outer"></path>' +
                '</svg>' +
                '<span>'+val.Address+'</span>' +
                '</label>' +
                '</div>' +
                '<div class="text-right address-icons">';
            if (val.CanBeDeleted) {
                html += '<span class="low-padding">' +
                    '<a href="/PagaTodo/Address/Delete?addressID='+val.AddressID+' " class="deleteAddress"> <span style="font-size:20px"><i class="fa fa-trash" style="color:#0056B8"></i></span></a>' +
                    '</span>';
            }

            html += '<span class="low-padding">' +
                '<a href="/PagaTodo/Address/Edit?addressID='+val.AddressID+'&clientID='+ $('#clientId').first().val()+'" class="editAddress"><span style="font-size:20px"><i class="fa fa-edit" style="color:#0056B8"></i></span></a>'+
                    '</span>' +
                    '</div>' +
                    '</div>';
        } else {
            html += '<div class="address text-justify">' +
                '<div class="cntr">' +
                '<label class="btn-radio no-center">' +
                '<input type="radio" name="addressId" value="'+val.AddressID+'" checked="">' +
                '<svg width="15px" height="15px" viewBox="0 0 20 20">' +
                '<circle cx="10" cy="10" r="9"></circle>' +
                '<path d="M10,7 C8.34314575,7 7,8.34314575 7,10 C7,11.6568542 8.34314575,13 10,13 C11.6568542,13 13,11.6568542 13,10 C13,8.34314575 11.6568542,7 10,7 Z" class="inner"></path>' +
                '<path d="M10,1 L10,1 L10,1 C14.9705627,1 19,5.02943725 19,10 L19,10 L19,10 C19,14.9705627 14.9705627,19 10,19 L10,19 L10,19 C5.02943725,19 1,14.9705627 1,10 L1,10 L1,10 C1,5.02943725 5.02943725,1 10,1 L10,1 Z" class="outer"></path>' +
                '</svg>' +
                '<span>'+val.Address+'</span>' +
                '</label>' +
                '</div>' +
                '<div class="text-right address-icons display-none">';
            if (val.CanBeDeleted) {
                html += '<span class="low-padding">' +
                    '<a href="/PagaTodo/Address/Delete?addressID='+val.AddressID+' " class="deleteAddress"> <span style="font-size:20px"><i class="fa fa-trash" style="color:#0056B8"></i></span></a>' +
                    '</span>';
            }

            html += '<span class="low-padding">' +
                '<a href="/PagaTodo/Address/Edit?addressID='+ val.AddressID+'&clientID='+ $('#clientId').first().val()+'" class="editAddress"><span style="font-size:20px"><i class="fa fa-edit" style="color:#0056B8"></i></span></a>'+
                    '</span>' +
                    '</div>' +
                    '</div>';
        }
        $('#fieldsetAddress + div:first').after(html);
    });
}


function adjustLabelIn() {
        $(this).parent().prev().animate(
            { top: 2, fontSize: '14px' }, 300, 'swing'
        );
}

function adjustLabelOut() {
    if ($(this).attr('type') === 'text' && $(this).val().length === 0 || $(this).is('select') && $(this).val() === "") {
       if($(this).is('select')){
            $(this).parent().prev().animate(
                { top: 42, fontSize: '18px' }, 300, 'swing'
            );
       } else
       {
            $(this).parent().prev().animate(
                { top: 28, fontSize: '18px' }, 300, 'swing'
            );
        }
        
    }
}
