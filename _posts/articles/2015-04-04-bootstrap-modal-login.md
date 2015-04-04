---
layout: post
title: Bootstrap Login
excerpt: Bootstrap popup window Login and custom validation

categories: articles
tags: [web design, code, GUI, HTML5, Bootstrap, JavaScript]
image:
  feature: 14684795513_3605513909_o.jpg
  credit: GuoJunjun
  creditlink: http://junjunguo.com
comments: true
share: true
---

# Contents
{:.no_toc}

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# About
This example use Bootstrap framework to build a responsive Login. 

- use Bootstraps modal to build a dialog window (popup window for login).
- use html5 `required` to show error message
- use JavaScript to custom input icon(Bootstrap: forms-control-validation).

## screen captures

![screen captures](https://raw.githubusercontent.com/junjunguo/webDevelopment/master/responsiveDesign/images/bootstraplogin1.png)
![screen captures](https://raw.githubusercontent
.com/junjunguo/webDevelopment/master/responsiveDesign/images/bootstraplogin2.png)
![screen captures](https://raw.githubusercontent
.com/junjunguo/webDevelopment/master/responsiveDesign/images/bootstraplogin3.png)
![screen captures](https://raw.githubusercontent
.com/junjunguo/webDevelopment/master/responsiveDesign/images/bootstraplogin4.png)
![screen captures](https://raw.githubusercontent
.com/junjunguo/webDevelopment/master/responsiveDesign/images/bootstraplogin5.png)
![screen captures](https://raw.githubusercontent
.com/junjunguo/webDevelopment/master/responsiveDesign/images/bootstraplogin6.png)

# Demonstration
[Demonstration](http://junjunguo.com/webDevelopment/bootstrapslogin.html) 

- will open in a new window.


# head
import bootstrap css and js
import jquery js

{% highlight html %}
<!-- stylesheet -->
<link rel="stylesheet" href="css/bootstrap.min.css">

<!-- scripts-->
<script src="js/jquery-1.11.2.min.js"></script>
<script src="js/bootstrap.js"></script>
{% endhighlight %}

# css
define css
{% highlight css %}
<style>
    .form-signin {
        max-width : 330px;
        padding   : 15px;
        margin    : 0 auto;
        }

    .form-signin, .form-signin {
        margin-bottom : 10px;
        }

    #inputPassword, #inputEmail, #loginSubmit {
        margin : 10px 0;
        }
</style>
{% endhighlight %}

# body

## start button
to start the loginModal
{% highlight html %}
<p class="text-center">
    <button class="btn btn-default" data-toggle="modal"
            data-target="#loginModal">Login
    </button>
</p>
{% endhighlight %}

## login modal
login window layout:

- `required` to validate input.
    - `oninvalid="this.setCustomValidity('Please fill out your Email')"` to 
customize invalid information.
    - `oninput="setCustomValidity('')"` clear the previous information.

{% highlight html %}
<div id="loginModal" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"
                        aria-hidden="true">&times;</button>
                <h4 class="modal-title form-signin-heading">Please Login</h4>
            </div>
            <div class="modal-body">
                <form id="loginForm" class="form-signin" data-toggle="validator"
                      role="form">
                    <div id="form-group-email">
                        <label for="inputEmail" class="sr-only">Email
                                                                address</label>
                        <input type="email" id="inputEmail" class="form-control"
                               placeholder="Email address" required
                               oninvalid="this.setCustomValidity('Please fill out your Email')"
                               oninput="setCustomValidity('')"
                               autofocus>
                        <span id="form-span-email" aria-hidden="true"></span>
                    </div>
                    <div id="form-group-password">
                        <label for="inputPassword"
                               class="sr-only">Password</label>
                        <input type="password" id="inputPassword"
                               class="form-control" placeholder="Password"
                               required
                               oninvalid="this.setCustomValidity('Please fill out your Password')"
                               oninput="setCustomValidity('')">
                        <span id="form-span-password" aria-hidden="true"></span>
                    </div>
                    <button id="loginSubmit"
                            class="btn btn-lg btn-primary btn-block"
                            type="submit">Login
                    </button>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default btn-lg"
                        data-dismiss="modal">Close
                </button>
            </div>
        </div>
    </div>
</div>
{% endhighlight %}

## welcome back modal
Show welcome back information on top of login modal
{% highlight html %}
<div class="modal fade" id="welcome-back" tabindex="-1" role="dialog"
     aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <a type="button" class="close hide-t-c" aria-hidden="true">×</a>
                <h4 class="modal-title">Welcome Back</h4>
            </div>
            <div class="modal-body">
                <p>Welcome back</p>
                <h4 id="welcome-back-user"></h4>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default btn-lg"
                        data-dismiss="modal">Close
                </button>
            </div>
        </div>
    </div>
</div>
{% endhighlight %}

# Javascript
- assume that `a@a.com` and password `00` is the valid user
    - in practice this will be replaced by check to a server or database if 
    the email and password is correct.
    
- use `event.preventDefault()` to keep a Modal Window open after form submission
- change `has-feedback`, `has-success`, `has-error` and add responsive icon 
dynamically according to input.

{% highlight js %}
var form = document.getElementsByTagName('form')[0];
var email = document.getElementById('inputEmail');
var password = document.getElementById('inputPassword');


email.addEventListener("keyup", function (event) {
    if (email.validity.valid) {
        var inputEmail = $("input#inputEmail").val();
        //check server if the email exist
        if (inputEmail == "a@a.com") {
            document.getElementById('form-group-email').className =
                    "form-group has-success has-feedback";
            document.getElementById('form-span-email').className =
                    "glyphicon glyphicon-ok form-control-feedback";
        } else {
            document.getElementById('form-group-email').className =
                    "form-group has-error has-feedback";
            document.getElementById('form-span-email').className =
                    "glyphicon glyphicon-remove form-control-feedback";
        }
    }
}, false);

password.addEventListener("keyup", function (event) {
    //init
    document.getElementById('form-group-password').className = "";
    document.getElementById('form-span-password').className = "";

    if (password.validity.valid) {
        var inputPassword = $("input#inputPassword").val();
        //check server if password correct
        if (inputPassword == "00") {
            document.getElementById('form-group-password').className =
                    "form-group has-success has-feedback";
            document.getElementById('form-span-password').className =
                    "glyphicon glyphicon-ok form-control-feedback";
        } else {
            document.getElementById('form-group-password').className =
                    "form-group has-error has-feedback";
            document.getElementById('form-span-password').className =
                    "glyphicon glyphicon-remove form-control-feedback";
        }
    }
}, false);


form.addEventListener("submit", function (event) {
    event.preventDefault(); // keep modal window open
    var inputPassword = $("input#inputPassword").val();
    var inputEmail = $("input#inputEmail").val();
    if (inputEmail == "a@a.com" & inputPassword == "00") {
        //login succeed:
        $('#welcome-back').modal('show');
        //                welcome info
        document.getElementById("welcome-back-user").innerHTML =
                "get user name from server and shows here";
        ;
        setTimeout(
                function () {
                    $('#welcome-back').modal('hide');
                    $('#loginModal').modal('hide');
                }, 2000);
    }
}, false);
{% endhighlight %}

# References:

- http://getbootstrap.com/javascript/#modals
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
- http://getbootstrap.com/css/#forms
- http://getbootstrap.com/css/#forms-control-validation
- https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Data_form_validation


