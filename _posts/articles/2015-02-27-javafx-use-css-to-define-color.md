---
layout: post
title: JavaFX use CSS to define color
excerpt: "Example code for using CSS to create JavaFX color theme"
categories: articles
tags: [code, Java, JavaFX, GUI, CSS, fxml]
image:
  feature: 14771654073_df0ddb828f_o.jpg
  credit: GuoJunjun
  creditlink: http://junjunguo.com
comments: true
share: true
---

JavaFX is intended to replace Swing as the standard GUI library for Java SE, it supports desktop computers and web browsers. Oracle: [JavaFX overview](http://docs.oracle.com/javase/8/javafx/get-started-tutorial/jfx-overview.htm#JFXST784)

JavaFX delivers many options for developers to decide how to implement their GUI. 

1. Java Class: all can be done in a standard Java Class.

2. FXML: The FXML scripting language and be used to separate the user interface and the back-end logic. UI can be presented in FXML and application logic can be write in Java code.
    * JavaFX scene builder: Can be used to define your UI.

3. CSS: Cascading Style Sheets can be used to separate appearance and style.

Even all can be done in Java code, but there are many advantages for using FXML and CSS separately. 

 * Developer who has web design background would like to do it this way.
 * It is more structured, easy to organize, divide jobs if you are working with others. 
 * Increase code reusability, since logic code, UI, and style are organized separately, all part can be easily used again.
 * Easy to maintain, modifier, replace and debug ...

###Use JavaFX to build a Login screen

Example code are created with IntelliJ, but any IDE should work the same way.

1. Build a JavaFX Application.

2. Use JavaFX scene builder to build UI.
 * Reference your CSS style file in Scene Builder or add `stylesheets="@yourstylesheetName.css"` to your fxml code. 
 * Reference your CSS styleClass in Scene Builder or add `styleClass="yourstyleClassName"` to the desired Object. 

This is how my FXML look like:
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<?import javafx.scene.control.*?>
<?import javafx.scene.layout.*?>
<?import javafx.scene.text.Text?>
<Pane maxHeight="-Infinity" maxWidth="-Infinity" minHeight="-Infinity" minWidth="-Infinity" prefHeight="555.0"
      prefWidth="800.0" styleClass="thebackground" stylesheets="@style.css" xmlns="http://javafx.com/javafx/8"
      xmlns:fx="http://javafx.com/fxml/1" fx:controller="sample.Controller">
    <children>
        <GridPane alignment="CENTER" layoutX="300.0" layoutY="50.0" prefHeight="300.0" prefWidth="200.0">
            <columnConstraints>
                <ColumnConstraints hgrow="SOMETIMES" minWidth="10.0" prefWidth="100.0"/>
            </columnConstraints>
            <rowConstraints>
                <RowConstraints maxHeight="55.0" minHeight="55.0" prefHeight="55.0" vgrow="SOMETIMES"/>
                <RowConstraints maxHeight="55.0" minHeight="55.0" prefHeight="55.0" vgrow="SOMETIMES"/>
                <RowConstraints maxHeight="55.0" minHeight="55.0" prefHeight="55.0" vgrow="SOMETIMES"/>
                <RowConstraints maxHeight="55.0" minHeight="55.0" prefHeight="55.0" vgrow="SOMETIMES"/>
                <RowConstraints maxHeight="55.0" minHeight="55.0" prefHeight="55.0" vgrow="SOMETIMES"/>
                <RowConstraints maxHeight="55.0" minHeight="55.0" prefHeight="55.0" vgrow="SOMETIMES"/>
                <RowConstraints maxHeight="80.0" minHeight="80.0" prefHeight="55.0" vgrow="SOMETIMES"/>
            </rowConstraints>
            <children>
                <TextField fx:id="userName" alignment="CENTER" prefHeight="40.0" promptText="User ID"
                           styleClass="inputSection" GridPane.halignment="CENTER" GridPane.rowIndex="2"
                           GridPane.valignment="CENTER"/>
                <Label styleClass="sectionTitle" text="Login" GridPane.halignment="CENTER" GridPane.rowIndex="1"
                       GridPane.valignment="CENTER"/>
                <Label styleClass="sectionTitle" text="Calendar" GridPane.halignment="CENTER"
                       GridPane.valignment="CENTER"/>
                <Button mnemonicParsing="false" onAction="#loginOnclick" prefHeight="40.0" prefWidth="200.0"
                        text="Login" GridPane.halignment="CENTER" GridPane.rowIndex="4" GridPane.valignment="CENTER"/>
                <Button mnemonicParsing="false" onAction="#registerOnClick" prefHeight="40.0" prefWidth="200.0"
                        text="Register" GridPane.rowIndex="5"/>
                <Text fx:id="warningText" strokeType="OUTSIDE" strokeWidth="0.0" GridPane.rowIndex="6"/>
                <PasswordField fx:id="userPassword" alignment="CENTER" prefHeight="40.0" promptText="Password"
                               GridPane.halignment="CENTER" GridPane.rowIndex="3" GridPane.valignment="CENTER"
                               styleClass="inputSection"/>
            </children>
        </GridPane>
    </children>
</Pane>
{% endhighlight %}

Logical code in Controller:
{% highlight java %}
@FXML private Text warningText;

@FXML private TextField userName;
@FXML private PasswordField userPassword;

@FXML
public void loginOnclick(ActionEvent event) {
    //logic code:
    warningText.setText("Wrong id or password!");
}

@FXML
public void registerOnClick(ActionEvent event) {
    //logic code:
    warningText.setText("Register not yet implemented!");
}
{% endhighlight %}

Finally define the application style in CSS:
{% highlight css %}
.thebackground {
    -fx-background-color : #B3E5FC;
    }

.sectionTitle {
    -fx-text-fill   : #01579B;
    -fx-font-weight : bolder;
    -fx-font-size   : 14px;
    }

.warningText {
    -fx-fill : #0277BD;
    }

.inputSection {
    -fx-background-color : #E1F5FE;
    }

.button {
    -fx-background-color : #29B6F6;
    -fx-text-fill        : #E1F5FE;
    -fx-font-weight      : 900;
    }

.button:hover {
    -fx-background-color : #01579B;
    }
{% endhighlight %}

Here is a screenshot of the Light blue theme has been built:

![light blue theme](https://raw.githubusercontent
.com/junjunguo/HumanComputerInteraction/ce1607d4885edfc942fc42a0073a27e772578da2/ExampleCode/lightbluelogin.png)

![light blue theme](https://raw.githubusercontent.com/junjunguo/HumanComputerInteraction/ce1607d4885edfc942fc42a0073a27e772578da2/ExampleCode/lightblueloginr.png)

Source code: [on GitHub](https://github.com/junjunguo/HumanComputerInteraction/tree/master/ExampleCode)
