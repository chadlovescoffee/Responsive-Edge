var $ = require('jquery');

var edge_wrapper = '';
var edge_load = '';
var edge_width = 0;
var edge_queue_i = 0;
var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);


// window load
$(window).load(function(){
    scan_for_edge();
});



// window resize (all but mobile safari)
$(window).resize(function() {

    if(!isSafari){
        edge_resize();

    }
});


// Resize for mobile safari
window.addEventListener("orientationchange", function() {

    if(isSafari) {
        edge_resize();
    }

});


// Edge Resize
function edge_resize() {

    var old_size = $(window).width();

    setTimeout(function(){
        var new_size = $(window).width();

        if (old_size == new_size) {
            edge_queue_i = 0;
            scan_for_edge();
        }
    }, 400);
}




// create JSON of Edge Elements on page
function scan_for_edge(){
    //console.log('scan for edge');

    var edge_qty = $('.edge_wrapper').length;
    var edge_elements = [];

    var i = 0;
    $('.edge_wrapper').each(function () {
        edge_elements.push( $(this).attr('id') );
        i++;

        if(i == edge_qty) {

            if(edge_queue_i != edge_qty) {
                edge_breakpoints(edge_elements[edge_queue_i]);
            }
        }
    });
}




// Edge Breakpoints
function edge_breakpoints(edge_wrapper) {
    //console.log('edge breakpoints');

    // remove existing Edge element
    $('#' + edge_wrapper).find('.edge_mobile, .edge_tablet, .edge_desktop').remove();

    // remove existing Edge script
    $('.edge_script.' + edge_wrapper).remove();



    // If Edge Responsive
    var units = '';
    if($('#' + edge_wrapper).attr('data-size') == null) {

        // Mobile
        if ($(window).width() < 768) {
            edge_width = 320;
        }

        // Tablet
        if ($(window).width() >= 768 && $(window).width() < 1024) {
            edge_width = 768;
        }

        // Desktop
        if ($(window).width() >= 1024) {
            edge_width = 1024;
        }

        edge_load = edge_wrapper + '_' + edge_width;
        units = 'px';

    } else {

        // if not responsive
        edge_load = edge_wrapper + '_' + $('#' + edge_wrapper).attr('data-size');
        edge_width = 100;
        units = '%';
    }


    //add dynamic div
    $('#' + edge_wrapper).html('<div class="edge ' + edge_load + '"></div>');


    //load edge element
    $.getScript( "dist/edge.js", function() {
        AdobeEdge.loadComposition(edge_load, edge_load, {
            centerStage: "none",
            width: edge_width + units,
        }, {"dom": {}}, {"dom": {}});
    });


    //Check if edge has loaded
    check_edge_load(edge_wrapper, edge_width);
}




// check if edge has loaded
function check_edge_load(edge_wrapper, edge_width){

    var timer = setInterval(function () {
        edge_monitor()
    }, 50);

    function edge_monitor() {
        //console.log('edge is loading.');

        if ($('#' + edge_wrapper).find('.edge > div').length > 0) {
            //console.log('edge had loaded');

            clearInterval(timer);
            edge_queue_i++;
            scan_for_edge();


            $('script').each(function () {


                var script_src = $(this).attr('src');
                //console.log(script_src);

                if(script_src != undefined){
                    if(script_src.indexOf(edge_wrapper) >= 0) {
                        $(this)
                            .addClass('edge_script')
                            .addClass(edge_wrapper);
                    }
                }
            });
        }
    }
}