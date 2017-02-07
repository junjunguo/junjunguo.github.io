---
layout: post
title: Bootstrap Register with Bootstrap Modals
excerpt: Bootstrap popup windows for Register and custom validation

categories: blog
tags: [web design, code, GUI, HTML5, Bootstrap, JavaScript]
image:
  feature: 14830590633_2b15ef306b_o.jpg
  credit: GuoJunjun
  creditlink: https://junjunguo.github.io
comments: true
share: true
---

# Contents
{:.no_toc}

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

# About
This example use Bootstrap framework to build a responsive Register dialog window. 

- use Bootstraps modal to build multiple dialog windows (popup windows).
    - how to close a popup window on top of another popup window with out 
    close its parent popup window.
- use html5 `required` to show validation message
    - override default validation message
        - and dynamically change validation message
    - add text in addition to validation message (which will also show when mouse over and stay)
        - and dynamically change `title` text
- use JavaScript to dynamically add custom input icon(Bootstrap: forms-control-validation):
    - error icon
    - succeed icon
    - warning icon

# screen captures followed by tips and tricks

####1

- Html5 default validation message with tips information 
    - and custom text
- Bootstrap succeed icon + green border
- Bootstrap error icon  + read border

![screen captures](https://raw.githubusercontent.com/junjunguo/webDevelopment/master/responsiveDesign/images/bootstrapregister1.png)

Use Javascript to dynamically change between:

- Bootstrap succeed icon + green border
- Bootstrap error icon  + read border

{% highlight javascript %} 
if (firstname.validity.valid) {
            document.getElementById('form-group-first-name').className =
                "form-group has-success has-feedback";
            document.getElementById('form-span-first-name').className =
                "glyphicon glyphicon-ok form-control-feedback";
        } else {
            document.getElementById('form-group-first-name').className =
                "form-group has-error has-feedback";
            document.getElementById('form-span-first-name').className =
                "glyphicon glyphicon-remove form-control-feedback";
        }
{% endhighlight %}

####2

- Bootstrap warning icon + yellow border
    - custom text
    - custom validation message

![screen captures](https://raw.githubusercontent.com/junjunguo/webDevelopment/master/responsiveDesign/images/bootstrapregister0.png)

- Dynamically change text information by change `title`.
- Dynamically change custom validation by set custom validity

{% highlight javascript %}
document.getElementById('inputEmail').title = inputemail + " is already registered!";
document.getElementById('inputEmail').setCustomValidity(inputemail + " is already registered!");
{% endhighlight %}

####3
Custom text in addition to default validation message:

![screen captures](https://raw.githubusercontent.com/junjunguo/webDevelopment/master/responsiveDesign/images/bootstrapregister2.png)

- use `pattern` to limit input
    - `pattern=".{minimum-number,maximum-number}"`
- tag that this field of input is `required`
- add custom text to `title`
    - this will show when mouse over the input field
    - and will be added in addition to validation message

{% highlight html %}
<input ... pattern=".{4,}" required title="password too short !">
{% endhighlight %}

####4
Custom validation message (override the default):

![screen captures](https://raw.githubusercontent.com/junjunguo/webDevelopment/master/responsiveDesign/images/bootstrapregister3.png)

- add `oninvalid` to input for set custom validation message
- and clean the message when the input changes by change `oninput`

{% highlight html %}
<input ... oninvalid="this.setCustomValidity('Your custom message her!')"
           oninput="setCustomValidity('')" ...>
{% endhighlight %}


####5
Bootstrap responsive window size narrow:

![screen captures](https://raw.githubusercontent.com/junjunguo/webDevelopment/master/responsiveDesign/images/bootstrapregister4.png)

Bootstrap divide window to 12 grids

- here when it is `col-sm-6 col-md-6` 
    - small window (narrow) or medium window 
        - each column will take half of it parent size (6 of 12)
- when extra small window (narrower) 
    - the column will take all its parent size (12 of 12)
    - see next screen capture with narrower window
        
`<div class="col-xs-12 col-sm-6 col-md-6">`

####6
Bootstrap responsive window size narrower:

![screen captures](https://raw.githubusercontent.com/junjunguo/webDevelopment/master/responsiveDesign/images/bootstrapregister5.png)

####7
Terms and Conditions modal on top of register modal:

![screen captures](https://raw.githubusercontent.com/junjunguo/webDevelopment/master/responsiveDesign/images/bootstrapregister6.png)

How to close the on top modal only ?

- only close the on top modal when close is clicked.

By default when the on top modal `close` is triggered the parent modal will be closed as well.
Most of the time we only want to close the window (modal) we clicked at.

By doing so, my solution is control modal show and hide in Javascript:

- When register button is clicked we open `#registerModal` by `modal('show')`.
   - when open child is called we open child modal by `modal('show')` 
        - when close child button is clicked we close it with `modal('hide')`
        - see code bellow: 
        
{% highlight javascript %}
$('#registerModal').modal('show');
$('#btn-t-c').click(function () {
    $('#t_and_c_m').modal('show');
    $('.hide-t-c').click(function () {
        $('#t_and_c_m').modal('hide');
    });
});
{% endhighlight %}

####8
Congratulations modal on top of register modal:

![screen captures](https://raw.githubusercontent.com/junjunguo/webDevelopment/master/responsiveDesign/images/bootstrapregister1.png)

Close all window after 4 seconds:

{% highlight javascript %}
setTimeout( 
    function () {
        $('#registerModal').modal('hide');
        $('#register-succeed').modal('hide');
    }, 4000);
{% endhighlight %}    

# Demonstration
[Demonstration](https://junjunguo.github.io/webDevelopment/bootstrapregister) 

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



# body

## start button
to start the loginModal
{% highlight html %}
<p class="text-center">
    <button id="nav-register" role="button" class="btn-lg">register
    </button>
</p>
{% endhighlight %}

## register modal
register window layout:

{% highlight html %}
<div class="modal-dialog modal-lg">
    <div class="row modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title form-signin-heading">Please Sign Up</h4>
        </div>
        <div class="col-xs-12 col-sm-8 col-md-6 col-sm-offset-2 col-md-offset-3">
            <form role="form" id="registerForm">
                <!--<hr class="colorgraph">-->
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-6">
                        <div id="form-group-first-name">
                            <input type="text" id="inputFirstName" class="form-control input-lg"
                                   placeholder="First Name" tabindex="1" autofocus pattern=".{2,16}" required
                                   title="2 to 12 characters">
                            <span id="form-span-first-name" aria-hidden="true"></span>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-6">
                        <div id="form-group-last-name">
                            <input type="text" id="inputLastName" class="form-control input-lg"
                                   placeholder="Last Name" tabindex="2" pattern=".{2,12}" required
                                   title="2 to 16 characters">
                            <span id="form-span-last-name" aria-hidden="true"></span>

                        </div>
                    </div>
                </div>
                <!--<div class="form-group">-->
                <!--<input type="text"  id="display_name" class="form-control input-lg"-->
                <!--placeholder="Display Name" tabindex="3">-->
                <!--</div>-->
                <div id="form-group-email">
                    <input type="email" id="inputEmail" class="form-control input-lg"
                           placeholder="Email Address" tabindex="4" required>
                    <span id="form-span-email" aria-hidden="true"></span>

                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-6">
                        <div id="form-group-password">
                            <input type="password" id="inputPassword" class="form-control input-lg"
                                   placeholder="Password" tabindex="5" pattern=".{4,}" required
                                   title="password too short !">
                            <span id="form-span-password" aria-hidden="true"></span>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-6">
                        <div id="form-group-password-confirm">
                            <input type="password" id="inputPasswordConfirm"
                                   class="form-control input-lg" placeholder="Confirm Password"
                                   tabindex="6" required>
                            <span id="form-span-password-confirm" aria-hidden="true"></span>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12">
                        By clicking <strong class="label label-primary">Register</strong>, you agree to the
                        <a href="#" id="btn-t-c">Terms and Conditions</a>
                        set out by this site.
                    </div>
                </div>

                <!--<hr class="colorgraph">-->
                <div class="row">
                    <div class="col-xs-12 col-md-8">
                        <input type="submit" value="Register" class="btn btn-primary btn-block btn-lg"
                               tabindex="7" id="registerSubmit">
                    </div>
                    <div class="col-xs-12 col-md-4">
                        <button type="button" class="btn btn-default btn-block btn-lg" data-dismiss="modal">Close
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
{% endhighlight %}

## Terms and conditions modal
Show Terms and conditions information on top of register modal
{% highlight html %}
<div class="modal fade" id="t_and_c_m" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
     aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <a type="button" class="close hide-t-c" aria-hidden="true">×</a>
                <h4 class="modal-title" id="myModalLabel">Terms & Conditions</h4>
            </div>
            <div class="modal-body">
                <p>Bootstrap is a free and open-source collection of tools for creating websites and web
                   applications. It contains HTML- and CSS-based design templates for typography, forms, buttons,
                   navigation and other interface components, as well as optional JavaScript extensions. As of March
                   2015, it was the most-starred project on GitHub.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary hide-t-c" aria-hidden="true">I Agree</button>
            </div>
        </div>
    </div>
</div>
{% endhighlight %}

## Register succeed modal
Show register succeed information on top of register modal
{% highlight html %}
<div class="modal fade" id="register-succeed" tabindex="-1" role="dialog"
     aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <a type="button" class="close hide-t-c" aria-hidden="true">×</a>
                <h4 class="modal-title">Register succeed</h4>
            </div>
            <div class="modal-body">
                <p>Congratulations: </p>
                <h4 id="congratulations-user"></h4>

                <p>you are successfully registered</p>

                <h5>Please go to login menu and login!</h5>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default btn-lg"
                        data-dismiss="modal">Close
                </button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>
{% endhighlight %}

# Javascript
- assume that `a@a.com` is already registered
    - in practice this will be replaced by check to a server or database if 
    the email is already registered.
    
- use `event.preventDefault()` to keep a Modal Window open after form submission
- change `has-feedback`, `has-success`, `has-error` and add responsive icon 
dynamically according to input.

{% highlight javascript %}

$('#nav-register').click(function () {
    $('#registerModal').modal('show');
    $('#btn-t-c').click(function () {
        $('#t_and_c_m').modal('show');
        $('.hide-t-c').click(function () {
            $('#t_and_c_m').modal('hide');
        });
    });
    registerValidate();
});

/**
 * validate register information
 */
function registerValidate() {
    var form = document.getElementById('registerForm');
    validateFirstName();
    validateLastName();
    validateEmail();
    validatePassword();
    validateConfirmPassword();
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // keep modal window open
        // if form is valid
        if (form.checkValidity()) {
            var firstname = $("input#inputFirstName").val();
            var lastname = $("input#inputLastName").val();
            var email = $("input#inputEmail").val();
            var password = $("input#inputPassword").val();

            if (registerAuser(firstname, lastname, email, password)) {
                // register succeed:
                $('#register-succeed').modal('show');
                document.getElementById("congratulations-user").innerHTML =
                    firstname;
                setTimeout(
                    function () {
                        $('#registerModal').modal('hide');
                        $('#register-succeed').modal('hide');
                    }, 4000);
            } else {
                // register not succeed
            }
        }
    }, false);
}
/**
 * register
 * validate: first name
 */
function validateFirstName() {
    var firstname = document.getElementById('inputFirstName');
    firstname.addEventListener("keyup", function (event) {
        if (firstname.validity.valid) {
            document.getElementById('form-group-first-name').className =
                "form-group has-success has-feedback";
            document.getElementById('form-span-first-name').className =
                "glyphicon glyphicon-ok form-control-feedback";
        } else {
            document.getElementById('form-group-first-name').className =
                "form-group has-error has-feedback";
            document.getElementById('form-span-first-name').className =
                "glyphicon glyphicon-remove form-control-feedback";
        }
    }, false);
}

/**
 * register
 * validate: last name
 */
function validateLastName() {
    var lastname = document.getElementById('inputLastName');
    lastname.addEventListener("keyup", function (event) {
        if (lastname.validity.valid) {
            document.getElementById('form-group-last-name').className =
                "form-group has-success has-feedback";
            document.getElementById('form-span-last-name').className =
                "glyphicon glyphicon-ok form-control-feedback";
        } else {
            document.getElementById('form-group-last-name').className =
                "form-group has-error has-feedback";
            document.getElementById('form-span-last-name').className =
                "glyphicon glyphicon-remove form-control-feedback";
        }
    }, false);
}

/**
 * register
 * validate: email
 */
function validateEmail() {
    var email = document.getElementById('inputEmail');
    email.addEventListener("keyup", function (event) {
        document.getElementById('inputEmail').title = "Email address";
        document.getElementById('inputEmail').setCustomValidity('');
        if (email.validity.valid) {
            var inputemail = $("input#inputEmail").val();
            if (unregisteredEmail(inputemail)) {
                document.getElementById('form-group-email').className =
                    "form-group has-success has-feedback";
                document.getElementById('form-span-email').className =
                    "glyphicon glyphicon-ok form-control-feedback";
            } else {
                document.getElementById('form-group-email').className =
                    "form-group has-warning has-feedback";
                document.getElementById('form-span-email').className =
                    "glyphicon glyphicon-warning-sign form-control-feedback";
                document.getElementById('inputEmail').title =
                    inputemail + " is already registered!";
                document.getElementById('inputEmail').setCustomValidity(inputemail +
                " is already registered !");
            }
        } else {
            document.getElementById('form-group-email').className =
                "form-group has-error has-feedback";
            document.getElementById('form-span-email').className =
                "glyphicon glyphicon-remove form-control-feedback";
        }
    }, false);
}

/**
 * register
 * validate: password
 */
function validatePassword() {
    var inputpassword = document.getElementById('inputPassword');
    inputpassword.addEventListener("keyup", function (event) {
        var password = $("input#inputPassword").val();
        var passwordcf = $("input#inputPasswordConfirm").val();
        document.getElementById('inputPasswordConfirm').setCustomValidity('');
        if (inputpassword.validity.valid) {
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
        // check confirm password in case password is modified after confirm
        // password
        validateConfirmPasswordIn();
    }, false);
}

/**
 * register
 * validate: password confirmation listener
 */
function validateConfirmPassword() {
    var passwordconfirm = document.getElementById('inputPasswordConfirm');
    passwordconfirm.addEventListener("keyup", function (event) {
        validateConfirmPasswordIn();
    }, false);
}
/**
 * only do the confirm password validate
 */
function validateConfirmPasswordIn() {
    var password = $("input#inputPassword").val();
    var passwordcf = $("input#inputPasswordConfirm").val();
    document.getElementById('inputPasswordConfirm').setCustomValidity('');
    if (passwordcf == password) {
        document.getElementById('form-group-password-confirm').className =
            "form-group has-success has-feedback";
        document.getElementById('form-span-password-confirm').className =
            "glyphicon glyphicon-ok form-control-feedback";
    } else {
        document.getElementById('form-group-password-confirm').className =
            "form-group has-error has-feedback";
        document.getElementById('form-span-password-confirm').className =
            "glyphicon glyphicon-remove form-control-feedback";
        document.getElementById('inputPasswordConfirm').setCustomValidity("The password you typed in are not same!");
    }
}

/**
 * Tell the server to register the given user
 * @param firstname
 * @param lastname
 * @param email
 * @param password
 * @returns {boolean}
 */
function registerAuser(firstname, lastname, email, password) {
    // register succeed:
    return true;
}

/**
 * check server if this email is unregistered
 * @param email
 * @returns {boolean}
 */
function unregisteredEmail(email) {
    //assume a@a.com is registered
    if (email == "a@a.com") {
        return false;
    }
    return true;
}
{% endhighlight %}

# References:

- [http://getbootstrap.com/javascript/#modals](http://getbootstrap.com/javascript/#modals)
- [https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
- [http://getbootstrap.com/css/#forms](http://getbootstrap.com/css/#forms)
- [http://getbootstrap.com/css/#forms-control-validation](http://getbootstrap
.com/css/#forms-control-validation)
- [https://developer.mozilla
.org/en-US/docs/Web/Guide/HTML/Forms/Data_form_validation](https://developer.mozilla
                                                           .org/en-US/docs/Web/Guide/HTML/Forms/Data_form_validation)


