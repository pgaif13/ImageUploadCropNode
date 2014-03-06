﻿
jQuery(document).ready(function () {
    jQuery('#Image1').Jcrop({
        onChange: showCoords,
        onSelect: showCoords,
        bgOpacity: .4,
        setSelect: [0, 0, 900, 1200],
        aspectRatio: '@ratio',
        trueSize: ['@newwvalue', '@newhvalue']
    });
});
// Simple event handler, called from onChange and onSelect
// event handlers, as per the Jcrop invocation above
function showCoords(c) {
    jQuery('#X1value').val(Math.round(c.x));
    jQuery('#Y1value').val(Math.round(c.y));
    jQuery('#X2value').val(Math.round(c.x2));
    jQuery('#Y2value').val(Math.round(c.y2));
    jQuery('#Wvalue').val(Math.round(c.w));
    jQuery('#Hvalue').val(Math.round(c.h));
    var rx = '@rxvalue' / c.w;
    var ry = '@ryvalue' / c.h;
    $('#preview').css({
        width: Math.round(rx * '@newwvalue2') + 'px',
        height: Math.round(ry * '@newhvalue2') + 'px',
        marginLeft: '-' + Math.round(rx * c.x) + 'px',
        marginTop: '-' + Math.round(ry * c.y) + 'px'
    });
};