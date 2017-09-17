
var signup_button=document.getElementById("signup_button");
var login_button=document.getElementById("login_button");
var auth_token;
signup_button.onclick=function(){
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        if(request.readyState==XMLHttpRequest.DONE){
            if(request.status==200){
               var result= JSON.parse(request.response);
               if(result['statusCode']==409){
                console.log("User Already Exists");
                console.log(result['statusCode']);
               }
               else if(result['statusCode']==200){
                   console.log("user created");
                   console.log(result['body']['auth_token']);
                   auth_token=result['body']['auth_token'];
               }
               else{
                  console.log("Server Error!"); 
               }
            }
            else{
                console.log("Error!");
            }
        }
    };
    var name=document.getElementById("signup_name").value;
    var username=document.getElementById("signup_email").value;
    var password=document.getElementById("signup_password").value;
    request.open('POST','/signup',true);
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify({name:name,username:username,password:password}));
    //console.log(JSON.stringify({name:name,username:username,password:password}));
    
};
login_button.onclick=function login(){
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        if(request.readyState==XMLHttpRequest.DONE){
            if(request.status==200){
               var result= JSON.parse(request.response);
               if(result['statusCode']==409){
                console.log("User Already Exists");
                console.log(result['statusCode']);
               }
               else if(result['statusCode']==200){
                   console.log("user loged in");
                   console.log(result['body']['auth_token']);
                   auth_token=result['body']['auth_token'];
                   //window.location.href = "/home.html";

                   var request2=new XMLHttpRequest();
                   var val=true;
                   request2.open('GET','/home.html',true);
                   //request2.setRequestHeader('Content-Type','application/json');
                   //request2.responseType="document";
                   //request2.send(JSON.stringify({validate:val}));
                   request2.send();
                   request2.onreadystatechange=function(){
                        if(request.readyState==XMLHttpRequest.DONE){
                            if(request2.status==200){
                                var result2=request2.responseText;
                            }
                        }
                   };
               }
               else{
                  console.log("Server Error!"); 
               }
            }
            else{
                console.log("Error!");
            }
        }
    };
    var username=document.getElementById("login_email").value;
    var password=document.getElementById("login_password").value;
    request.open('POST','/login',true);
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify({username:username,password:password}));
    //console.log(JSON.stringify({name:name,username:username,password:password}));   
};
