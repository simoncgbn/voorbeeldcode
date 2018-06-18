<?php

    if ($_SERVER["REQUEST_METHOD"] == "POST") {

        $name = strip_tags(trim($_POST["name"]));
				$name = str_replace(array("\r","\n"),array(" "," "),$name);
        $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
        $message = trim($_POST["message"]);


        if ( empty($name) OR empty($message) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            // Set a 400 (bad request) response code and exit.
            http_response_code(400);
            echo "Oeps! Er is iets misgegaan bij het versturen. Probeer het opnieuw.";
            exit;
        }



        $recipient = "simoncgbn@hotmail.com";


        $subject = "Niew contactformulier $name";


        $email_content = "Name: $name\n";
        $email_content .= "Email: $email\n\n";
        $email_content .= "Message:\n$message\n";


        $email_headers = "From: $name <$email>";


        if (mail($recipient, $subject, $email_content, $email_headers)) {

            http_response_code(200);
            echo "Bedankt! Uw boodschap is verzonden.";
        } else {

            http_response_code(500);
            echo "Oeps! Er is iets misgegaan en we konden uw boodschap niet versturen.";
        }

    } else {

        http_response_code(403);
        echo "Er was een probleem bij het versturen. Probeer het opnieuw.";
    }

?>
