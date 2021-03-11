<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

error_reporting(E_ALL);
ini_set('display_errors',true);


require 'vendor/autoload.php';
class Database{
  
    // specify your own database credentials
    private $host = "remotemysql.com";
    private $db_name = "pNute8ZGhP";
    private $username = "pNute8ZGhP";
    private $password = "zzuYKKIfPK";
   // public $conn;
  
    // get the database connection
    public function getConnection(){
  
        //$this->conn = null;
  
        try{
           $conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
           $conn->exec("set names utf8");
           return $conn;
        }catch(PDOException $exception){
            echo "Connection error: " . $exception->getMessage();
        }
  
        return $this->conn;
    }
    

    function sendMail($mail,$email,$subject,$body){
        try {
        $mail->addAddress($email);
        $mail->isHTML(true);         
        $mail->Subject = $subject;
        $mail->Body    = $body;
        $mail->send();
        //echo 'Message has been sent';
        } catch (Exception $e) {
        //echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        }
    }
}
$database = new Database();
$conn = $database->getConnection();

// Instantiation and passing `true` enables exceptions
$mail = new PHPMailer(true);
//Server settings
//$mail->SMTPDebug = SMTP::DEBUG_SERVER;    
$mail->SMTPDebug = 0;                   // Enable verbose debug output
$mail->isSMTP();                                            // Send using SMTP
$mail->Host       = 'smtp.gmail.com';                    // Set the SMTP server to send through
$mail->SMTPAuth   = true;                                   // Enable SMTP authentication
$mail->Username   = 'zohaiblogicps@gmail.com';                     // SMTP username
$mail->Password   = 'Zohaib261';                               // SMTP password
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
$mail->Port       = 587;  
$mail->SMTPOptions = array(
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    )
);
//Recipients
$mail->setFrom('zohaiblogicps@gmail.com', 'User Managment');
?>