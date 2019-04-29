

jQuery(document).ready(function() {
    
    // $(".card").flip();
    // var height =  $(".card").outerHeight();
    // $(".card").flip().height(height);
    /*
        Login form validation
    */
    $('.login-form input[type="text"], .login-form input[type="number"], .login-form input[type="password"], .login-form textarea, select').on('focus', function() {
    	$(this).removeClass('input-error');
    });

    $('.login-form').on('submit', function(e) {

    	$(this).find('input[type="text"], input[type="password"], textarea, select, input[type="number"]').each(function(){
    		if( $(this).val() == "" ) {
    			e.preventDefault();
    			$(this).addClass('input-error');
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});

    });

    /*
        Registration form validation
    */
    $('.registration-form input[type="text"], .registration-form input[type="password"],  select ').on('focus', function() {
    	$(this).removeClass('input-error');
    });

    $('.registration-form').on('submit', function(e) {

    	$(this).find('input[type="text"], input[type="password"], select').each(function(){
    		if( $(this).val() == "" ) {
    			e.preventDefault();
    			$(this).addClass('input-error');
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});

    });

    $('#table_dashboard').DataTable();

    $('#table_id').DataTable({
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;

            // Remove the formatting to get integer data for summation
            var intVal = function ( i ) {
                // console.log('*******************' + i);
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;

            };

            // Total over all pages
            total = api
                .column( 2 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            // Total over this page
            pageTotal = api
                .column( 2, { page: 'current'} )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            // Update footer
            $( api.column( 2 ).footer() ).html(
                '$ '+pageTotal + '.00'

            );
            $( api.column( 4 ).footer() ).html(
                'Total:'

            );
            $( api.column( 5 ).footer() ).html(
                '$ '+ total + '.00'

            );

            // console.log('*******************' + pageTotal);
            // console.log( total);
        }
    } );

    $('#table_records').DataTable({
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;

            // Remove the formatting to get integer data for summation
            var intVal = function ( i ) {
                // console.log('*******************' + i);
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;

            };

            // Total over all pages
            total = api
                .column( 14 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );


            // Total over this page
            pageTotal = api
                .column( 14, { page: 'current'} )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            // Update footer
            $( api.column( 14 ).footer() ).html(
                '$ '+ pageTotal.toFixed(2)

            );
            $( api.column( 0 ).footer() ).html(
                'Overall'

            );
            $( api.column( 13 ).footer() ).html(
                'Total'

            );


            // console.log('*******************' + pageTotal);
            // console.log( total);
        }
    } );

    $('#table_winnings').DataTable({
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;

            // Remove the formatting to get integer data for summation
            var intVal = function ( i ) {
                // console.log('*******************' + i);
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;

            };

            // Total over all pages
            total = api
                .column( 2 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            // Total over this page
            pageTotal = api
                .column( 2, { page: 'current'} )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            // Update footer
            $( api.column( 2 ).footer() ).html(
                '$ '+pageTotal.toFixed(2)

            );
            $( api.column( 4 ).footer() ).html(
                'Total: $ '+ total.toFixed(2)

            );

            // console.log('*******************' + pageTotal);
            // console.log( total);
        }
    } );

    $('#table_paid').DataTable({
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;

            // Remove the formatting to get integer data for summation
            var intVal = function ( i ) {
                // console.log('*******************' + i);
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;

            };

            // Total over all pages
            total = api
                .column( 2 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            // Total over this page
            pageTotal = api
                .column( 2, { page: 'current'} )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

            // Update footer
            $( api.column( 2 ).footer() ).html(
                '$ '+pageTotal.toFixed(2)

            );
            $( api.column( 4 ).footer() ).html(
                'Total: $ '+ total.toFixed(2)

            );

            // console.log('*******************' + pageTotal);
            // console.log( total);
        }
    } );
    
    
});
