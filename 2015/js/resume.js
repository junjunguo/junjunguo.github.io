/**
 * Created by junjun on 27.12.14.
 */
jQuery(document).ready(function($) {

//Timeline
    $('.timeline-item-trigger span').click(function () {
        if ($(this).hasClass('fa fa-plus')) {
            $(this).removeClass('fa fa-plus').addClass('fa fa-minus');
        } else {
            $(this).removeClass('fa fa-minus').addClass('fa fa-plus');
        }
    });
    $('.timeline-item-title').click(function () {
        $trigger = $(this).parent().parent().find('.timeline-item-trigger span');
        if ($trigger.hasClass('fa fa-plus')) {
            $trigger.removeClass('fa fa-plus').addClass('fa fa-minus');
        } else {
            $trigger.removeClass('fa fa-minus').addClass('fa fa-plus');
        }
    });
});