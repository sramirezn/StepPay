$(
    function () {
        $('form').on('reset', ResetButtons);
        if ($('.alert-success').length !== 0 && window.location.pathname.indexOf('Create') !== -1) {
            disableControls();
        }
    }
)

function disableControls() {
    $('form input:not([type="reset"])').attr('disabled', true);
    $('button').attr('disabled', false);
}

function ResetButtons(event) {
    event.preventDefault();
    var form = $(this).parentsUntil('form').parent();
    $('input[type="text"], input[type="time"], input[type="tel"], input[type="email"],input[type="Date"] ', form).val('');


    $('select', form).prop('selectedIndex', 0);
    $(form).trigger('reset');

    if ($('input[type="submit"]').length > 0) {
        $('input').prop('disabled', false);
    }
    
    $('.alert').fadeOut(500);
}

