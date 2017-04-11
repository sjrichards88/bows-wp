<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title><?php wp_title( '&ndash;', true, 'right' ); ?></title>
    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0">
    <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">

    <!-- Bootstrap -->
    <link href='http://fonts.googleapis.com/css?family=Cinzel|Ruthie|PT+Sans:300,400,700|Satisfy:300,400,700' rel='stylesheet'>

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
    
    <header class="header">

        <?php include(get_template_directory() . '/partials/navigation.php'); ?>
        
        <?php 
            $image = get_field('header_image');
            if ($image):
        ?>
        <img src="<?php echo $image['url']; ?>" alt="<?php echo $image['alt']; ?>">
        <?php endif; ?>

        <div class="container intro">
            <h1><?php the_title(); ?></h1>
        </div>

    </header>
    <main>