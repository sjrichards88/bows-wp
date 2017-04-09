<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title><?php wp_title( '&ndash;', true, 'right' ); ?></title>
    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0">
    <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">

    <!-- Bootstrap -->
    <link href='http://fonts.googleapis.com/css?family=Cinzel&#038;subset=latin' rel='stylesheet'>
    <link href="https://fonts.googleapis.com/css?family=Ruthie" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=PT+Sans:300,400,700" rel="stylesheet">

    <?php wp_head(); ?>

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body>
    
    <a href="#" class="glyphicon glyphicon-menu-up scroll-up"></a>

    <header class="header home">

        <?php include(get_template_directory() . '/partials/navigation.php'); ?>
        
        <div class="container intro">
            <h1><?php the_field('full_page_slider_title_line_1'); ?>
            <br/><?php the_field('full_page_slider_title_line_2'); ?></h1>
        </div>

        <?php if ( have_rows('full_page_slider') ):   ?>
            <div id="home-carousel" class="owl-carousel home-carousel">
            <?php  while ( have_rows('full_page_slider') ) : the_row(); 
                    $image = get_sub_field('image');
            ?>
                <div class="home-carousel__item" style="background-image: url(<?php echo $image['url']; ?>);"></div>
            <?php endwhile; ?>
            </div>
        <?php endif; ?>

        <a href="#main" class="glyphicon glyphicon-menu-down scroll-down"></a>

    </header>
    <main id="main">