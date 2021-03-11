<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json');

include_once 'connection.php';

$data = json_decode(file_get_contents("php://input"),true);
file_put_contents('log.log',"\n Hit ".date('Y-m-d H:i:s')." data ".json_encode($data)."\n",FILE_APPEND);
$type = $_REQUEST['type'];

if(!empty($type)){
   

    //*****************Reset Password Api**************** */
    if($type == 'resetPassword'){
        
        if(!empty($data['userid'])){
            // create the product
            $userID = $data['userid'];
            $user = $conn->query("SELECT  `UserID`,`FullName`,`Email` FROM user WHERE UserID = '$userID'");
            if($user->rowCount() > 0){
                    $user_detail = $user->fetch(PDO::FETCH_ASSOC);
                    $username = $user_detail['FullName'];
                    $user_email     = $user_detail['Email'];
                    $token = uniqid();
                    $enc_password = md5($token);
                    $conn->query("UPDATE user set Password = '$enc_password' WHERE UserID = '$userID'");
                    $subject = "Password Reset";
                    $body = "Dear $username,<br>Below is your new your Password.Please do not share with others.<br>New Password : <b>$token</b>";
                    $database->sendMail($mail,$user_email,$subject,$body);
                    echo json_encode(array("type"=>"success","message" => "New password sent to your email.Please check your email."));
            } else{
                echo json_encode(array("type"=>"error","message" => "Invalid User ID."));
            }
        }else{
            echo json_encode(array("type"=>"error","message" => "Unable to Process Request. Data is incomplete."));
        }
    }

    //*****************Reset Password Api End**************** */

    //*****************Reset UserID Api**************** */
    if($type == 'getUserID'){
        
        if(!empty($data['email'])){
            // create the product
            $email = $data['email'];
            $user = $conn->query("SELECT `UserID`,`FullName`,`Email` FROM user WHERE email = '$email'");
            if($user->rowCount() > 0){
                    $user_detail = $user->fetch(PDO::FETCH_ASSOC);
                    $username = $user_detail['FullName'];
                    $user_email     = $user_detail['Email'];
                    $UserID         = $user_detail['UserID'];
                    $subject = "UserID Request";
                    $body = "Dear $username,<br>Below is your new your UserID.Please do not share with others.<br>User ID is : <b>$UserID</b>";
                    $database->sendMail($mail,$user_email,$subject,$body);
                    echo json_encode(array("type"=>"success","message" => "UserID sent to your email.Please check your email."));
            } else{
                echo json_encode(array("type"=>"error","message" => "Invalid Email ."));
            }
        }else{
            echo json_encode(array("type"=>"error","message" => "Unable to Process Request. Data is incomplete."));
        }
    }

    //*****************Reset UserID Api End**************** */

    //*****************Login Api**************** */
    if($type == 'login'){
        
        if(!empty($data['userid']) && !empty($data['password']) ){
            // create the product
            $userID = $data['userid'];
            $paassword = md5($data['password']);
            $user = $conn->query("SELECT  `UserID`, `RoleID`, `ClientID`, `BranchID`, `Email`,  `FullName`, `JobTitle`, `UserActive`, `CreatedAt`, `ActivationStartDate`, `ActivationEndDate`, `AccoutType` FROM user WHERE UserID = '$userID' and Password = '$paassword'");
        
            if($user->rowCount() > 0){
                $user_detail = $user->fetch(PDO::FETCH_ASSOC);
                $user_id    = $user_detail['UserID'];
                $UserActive = $user_detail['UserActive'];
                $usernname  = $user_detail['FullName'];
                $user_email = $user_detail['Email'];
                if($UserActive == '1'){
                    $token = mt_rand(100000, 999999);
                    $conn->query("UPDATE user set LoginToken = '$token' WHERE UserID = '$user_id'");
                    $subject = "Login Token";
                    $body = "Dear $usernname,<br>Below is your security token.Please do not share with others.<br>Security token : <b>$token</b>";
                    $database->sendMail($mail,$user_email,$subject,$body);
                    echo json_encode(array("type"=>"success","message" => "Security token has sent to your email.Please check your email.","data"=>array("user_id"=>$user_id,"username" => $usernname,"isVerify"=>"0")));
                }else{
                    echo json_encode(array("type"=>"error","message" => "Your Account is not Active.Please contact to administrator"));
                }
                
            } else{
                echo json_encode(array("type"=>"error","message" => "Invalid User ID/Password."));
            }
        }else{
            echo json_encode(array("type"=>"error","message" => "Unable to Process Request. Data is incomplete."));
        }
    }

    //*****************Login Api End**************** */
    //*****************Login Verification Api**************** */
    if($type == 'loginVefiy'){
        
        if(!empty($data['userid']) && !empty($data['loginKey']) ){
            // create the product
            $userID     = $data['userid'];
            $loginKey   = $data['loginKey'];
            $user = $conn->query("SELECT  `UserID`, `RoleID`, `ClientID`, `BranchID`, `Email`,  `FullName`, `JobTitle`, `UserActive`, `CreatedAt`, `ActivationStartDate`, `ActivationEndDate`, `AccoutType` FROM user WHERE UserID = '$userID' and LoginToken = '$loginKey'");
        
            if($user->rowCount() > 0){
                $user_detail = $user->fetch(PDO::FETCH_ASSOC);
                $UserActive = $user_detail['UserActive'];
                $RoleID = $user_detail['RoleID'];
                $permissionQuery = $conn->query("SELECT  `PermissionButton` FROM `role` WHERE `RoleID` = '$RoleID'");
                $permission_detail = $permissionQuery->fetch(PDO::FETCH_ASSOC);
                if($UserActive == '1'){
                    $user_detail['isVerify'] = "1";
                    echo json_encode(array("type"=>"success","data"=>$user_detail,"permissions"=>$permission_detail['PermissionButton']));
                }else{
                    echo json_encode(array("type"=>"error","message" => "Your Account is not Active.Please contact to administrator"));
                }
                
            } else{
                echo json_encode(array("type"=>"error","message" => "Invalid Token.Please try again"));
            }
        }else{
            echo json_encode(array("type"=>"error","message" => "Unable to Process Request. Data is incomplete."));
        }
    }

    //*****************Login Api End**************** */

        //*****************clientData Api**************** */
        if($type == 'clientData'){

            $user = $conn->query("SELECT * FROM `client`");
        
            if($user->rowCount() > 0){
                $user_array = array();
                while($user_detail = $user->fetch(PDO::FETCH_ASSOC)){
                    $UserID = $user_detail['ClientID']; 
                    $ClientName = $user_detail['ClientName']; 
                    $CreatedAt = $user_detail['CreatedAt']; 
                    $Active = $user_detail['Active'];  
                    if($Active == '1'){
                            $status = 'Active';
                    }else{
                            $status = 'Inactive';
                    }
                    
                    array_push($user_array,array("UserID"=>$UserID,"FullName"=>$ClientName,"CreatedAt"=>$CreatedAt,"UserActive"=>$status,"Active"=>$Active));
                }
                echo json_encode($user_array);
                
            } else{
                $user_detail = array();
                echo json_encode(array());
            }
    }

    //*****************clientData Api End**************** */

     //*****************Add Cleint Api**************** */
     if($type == 'addClient'){

                $date       = date('d-m-Y');
                $name       = $data['name']; 
                $status     = $data['status'];
                $user = $conn->query("INSERT INTO `client`(`ClientName`, `Active`, `CreatedAt`) VALUES ('$name','$status','$date')");
                echo json_encode(array("type"=>"success","message" => "Client Added Successfully"));
    }

    //*****************Add Cleint Api End**************** */

    //*****************Delete Client Api**************** */
    if($type == 'deleteClient'){

        $user = $conn->query("DELETE FROM `client` WHERE `ClientID` = '".$_GET['id']."'");
    }

    //*****************Delete Client Api End**************** */

     //***************** Single Client Data Api*****************/
     if($type == 'singleClientData'){
        $user = $conn->query("SELECT `ClientID`, `ClientName`, `Active`, `CreatedAt` FROM `client` WHERE ClientID = '".$_GET['id']."'");
        if($user->rowCount() > 0){
            $user_array     = array();
            $user_detail    = $user->fetch(PDO::FETCH_ASSOC);
            $ClientID       = $user_detail['ClientID']; 
            $FullName       = $user_detail['ClientName']; 
            $CreatedAt      = $user_detail['CreatedAt']; 
            $UserActive     = $user_detail['Active']; 
            
            if($UserActive == '1'){
                $status = 'Active';
            }else{
                $status = 'Inactive';
            }
            array_push($user_array,array("UserID"=>$ClientID,"FullName"=>$FullName,"CreatedAt"=>$CreatedAt,"UserActive"=>$status,"status_code"=>$UserActive));
            echo json_encode($user_array);
            
        } else{
            $user_detail = array();
            echo json_encode(array("type"=>"error","message" => "No user found","data"=>$user_detail));
        }
    }

    //*****************Single Client Data Api End**************** */

            //*****************branchData Api**************** */
            if($type == 'branchData'){

                $user = $conn->query("SELECT * FROM `branch`");
            
                if($user->rowCount() > 0){
                    $user_array = array();
                    while($user_detail = $user->fetch(PDO::FETCH_ASSOC)){
                        $BranchID   = $user_detail['BranchID']; 
                        $ClientID   = $user_detail['ClientID']; 
                        $BranchName = $user_detail['BranchName'];
                        $state      = $user_detail['State']; 
                        $address1   = $user_detail['Address1']; 
                        $address2   = $user_detail['Address2']; 
                        $zip        = $user_detail['Zip']; 
                        $country    = $user_detail['Country']; 
                        $contact    = $user_detail['Contact']; 
                        $CreatedAt  = $user_detail['CreatedAt']; 
                        $Active     = $user_detail['Active'];  
                        if($Active == '1'){
                                $status = 'Active';
                        }else{
                                $status = 'Inactive';
                        }
                        
                        array_push($user_array,array("UserID"=>$BranchID,"FullName"=>$BranchName,"CreatedAt"=>$CreatedAt,"Address 1"=>$address1,"Address 2"=>$address2,"Zip 1"=>$zip,"State"=>$state,"Country"=>$country,"Contact"=>$contact,"UserActive"=>$status,"Active"=>$Active,"ClientID"=>$ClientID));
                    }
                    echo json_encode($user_array);
                    
                } else{
                    $user_detail = array();
                    echo json_encode(array());
                }
        }
    
        //*****************branchData Api End**************** */

        //*****************Add Branch Api**************** */
        if($type == 'addBranch'){

            $date       = date('d-m-Y');
            $name       = $data['name']; 
            $ClientID   = $data['client']; 
            $state      = $data['state']; 
            $address1   = $data['address1']; 
            $address2   = $data['address2']; 
            $zip        = $data['zip']; 
            $country    = $data['country']; 
            $contact    = $data['contact']; 
            $Active     = $data['status']; 
            $user = $conn->query("INSERT INTO `branch`(`ClientID`, `BranchName`, `Address1`, `Address2`, `State`, `Zip`, `Country`, `Contact`, `Active`, `CreatedAt`) VALUES ('$ClientID','$name','$address1','$address2','$state','$zip','$country','$contact','$Active','$date')");
            echo json_encode(array("type"=>"success","message" => "Client Added Successfully"));
        }

    //*****************Add Branch Api End**************** */

    //*****************Delete Branch Api**************** */
        if($type == 'deleteBranch'){

            $user = $conn->query("DELETE FROM `branch` WHERE `BranchID` = '".$_GET['id']."'");
        }

    //*****************Delete Branch Api End**************** */

    //*****************Update Branch Api**************** */
        if($type == 'updateBranch'){

            $date       = date('d-m-Y');
            $userID     = $data['user_id'];
            $name       = $data['name']; 
            $state      = $data['state']; 
            $address1   = $data['address1']; 
            $address2   = $data['address2']; 
            $zip        = $data['zip']; 
            $country    = $data['country']; 
            $contact    = $data['contact']; 
            $status     = $data['status'];
            $client     = $data['client'];
            $user = $conn->query("UPDATE `branch` SET  `ClientID` = '$client',`BranchName` = '$name', `Active` = '$status',`Address1`='$address1',`Address2`='$address2',`State`='$state',`Zip`='$zip',`Country`='$country',`Contact`='$contact' WHERE `BranchID` = '$userID'");
            echo json_encode(array("type"=>"success","message" => "Branch Updated Successfully"));
         }

    //*****************Update Branch Api End**************** */

      //***************** Single Branch Data Api*****************/
      if($type == 'singleBranchData'){
        $user = $conn->query("SELECT  `BranchID`, `Address1`, `Address2`, `State`, `Zip`, `Country`, `Contact`, `ClientID`, `BranchName`, `Active`, `CreatedAt` FROM `branch` WHERE BranchID = '".$_GET['id']."'");
        if($user->rowCount() > 0){
            $user_array     = array();
            $user_detail    = $user->fetch(PDO::FETCH_ASSOC);
            $BranchID       = $user_detail['BranchID']; 
            $ClientID       = $user_detail['ClientID']; 
            $FullName       = $user_detail['BranchName']; 
            $state          = $user_detail['State']; 
            $address1       = $user_detail['Address1']; 
            $address2       = $user_detail['Address2']; 
            $zip            = $user_detail['Zip']; 
            $country        = $user_detail['Country']; 
            $contact        = $user_detail['Contact'];
            $CreatedAt      = $user_detail['CreatedAt']; 
            $UserActive     = $user_detail['Active']; 
            
            if($UserActive == '1'){
                $status = 'Active';
            }else{
                $status = 'Inactive';
            }
            array_push($user_array,array("BranchID"=>$BranchID,"Address1"=>$address1,"Address2"=>$address2,"Zip"=>$zip,"State"=>$state,"Country"=>$country,"Contact"=>$contact,"ClientID"=>$ClientID,"FullName"=>$FullName,"CreatedAt"=>$CreatedAt,"UserActive"=>$status,"status_code"=>$UserActive));
            echo json_encode($user_array);
            
        } else{
            $user_detail = array();
            echo json_encode(array("type"=>"error","message" => "No user found","data"=>$user_detail));
        }
    }

    //*****************Single Branch Data Api End**************** */

        //*****************Update Client Api**************** */
        if($type == 'updateClient'){

                    $date       = date('d-m-Y');
                    $userID     = $data['user_id'];
                    $name       = $data['name']; 
                    $status     = $data['status'];
                    $user = $conn->query("UPDATE `client` SET  `ClientName` = '$name', `Active` = '$status' WHERE `ClientID` = '$userID'");
                    echo json_encode(array("type"=>"success","message" => "Client Updated Successfully"));
        }
    
    //*****************Update Client Api End**************** */

        //*****************UserData Api**************** */
        if($type == 'userData'){

                $user = $conn->query("SELECT `UserID`,`FullName`,`CreatedAt`, `RoleID`, `UserActive` FROM `user`");
            
                if($user->rowCount() > 0){
                    $user_array = array();
                    while($user_detail = $user->fetch(PDO::FETCH_ASSOC)){
                           $UserID = $user_detail['UserID']; 
                           $FullName = $user_detail['FullName']; 
                           $CreatedAt = $user_detail['CreatedAt']; 
                           $UserActive = $user_detail['UserActive']; 
                           $RoleID = $user_detail['RoleID']; 
                           if($UserActive == '1'){
                                $status = 'Active';
                           }else{
                                $status = 'Inactive';
                           }
                          
                           array_push($user_array,array("UserID"=>$UserID,"FullName"=>$FullName,"CreatedAt"=>$CreatedAt,"RoleID"=>$RoleID,"UserActive"=>$status));
                    }
                    echo json_encode($user_array);
                    
                } else{
                    $user_detail = array();
                    echo json_encode(array());
                }
        }
    
        //*****************UserData Api End**************** */

           //***************** Single UserData Api**************** */
           if($type == 'singleuserData'){
            $user = $conn->query("SELECT `UserID`, `RoleID`, `ClientID`, `BranchID`, `Email`, `Password`, `FullName`, `JobTitle`, `UserActive`, `ActivationStartDate`, `ActivationEndDate`,`CreatedAt`,`Password` FROM `user` WHERE UserID = '".$_GET['id']."' ");
        
            if($user->rowCount() > 0){
                $user_array = array();
                $user_detail = $user->fetch(PDO::FETCH_ASSOC);
                $UserID         = $user_detail['UserID']; 
                $FullName       = $user_detail['FullName']; 
                $CreatedAt      = $user_detail['CreatedAt']; 
                $UserActive     = $user_detail['UserActive']; 
                $RoleID         = $user_detail['RoleID']; 
                $ClientID       = $user_detail['ClientID']; 
                $BranchID       = $user_detail['BranchID']; 
                $Email          = $user_detail['Email']; 
                $JobTitle       = $user_detail['JobTitle']; 
                $Password       = $user_detail['Password']; 
                $ActivationStartDate = $user_detail['ActivationStartDate']; 
                $ActivationEndDate = $user_detail['ActivationEndDate']; 
                $Password = $user_detail['Password']; 
                if($UserActive == '1'){
                    $status = 'Active';
                }else{
                    $status = 'Inactive';
                }
                array_push($user_array,array("UserID"=>$UserID,"FullName"=>$FullName,"CreatedAt"=>$CreatedAt,"RoleID"=>$RoleID,"UserActive"=>$status,"status_code"=>$UserActive,"ClientID"=>$ClientID,"BranchID"=>$BranchID,"Email"=>$Email,"Contact Number"=>$JobTitle,"ActivationStartDate"=>$ActivationStartDate,"ActivationEndDate"=>$ActivationEndDate,"password"=>$Password));
                echo json_encode($user_array);
                
            } else{
                $user_detail = array();
                echo json_encode(array("type"=>"error","message" => "No user found","data"=>$user_detail));
            }
    }

    //*****************Single UserData Api End**************** */

         //*****************UserData Api**************** */
         if($type == 'userNextID'){

                $user = $conn->query("SELECT `UserID` FROM `user` order by id DESC limit 1");
            
                if($user->rowCount() > 0){
                    $user_detail = $user->fetch(PDO::FETCH_ASSOC);
                    $user_id = $user_detail['UserID'];
                    $newUserid = (int) $user_id + 1;
                    $new_id = sprintf('%08d',$newUserid);
                    echo json_encode(array($new_id));
                    
                } else{
                    $user_detail = array();
                    echo json_encode(array("00000001"));
                }
            }

    //*****************UserData Api End**************** */

     //*****************Delete User Api**************** */
        if($type == 'deleteUser'){

           $user = $conn->query("DELETE FROM `user` WHERE `UserID` = '".$_GET['id']."'");
          // echo "DELETE FROM `user` WHERE `UserID` = '".$_GET['id']."'";
        }

    //*****************UserData Api End**************** */

     //*****************Add User Api**************** */
        if($type == 'addUser'){

            $user = $conn->query("SELECT `Email` FROM `user` WHERE Email = '".$data['email']."'");
            
                if($user->rowCount() > 0){
                    echo json_encode(array("type"=>"error","message" => "Email already exist.Please change email"));
                    
                } else{
                    $date       = date('d-m-Y');
                    $userID     = $data['user_id'];
                    $name       = $data['name']; 
                    $email      = $data['email']; 
                    $password   = md5($data['password']);
                    $job_title  = $data['job_title'];
                    $start_date = $data['start_date'];
                    $end_date   = $data['end_date'];
                    $role       = $data['role'];
                    $branch     = $data['branch'];
                    $client     = $data['client'];
                    $status     = $data['status'];
                    $user = $conn->query("INSERT INTO `user`(`UserID`, `RoleID`, `ClientID`, `BranchID`, `Email`, `Password`, `FullName`, `JobTitle`, `UserActive`, `CreatedAt`, `ActivationStartDate`, `ActivationEndDate`, `AccoutType`) VALUES ('$userID','$role','$client','$branch','$email','$password','$name','$job_title','$status','$date','$start_date','$end_date','0')");
                    echo json_encode(array("type"=>"success","message" => "User Added Successfully"));
                    
                }
        }

    //*****************Add User Api End**************** */
    //*****************Update User Api**************** */
    if($type == 'updateUser'){

        $user = $conn->query("SELECT `Password` FROM `user` WHERE UserID = '".$data['user_id']."'");
        
            if($user->rowCount() > 0){
                $user_detail = $user->fetch(PDO::FETCH_ASSOC);
                $user_password = $user_detail['Password'];
                $date       = date('d-m-Y');
                $userID     = $data['user_id'];
                $name       = $data['name']; 
                $email      = $data['email']; 
                $password   = $data['password'];
               if($password != $user_password){
                    $password = md5($data['password']);
               }
                $job_title  = $data['job_title'];
                $start_date = $data['start_date'];
                $end_date   = $data['end_date'];
                $role       = $data['role'];
                $branch     = $data['branch'];
                $client     = $data['client'];
                $status     = $data['status'];
                $user = $conn->query("UPDATE `user` SET `RoleID` = '$role', `ClientID` = '$client' ,`BranchID` = '$branch', `Email`= '$email', `Password` = '$password', `FullName` = '$name', `JobTitle` = '$job_title', `UserActive` = '$status', `ActivationStartDate` = '$start_date', `ActivationEndDate` = '$end_date' WHERE `UserID` = '$userID'");

                echo json_encode(array("type"=>"success","message" => "User Updated Successfully"));
                
            }
            
    }

        //*****************Update User Api End**************** */

             //*****************roleData Api**************** */
             if($type == 'roleData'){

                $user = $conn->query("SELECT * FROM `role`");
            
                if($user->rowCount() > 0){
                    $user_array = array();
                    while($user_detail = $user->fetch(PDO::FETCH_ASSOC)){
                        $BranchID   = $user_detail['BranchID']; 
                        $ClientID   = $user_detail['ClientID']; 
                        $RoleName   = $user_detail['RoleName']; 
                        $CreatedAt  = $user_detail['CreatedDate']; 
                        $Active     = $user_detail['Active'];  
                        $PermissionButton = $user_detail['PermissionButton'];  
                        $PermissionPages = $user_detail['PermissionPages'];  
                        $RoleID = $user_detail['RoleID'];  
                        if($Active == '1'){
                                $status = 'Active';
                        }else{
                                $status = 'Inactive';
                        }
                        
                        array_push($user_array,array("UserID"=>$RoleID,"BranchID"=>$BranchID,"FullName"=>$RoleName,"CreatedAt"=>$CreatedAt,"UserActive"=>$status,"Active"=>$Active,"ClientID"=>$ClientID,"PermissionButton"=>$PermissionButton,"PermissionPages"=>$PermissionPages));
                    }
                    echo json_encode($user_array);
                    
                } else{
                    $user_detail = array();
                    echo json_encode(array());
                }
        }
    
        //*****************roleData Api End**************** */

          //*****************roleNextID Api**************** */
          if($type == 'roleNextID'){

            $user = $conn->query("SELECT `RoleID` FROM `role` order by id DESC limit 1");
        
            if($user->rowCount() > 0){
                $user_detail = $user->fetch(PDO::FETCH_ASSOC);
                $user_id = $user_detail['RoleID'];
                $newUserid = (int) $user_id + 1;
                $new_id = sprintf('%08d',$newUserid);
                echo json_encode(array($new_id));
                
            } else{
                $user_detail = array();
                echo json_encode(array("00000001"));
            }
        }

//*****************roleNextID Api End**************** */

        //*****************Add Role Api**************** */
        if($type == 'addRole'){

            $date       = date('d-m-Y');
            $RoleID     = $data['user_id']; 
            $name       = $data['name']; 
            $ClientID   = $data['client']; 
            $Active     = $data['status']; 
            $permission = $data['permission']; 
            $branch     = $data['branch']; 
            $Active     = $data['status']; 
            $permission = implode(',',$permission);
            $user = $conn->query("INSERT INTO `role`(`RoleID`, `ClientID`, `BranchID`, `RoleName`, `Active`, `CreatedDate`, `PermissionButton`, `PermissionPages`) VALUES ('$RoleID','$ClientID','$branch','$name','$Active','$date','$permission','$permission')");
            echo json_encode(array("type"=>"success","message" => "Branch Added Successfully"));
        }

    //*****************Add Role Api End**************** */

    //*****************Delete Branch Api**************** */
        if($type == 'deleteRole'){

            $user = $conn->query("DELETE FROM `role` WHERE `RoleID` = '".$_GET['id']."'");
        }

    //*****************Delete Branch Api End**************** */

    //*****************Update Branch Api**************** */
        if($type == 'updateRole'){

            $date       = date('d-m-Y');
            $userID     = $data['user_id'];
            $name       = $data['name']; 
            $status     = $data['status'];
            $client     = $data['client'];
            $branch     = $data['branch'];
            $permission = $data['permission'];
            $imploded_permissions = implode(',',$permission);
            $user = $conn->query("UPDATE `role` SET `ClientID`='$client',`BranchID`='$branch',`RoleName`='$name',`Active`='$status',`PermissionButton`='$imploded_permissions',`PermissionPages`='$imploded_permissions'  WHERE `RoleID` = '$userID'");
            echo json_encode(array("type"=>"success","message" => "Role Updated Successfully"));
         }

    //*****************Update Role Api End**************** */

      //***************** Single Role Data Api*****************/
      if($type == 'singleRoleData'){
        $user = $conn->query("SELECT `RoleID`, `ClientID`, `BranchID`, `RoleName`, `Active`, `CreatedDate`, `PermissionButton`, `PermissionPages` FROM `role` WHERE RoleID = '".$_GET['id']."'");
        if($user->rowCount() > 0){
            $user_array     = array();
            $user_detail    = $user->fetch(PDO::FETCH_ASSOC);
            $BranchID       = $user_detail['BranchID']; 
            $ClientID       = $user_detail['ClientID']; 
            $FullName       = $user_detail['RoleName']; 
            $CreatedAt      = $user_detail['CreatedDate']; 
            $UserActive     = $user_detail['Active']; 
            $PermissionButton     = $user_detail['PermissionButton']; 
            $PermissionPages     = $user_detail['PermissionPages']; 
            
            if($UserActive == '1'){
                $status = 'Active';
            }else{
                $status = 'Inactive';
            }
            array_push($user_array,array("BranchID"=>$BranchID,"ClientID"=>$ClientID,"FullName"=>$FullName,"CreatedAt"=>$CreatedAt,"UserActive"=>$status,"status_code"=>$UserActive,"PermissionPages"=>$PermissionPages,"PermissionButton"=>$PermissionButton));
            echo json_encode($user_array);
            
        } else{
            $user_detail = array();
            echo json_encode(array("type"=>"error","message" => "No user found","data"=>$user_detail));
        }
    }

    //*****************Single Branch Data Api End**************** */

}  
