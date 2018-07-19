// tray infinity scroll
jQuery.fn.trayloadmore = function (options) {
    var defaults = {
        loading: false,
        currentPage: 0,
        totalPages: 0,
        pagesLoaded: 0,
        limit: 0,
        urls: []
    };
    var settings = jQuery.extend({}, defaults, options);

    init();

    function init() {
        settings.totalPages = jQuery(settings.pagenationContainer + ' .page-link a').size();
        jQuery(window).bind('scroll', onPageScroll);
        jQuery(settings.buttonLoadMore).bind('click', onLoadMoreClick);
        hideIncompleteRow();
        getUrls();
    };

    function hideIncompleteRow() {
        if (settings.totalPages > 0 && settings.currentPage < settings.totalPages) {
            jQuery.each(jQuery(settings.productsGrid + ' ul'), function (val, i) {
                if (jQuery(this).children('li').size() < settings.itemsPerRow) {
                    jQuery(this).hide();
                }
            });
        }
    };

    function getUrls() {
        jQuery.each(jQuery(settings.pagenationContainer + ' .page-link a'), function (val, i) {
            settings.urls[settings.urls.length] = jQuery(this).attr('href');
        });
    };

    function onPageScroll(e) {
        var currentScrollPosition = jQuery(window).scrollTop();
        settings.limit = jQuery(settings.productsGrid).height() + (jQuery(settings.productsGrid).offset().top / 2);

        if (settings.limitPagesOnScroll == settings.pagesLoaded && settings.currentPage < settings.totalPages) {
            jQuery(window).unbind('scroll', onPageScroll);
            jQuery(settings.preloader).hide();
            jQuery(settings.buttonLoadMore).show();
        }

        if (currentScrollPosition >= settings.limit && settings.currentPage < settings.totalPages) {
            if (!settings.loading)
                loadMoreItems();
        }

        if (settings.currentPage == settings.totalPages) {
            jQuery(settings.preloader).hide();
        }
    };

    function onLoadMoreClick(e) {
        if (settings.currentPage < settings.totalPages) {
            if (!settings.loading)
                loadMoreItems();
        }
    };

    function loadMoreItems() {
        settings.loading = true;
        var url = settings.urls[settings.currentPage];

        // agora carregará a pagina
		jQuery(settings.buttonLoadMore+' i').addClass('fa-spin');
        jQuery.get(url, function (data) {
            var htmlLoaded = jQuery(data);
			console.info(htmlLoaded)
            var lis = jQuery(settings.productsGrid + ' ul li', htmlLoaded);

            jQuery.each(lis, function (val, i) {
                var count = jQuery(settings.productsGrid + ' ul').last().children().size();

                if (count < settings.itemsPerRow) {
                    jQuery(settings.productsGrid + ' ul').last().show();
                } else {
                    jQuery(settings.productsGrid).append('<ul class="carousel-wrap"></ul>');
                }

                jQuery(settings.productsGrid + ' ul').last().append('<li class="col-md-3 col-sm-6 col-xs-12 product-item">' + jQuery(this).html() + '</li>');
            });
            settings.loading = false;
            settings.currentPage++;
            settings.pagesLoaded++;
            hideIncompleteRow();

            // dispatch event
            if (typeof (settings.callback) == 'function') {
                settings.callback();
            }
            jQuery(settings.buttonLoadMore+' i').removeClass('fa-spin');
        });
    };

	if (settings.currentPage == settings.totalPages) {
		jQuery(settings.buttonLoadMore).hide();
	}
    return this;
};

jQuery(window).load(function () {

    var pagesLoaded = 0;

    var onLoad = function () {
    };

	if (jQuery('html').hasClass('page-catalog')) {
		jQuery('body').trayloadmore({
			productsGrid: '.products-grid',
			pagenationContainer: '.products-grid-footer',
			itemsPerRow: 4,
			rowsPerLoad: 4,
			preloader: '.products-grid-footer .loading',
			buttonLoadMore: '.products-grid-footer .load-more',
			callback: onLoad,
			limitPagesOnScroll: 0
		});
	}

    // jQuery('[name=order]').bind('change', function(){
    //     var link = jQuery('.page-link a').attr('href');
    //     location.href = link.substr(0, link.indexOf('&pg=')) + '&order=' + this.value;
    // });

    onLoad();

    var loadEvent = new Event('onLoadedItems');
});
