$(document).ready(function() {
    var response = JSON.parse(document.getElementById('response').innerHTML);

    document.getElementById('response').remove();

    let resName = document.getElementById('res-name');
    let resDes = document.getElementById('res-des');
    let resCode = document.getElementById('res-code');

    resName.innerHTML = response.name;
    resDes.innerHTML = response.description;
    resCode.innerHTML = `Error Code: ${response.code}`;

    $('#ErrorModal').modal('show');

    let modalDialog = $(this).find("#ErrorModal .modal-dialog");
                
    function alignModal() {
        modalDialog.css("margin-top", Math.max(0, ($(window).height() - modalDialog.height()) / 2));
    }
    $("#ErrorModal").on("show.bs.modal", alignModal);

    $(window).on("resize", function() {
        $(".modal:visible").each(alignModal);
    });

    let script = document.createElement('script');
    
    if (Math.random() < 0.5) {
        script.src = '/static/js/matrixTextRain.js';
    } else {
        script.src = '/static/js/fireworks.js';
        let canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        document.body.appendChild(canvas);
    }

    document.body.insertBefore(script, document.getElementById('Error-Handler-Script'));

    script.onload = function() { initMatrix(); return null; };
});
